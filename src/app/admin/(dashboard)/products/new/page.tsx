import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回商品列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">新增商品</h1>
        <p className="mt-1 text-sm text-muted">填写型号、历史路径和分类后保存。</p>
      </div>
      <ProductForm isNew categories={rows.map(category => ({ slug: category.slug, name: category.name, path: category.path }))} />
    </div>
  );
}
