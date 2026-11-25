import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { buildCategoryPatch, validateCategoryCreate } from "@/lib/category-admin";
import { revalidateCatalog } from "@/lib/content-revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
  return NextResponse.json({ categories: rows });
}

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const { patch, error } = buildCategoryPatch(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const required = validateCategoryCreate(patch);
  if (required) return NextResponse.json({ error: required }, { status: 400 });

  const [slugExists] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, String(patch.slug))).limit(1);
  if (slugExists) return NextResponse.json({ error: "该 slug 已被占用" }, { status: 409 });
  const [pathExists] = await db.select({ id: categories.id }).from(categories).where(eq(categories.path, String(patch.path))).limit(1);
  if (pathExists) return NextResponse.json({ error: "该分类路径已被占用" }, { status: 409 });

  const [created] = await db.insert(categories).values({
    slug: String(patch.slug),
    path: String(patch.path),
    name: String(patch.name),
    description: String(patch.description),
    image: String(patch.image),
    pageSize: patch.pageSize ? Number(patch.pageSize) : 12,
    sortOrder: patch.sortOrder ? Number(patch.sortOrder) : 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning({ id: categories.id });

  revalidateCatalog([String(patch.path)], true);
  return NextResponse.json({ id: created.id }, { status: 201 });
}
