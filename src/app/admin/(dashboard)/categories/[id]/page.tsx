import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import CategoryForm from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!category) notFound();
  const productRows = await db.select({ id: products.id }).from(products).where(eq(products.category, category.slug));

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/categories" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回分类列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">编辑 {category.name}</h1>
        <p className="mt-1 text-xs text-muted-light">商品数：{productRows.length}</p>
      </div>
      <CategoryForm
        initial={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          path: category.path,
          description: category.description,
          image: category.image,
          pageSize: category.pageSize,
          sortOrder: category.sortOrder,
        }}
        productCount={productRows.length}
      />
    </div>
  );
}
