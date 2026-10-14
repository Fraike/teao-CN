import Image from "next/image";
import Link from "next/link";
import products from "@/content/live-site/gear-products.json";
import { liveCategories, liveHref, PILOT_PRODUCT_PATH } from "@/lib/live-site";
import { liveCatalog, type CatalogCategory, type CatalogPage, type CatalogProduct } from "@/lib/live-catalog";

export const container = "mx-auto w-full max-w-7xl px-5 lg:px-8";

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
  return <><Breadcrumb category={category} /><div className={`${container} pb-8`}><CategoryNav active={category.path} /></div>
    <section className="border-y border-line bg-white"><div className={`${container} grid items-center gap-8 py-10 md:grid-cols-[1fr_1.15fr] lg:py-14`}>
      <div className="relative aspect-[1.5] max-h-[320px]"><Image src={category.image} alt={`特澳${category.label}系列`} fill sizes="(max-width: 768px) 90vw, 500px" className="object-contain" priority /></div>
      <div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.label}</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted">{category.description}</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="#products" className="rounded-md bg-brand-500 px-6 py-3 text-sm font-bold text-white">浏览产品</a><a href={liveHref("/contacts/")} className="rounded-md border border-line px-6 py-3 text-sm font-bold">咨询选型</a></div>
      </div>
    </div></section>
    <section id="products" className={`${container} scroll-mt-24 py-12`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl font-bold">产品型号</h2><p className="text-sm text-muted">第 {page.number} 页 / 共 {category.pages.length} 页 · 本页 {page.products.length} 款</p></div>
      <ProductCards items={page.products} />
      {category.pages.length > 1 && <nav aria-label="产品分页" className="mt-10 flex flex-wrap justify-center gap-2">
        {page.number > 1 && <Link href={category.pages[page.number - 2].path} className="rounded border border-line bg-white px-4 py-2">上一页</Link>}
        {category.pages.map(item => item.number === page.number ? <span key={item.path} aria-current="page" className="rounded border border-brand-500 bg-brand-500 px-4 py-2 text-white">{item.number}</span> : <Link key={item.path} href={item.path} className="rounded border border-line bg-white px-4 py-2 hover:border-brand-500">{item.number}</Link>)}
        {page.number < category.pages.length && <Link href={category.pages[page.number].path} className="rounded border border-line bg-white px-4 py-2">下一页</Link>}
      </nav>}
    </section>
  </>;
}
