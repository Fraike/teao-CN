import type { Metadata } from "next";
import Link from "next/link";
import { liveCatalog } from "@/lib/live-catalog";
import { liveCategories, liveHref, LIVE_ORIGIN } from "@/lib/live-site";
import { getPublishedNews } from "@/lib/news-store";
import { container } from "@/components/live-site/container";
import { PageHero } from "@/components/ui/page-hero";
import { pageOpenGraph } from "@/lib/metadata";
import productPaths from "@/content/live-site/product-paths.json";

export const metadata: Metadata = {
  title: { absolute: "网站地图 | 特澳 TEAO" },
  description: "特澳 TEAO 全站导航:产品分类与型号、应用领域、质量控制、新闻、常见问题与联系方式。",
  alternates: { canonical: LIVE_ORIGIN + "/sitemap/" },
  robots: { index: true, follow: true },
  openGraph: pageOpenGraph({
    title: "网站地图 | 特澳 TEAO",
    description: "按栏目浏览特澳官网的全部页面。",
    path: "/sitemap/",
  }),
};

const mainLinks = [
  { label: "首页", href: "/" },
  { label: "产品中心", href: "/products/" },
  { label: "应用案例", href: "/applications/" },
  { label: "质量控制", href: "/quality-control/" },
  { label: "常见问题", href: "/faq/" },
  { label: "扭矩换算", href: "/convert/" },
  { label: "新闻", href: "/news/" },
  { label: "关于我们", href: "/about-us/" },
  { label: "联系我们", href: "/contacts/" },
];

const applicationLinks = [
  { label: "汽车内外饰", href: "/applications/automotive-interior/" },
  { label: "汽车内饰", href: "/applications/automotive-interior/internal/" },
  { label: "汽车外饰", href: "/applications/automotive-interior/external/" },
  { label: "家居", href: "/applications/home-life/" },
  { label: "办公设备", href: "/applications/office-equipment/" },
  { label: "工业设备", href: "/applications/industrial-application/" },
];

const localProductPaths = new Set(productPaths);

function LinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map(item => (
        <li key={item.href}>
          <Link href={item.href} className="text-sm text-ink-soft transition-colors hover:text-brand-700">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Card({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-line-soft pb-3">
        <h2 className="text-sm font-black tracking-[-0.01em] text-ink">{title}</h2>
        {typeof count === "number" && <span className="text-[11px] font-bold text-muted-light">{count} 项</span>}
      </div>
      {children}
    </section>
  );
}

const sitemapJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "网站地图 | 特澳 TEAO",
  description: "按栏目浏览特澳官网的全部页面。",
  url: LIVE_ORIGIN + "/sitemap/",
};

export default async function SiteMapPage() {
  const newsArticles = await getPublishedNews();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sitemapJsonLd) }} />
      <PageHero
        eyebrow="网站地图"
        title="全站导航"
        description="按栏目浏览特澳官网的全部页面,包括产品分类与已承接型号、应用领域、新闻与技术工具。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "网站地图" }]}
      />

      <section className={`${container} py-16 lg:py-20`}>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="主要页面" count={mainLinks.length}>
          <LinkList items={mainLinks} />
        </Card>

        <Card title="应用领域" count={applicationLinks.length}>
          <LinkList items={applicationLinks} />
        </Card>

        <Card title="新闻" count={newsArticles.length}>
          <div className="space-y-3">
            {[...new Set(newsArticles.map(article => article.publishedAt.slice(0, 4)))].map(year => {
              const items = newsArticles.filter(article => article.publishedAt.startsWith(year));
              return (
                <details key={year} open={year === newsArticles[0]?.publishedAt.slice(0, 4)}>
                  <summary className="cursor-pointer list-none text-sm font-bold text-ink">
                    {year}
                    <span className="ml-1.5 text-[11px] font-semibold text-muted-light">({items.length})</span>
                  </summary>
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {items.map(article => (
                      <li key={article.slug}>
                        <Link href={`/news/${article.slug}.html`} className="text-[13px] leading-snug text-ink-soft transition-colors hover:text-brand-700">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-3">
          <Card title="产品分类与型号" count={liveCategories.length}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {liveCatalog.map(category => {
                const products = category.pages
                  .flatMap(page => page.products)
                  .filter(product => localProductPaths.has(product.path));
                return (
                  <div key={category.id}>
                    <Link href={liveHref(category.path)} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline">
                      {category.label}
                      <span className="text-[11px] font-semibold text-muted-light">({products.length})</span>
                    </Link>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                      {products.map(product => (
                        <li key={product.path}>
                          <Link href={product.path} className="text-[12.5px] text-muted transition-colors hover:text-brand-700">
                            {product.model}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      </section>
    </>
  );
}
