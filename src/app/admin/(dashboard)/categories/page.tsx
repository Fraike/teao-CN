import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import CategoryTable from "@/components/admin/category-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [rows, productRows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select({ category: products.category }).from(products),
  ]);

  const data = rows.map(category => {
    const productCount = productRows.filter(product => product.category === category.slug).length;
    return {
      id: category.id,
      slug: category.slug,
      path: category.path,
      name: category.name,
      image: category.image,
      pageSize: category.pageSize,
      sortOrder: category.sortOrder,
      productCount,
      pageCount: Math.max(1, Math.ceil(productCount / category.pageSize)),
    };
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-ink">分类管理</h1>
          <p className="mt-1 text-sm text-muted">分类路径与每页产品数锁定后，旧分页 URL 保持不变。</p>
        </div>
        <Link href="/admin/categories/new" className="inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
          新增分类
        </Link>
      </div>
      <CategoryTable data={data} />
    </div>
  );
}
