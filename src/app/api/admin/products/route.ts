import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { buildProductPatch, validateProductCreate } from "@/lib/product-admin";
import { dbProductData } from "@/lib/admin-serializers";
import { revalidateCatalog } from "@/lib/content-revalidate";
import { scheduleBaiduPush } from "@/lib/baidu-push";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const query = new URL(request.url).searchParams;
  const q = (query.get("q") ?? "").toLowerCase();
  const category = query.get("category") ?? "";
  const status = query.get("status") ?? "";
  const rows = await db.select().from(products).orderBy(desc(products.updatedAt), desc(products.id));
  const filtered = rows.filter(row => {
    if (q && ![row.model, row.name, row.listingTitle].join(" ").toLowerCase().includes(q)) return false;
    if (category && row.category !== category) return false;
    if (status === "active" && !row.isActive) return false;
    if (status === "draft" && row.isActive) return false;
    return true;
  });
  return NextResponse.json({ products: filtered });
}

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const { patch, error } = buildProductPatch(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const required = validateProductCreate(patch);
  if (required) return NextResponse.json({ error: required }, { status: 400 });

  const categorySlug = String(patch.category);
  const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
  if (!category) return NextResponse.json({ error: "分类不存在" }, { status: 400 });
  if (!String(patch.path).startsWith(category.path)) {
    return NextResponse.json({ error: `历史路径必须以 ${category.path} 开头` }, { status: 400 });
  }

  const [pathExists] = await db.select({ id: products.id }).from(products).where(eq(products.path, String(patch.path))).limit(1);
  if (pathExists) return NextResponse.json({ error: "该历史路径已被占用" }, { status: 409 });
  const [slugExists] = await db.select({ id: products.id }).from(products).where(eq(products.slug, String(patch.slug))).limit(1);
  if (slugExists) return NextResponse.json({ error: "该 slug 已被占用" }, { status: 409 });

  const data = dbProductData({
    ...patch,
    listingTitle: patch.listingTitle || patch.name,
    description: patch.description || patch.summary,
    images: patch.images ?? [{ url: patch.image, alt: patch.name }],
    status: patch.isActive ? "active" : "inactive",
  });

  const [created] = await db.insert(products).values(data as typeof products.$inferInsert).returning({ id: products.id });
  revalidateCatalog([String(patch.path)]);
  const active = patch.isActive === undefined ? true : Boolean(patch.isActive);
  if (active) scheduleBaiduPush([String(patch.path)], "push");
  return NextResponse.json({ id: created.id }, { status: 201 });
}
