import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import ProductForm from "@/components/admin/product-form";
import { adminProduct } from "@/lib/admin-serializers";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [product, categoryRows] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).limit(1).then(rows => rows[0]),
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
  ]);
  if (!product) notFound();
  const serialized = adminProduct(product);
  const initial = {
    ...serialized,
    isActive: Boolean(product.isActive),
    listingTitle: product.listingTitle ?? "",
    hardTorque: product.hardTorque ?? "",
    hardForce: product.hardForce ?? "",
    soundType: product.soundType ?? "",
    bufferDirection: product.bufferDirection ?? "",
    assemblyMethod: product.assemblyMethod ?? "",
    dimensionDrawing: product.dimensionDrawing ?? "",
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回商品列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">编辑 {product.model}</h1>
        <p className="mt-1 text-xs text-muted-light">最后更新：{product.updatedAt ? new Date(product.updatedAt).toLocaleString("zh-CN") : "—"}</p>
      </div>
      <ProductForm
        initial={initial}
        categories={categoryRows.map(category => ({ slug: category.slug, name: category.name, path: category.path }))}
      />
    </div>
  );
}
