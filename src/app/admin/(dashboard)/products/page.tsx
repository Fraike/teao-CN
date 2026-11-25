import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import ProductListTable from "@/components/admin/product-list-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [rows, categoryRows] = await Promise.all([
    db.select().from(products).orderBy(desc(products.updatedAt), desc(products.id)),
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
  ]);

  const data = rows.map(product => ({
    id: product.id,
    model: product.model,
    name: product.name,
    listingTitle: product.listingTitle,
    path: product.path,
    category: product.category,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-ink">商品管理</h1>
          <p className="mt-1 text-sm text-muted">共 {rows.length} 个商品。编辑后前台立即生效。</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
          新增商品
        </Link>
      </div>
      <ProductListTable data={data} categories={categoryRows.map(category => ({ slug: category.slug, name: category.name }))} />
    </div>
  );
}
