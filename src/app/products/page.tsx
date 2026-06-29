import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "产品中心",
  description:
    "特澳 TEAO 产品中心 — 齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制零部件。支持扭矩范围、阻尼方向、安装方式和材料定制。",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const activeCategory = typeof sp.category === "string" ? sp.category : null;

  const [allProducts, allCategories] = await Promise.all([
    db.select().from(products).where(eq(products.isActive, 1)).orderBy(products.sortOrder),
    db.select().from(categories).orderBy(categories.sortOrder),
  ]);

  const filteredProducts = activeCategory
    ? allProducts.filter((p) => p.category === activeCategory)
    : allProducts;

  const currentCategoryName =
    activeCategory
      ? allCategories.find((c) => c.slug === activeCategory)?.name ?? activeCategory
      : null;

  return (
    <>
      {/* Page Header */}
      <section className="bg-white border-b border-line">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] py-16">
          <SectionHead
            eyebrow="产品中心"
            title={
              <>
                从标准型号到
                <b className="font-black text-brand-700">按图非标定制</b>
              </>
            }
            description="每款产品支持扭矩范围、阻尼方向、安装方式和材料定制。点击产品查看详细参数。"
          />
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="bg-surface py-8 border-b border-line-soft">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/products"
              className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                !activeCategory
                  ? "bg-brand-500 text-white shadow-md"
                  : "bg-white text-ink-soft border border-line hover:border-brand-500 hover:text-brand-700"
              }`}
            >
              全部
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? "bg-brand-500 text-white shadow-md"
                    : "bg-white text-ink-soft border border-line hover:border-brand-500 hover:text-brand-700"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {currentCategoryName && (
            <p className="mt-3 text-sm text-muted">
              当前分类：<span className="font-semibold text-brand-700">{currentCategoryName}</span>
              ，共 <span className="font-semibold text-brand-700">{filteredProducts.length}</span> 款产品
            </p>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-white py-16">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-muted">
              <p className="text-lg">该分类暂无产品</p>
              <Link href="/products" className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:underline">
                查看全部产品 &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5">
              {filteredProducts.map((product, i) => (
                <Reveal key={product.id} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
                  <article className="group rounded-[14px] border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 ease-out hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                    {/* Image */}
                    <div className="grid place-items-center aspect-[1/0.78] bg-[#FAF8F5] p-[22px] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[88%] object-contain transition-transform duration-400 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Body */}
                    <div className="px-5 pt-[18px] pb-[22px]">
                      {/* Model badge */}
                      <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 mb-2">
                        {product.model}
                      </span>
                      <h3 className="text-base font-bold text-ink">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-[12.5px] leading-[1.65] text-muted line-clamp-2">
                        {product.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-soft">
                        <Link
                          href={`/products/${product.category}/${product.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 transition-all duration-200 hover:gap-[7px]"
                        >
                          详情 &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
