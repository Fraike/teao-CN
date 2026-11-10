import Image from "next/image";
import Link from "next/link";
import products from "@/content/live-site/gear-products.json";
import { liveCategories, liveHref, LIVE_ORIGIN, PILOT_PRODUCT_PATH } from "@/lib/live-site";
import { liveCatalog, type CatalogCategory, type CatalogPage, type CatalogProduct } from "@/lib/live-catalog";
import { enrichProduct } from "@/lib/product-enrichment";
import { compareModel } from "@/lib/product-sort";
import ProductCard from "./product-card";
import ListingHero from "./listing-hero";
import ListingTabs from "./listing-tabs";
import ListingPagination from "./listing-pagination";
import InquiryCTA from "./inquiry-cta";
import { container } from "./container";

export { container };

export function Breadcrumb({ product = false, category = liveCatalog[0] }: { product?: boolean; category?: CatalogCategory }) {
  return <nav aria-label="面包屑" className={`${container} flex flex-wrap gap-2 py-5 text-xs text-muted`}>
    <a href={liveHref("/")} className="hover:text-brand-700">首页</a><span>/</span>
    <a href={liveHref("/products/")} className="hover:text-brand-700">产品</a><span>/</span>
    {product ? <><Link href="/gear-damper/" className="hover:text-brand-700">齿轮阻尼器</Link><span>/</span><span aria-current="page">RD-T038 / RD-V038</span></> : <span aria-current="page">{category.label}</span>}
  </nav>;
}

export function CategoryNav({ active = "/gear-damper/" }: { active?: string }) {
  return <nav aria-label="产品类别" className="flex flex-wrap gap-2">{liveCategories.map(category =>
    <a key={category.path} href={liveHref(category.path)} aria-current={category.path === active ? "page" : undefined} className={`rounded-md border px-4 py-3 text-sm font-semibold transition-colors ${category.path === active ? "border-brand-500 bg-brand-500 text-white" : "border-line bg-white hover:border-brand-500 hover:text-brand-700"}`}>{category.label}</a>
  )}</nav>;
}

export function ProductCards({ related = false, items = products }: { related?: boolean; items?: CatalogProduct[] }) {
  const cards = related ? items.slice(0, 5) : items;
  return <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${related ? "xl:grid-cols-5" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
    {cards.map(product => <article key={product.path} className="overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-brand-500">
      <a href={liveHref(product.path)} className="relative block aspect-[1.25] border-b border-line-soft">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px" className="object-contain p-4" draggable={false} />
      </a>
      <div className="p-5"><h3 className="text-lg font-bold"><a href={liveHref(product.path)}>{product.model}</a></h3>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm text-muted">{product.title}</p>
        {!related && <ul className="mt-4 space-y-1 border-t border-line-soft pt-3 text-xs text-ink-soft">{product.specifications.filter(spec => !spec.startsWith("压力角:") && !(product.path === PILOT_PRODUCT_PATH && (spec.startsWith("尺寸:") || spec.startsWith("模数:")))).map(spec => <li key={spec}>{spec}</li>)}</ul>}
        <a href={liveHref(product.path)} className="mt-4 inline-block text-sm font-bold text-brand-700 underline-offset-4 hover:underline">{liveHref(product.path).startsWith("/") ? "查看产品详情" : "查看原站详情"}</a>
      </div>
    </article>)}
  </div>;
}

export function CategoryPage({ category = liveCatalog[0], page = category.pages[0] }: { category?: CatalogCategory; page?: CatalogPage } = {}) {
  const sorted = category.pages
    .flatMap(item => item.products.map(product => enrichProduct(category.id, product)))
    .sort((a, b) => compareModel(a.model, b.model));
  const offset = category.pages
    .slice(0, page.number - 1)
    .reduce((sum, item) => sum + item.products.length, 0);
  const enriched = sorted.slice(offset, offset + page.products.length);
  const totalCount = category.pages.reduce((sum, item) => sum + item.products.length, 0);
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.label}产品`,
    description: category.description,
    url: LIVE_ORIGIN + encodeURI(page.path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: enriched.map((product, index) => ({
        "@type": "ListItem",
        position: offset + index + 1,
        item: { "@type": "Product", name: product.model, description: product.title, url: liveHref(product.path) },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: LIVE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "产品", item: LIVE_ORIGIN + "/products/" },
      { "@type": "ListItem", position: 3, name: category.label, item: LIVE_ORIGIN + encodeURI(category.pages[0].path) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ListingHero title={category.label} description={category.description} crumb={category.label} />
      <ListingTabs active={category.path} />
      <section id="products" className={`${container} scroll-mt-24 pb-12 pt-8`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-light">产品</span>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-xs font-extrabold text-white">{totalCount}</span>
          </div>
          <p className="text-xs text-muted">第 {page.number} / {category.pages.length} 页 · 本页 {page.products.length} 款</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:gap-5">
          {enriched.map(product => <ProductCard key={product.path} product={product} />)}
        </div>

        <ListingPagination
          page={page.number}
          totalPages={category.pages.length}
          hrefFor={(number) => category.pages[number - 1].path}
        />
      </section>
      <InquiryCTA />
    </>
  );
}
