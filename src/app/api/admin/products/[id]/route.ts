import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { buildProductPatch } from "@/lib/product-admin";
import { dbProductData } from "@/lib/admin-serializers";
import { revalidateCatalog } from "@/lib/content-revalidate";
import { scheduleBaiduPush } from "@/lib/baidu-push";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的商品 ID" }, { status: 400 });
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "商品不存在" }, { status: 404 });

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const { patch, error } = buildProductPatch(body, existing.path);
  if (error) return NextResponse.json({ error }, { status: 400 });

  if (patch.category) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, String(patch.category))).limit(1);
    if (!category) return NextResponse.json({ error: "分类不存在" }, { status: 400 });
  }
  if (patch.slug) {
    const [duplicate] = await db.select({ id: products.id }).from(products)
      .where(eq(products.slug, String(patch.slug))).limit(1);
    if (duplicate && duplicate.id !== id) return NextResponse.json({ error: "该 slug 已被占用" }, { status: 409 });
  }

  const data = dbProductData({ ...patch, updatedAt: new Date() });
  await db.update(products).set(data).where(eq(products.id, id));
  revalidateCatalog([existing.path, String(patch.path ?? existing.path)]);
  if (patch.isActive !== undefined) {
    scheduleBaiduPush([existing.path], Number(patch.isActive) ? "push" : "delete");
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的商品 ID" }, { status: 400 });
  const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: "商品不存在" }, { status: 404 });

  await db.delete(products).where(eq(products.id, id));
  revalidateCatalog([existing.path]);
  scheduleBaiduPush([existing.path], "delete");
  return NextResponse.json({ success: true });
}
