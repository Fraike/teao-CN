import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { buildCategoryPatch } from "@/lib/category-admin";
import { revalidateCatalog } from "@/lib/content-revalidate";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的分类 ID" }, { status: 400 });
  const [existing] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "分类不存在" }, { status: 404 });

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const { patch, error } = buildCategoryPatch(body, existing);
  if (error) return NextResponse.json({ error }, { status: 400 });

  if (patch.slug && patch.slug !== existing.slug) {
    const [duplicate] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, String(patch.slug))).limit(1);
    if (duplicate && duplicate.id !== id) return NextResponse.json({ error: "该 slug 已被占用" }, { status: 409 });
  }
  if (patch.path && patch.path !== existing.path) {
    const [duplicate] = await db.select({ id: categories.id }).from(categories).where(eq(categories.path, String(patch.path))).limit(1);
    if (duplicate && duplicate.id !== id) return NextResponse.json({ error: "该分类路径已被占用" }, { status: 409 });
  }

  await db.update(categories).set({ ...patch, updatedAt: new Date() }).where(eq(categories.id, id));
  revalidateCatalog([existing.path, String(patch.path ?? existing.path)], true);
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的分类 ID" }, { status: 400 });
  const [existing] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "分类不存在" }, { status: 404 });

  const used = await db.select({ id: products.id }).from(products).where(eq(products.category, existing.slug)).limit(1);
  if (used.length) return NextResponse.json({ error: "该分类下还有商品，不能删除" }, { status: 409 });

  await db.delete(categories).where(eq(categories.id, id));
  revalidateCatalog([existing.path], true);
  return NextResponse.json({ success: true });
}
