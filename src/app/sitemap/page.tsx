import type { Metadata } from "next";
import Link from "next/link";
import { liveCatalog } from "@/lib/live-catalog";
import { liveCategories, liveHref, LIVE_ORIGIN } from "@/lib/live-site";
import { newsArticles } from "@/content/live-site/news";
import { container } from "@/components/live-site/container";
import productPaths from "@/content/live-site/product-paths.json";

export const metadata: Metadata = {
  title: { absolute: "网站地图 | 特澳 TEAO" },
  description: "特澳 TEAO 全站导航:产品分类与型号、应用领域、质量控制、新闻、常见问题与联系方式。",
  alternates: { canonical: LIVE_ORIGIN + "/sitemap/" },
  robots: { index: true, follow: true },
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
        <h2 className="text-[13px] font-black uppercase tracking-[0.12em] text-ink">{title}</h2>
        {typeof count === "number" && <span className="text-[11px] font-bold text-muted-light">{count} 项</span>}
      </div>
      {children}
    </section>
  );
}

export default function SiteMapPage() {
  return (
    <div className={`${container} py-14`}>
      <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
        <span className="h-px w-[22px] bg-brand-500" />
        网站地图
      </p>
      <h1 className="mt-3 text-[clamp(32px,4vw,46px)] font-black leading-[1.05] tracking-[-0.04em] text-ink">全站导航</h1>
      <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-muted">
        按栏目浏览特澳官网的全部页面,包括产品分类与已承接型号、应用领域、新闻与技术工具。
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Card title="主要页面" count={mainLinks.length}>
          <LinkList items={mainLinks} />
        </Card>

        <Card title="应用领域" count={applicationLinks.length}>
          <LinkList items={applicationLinks} />
        </Card>

        <Card title="新闻" count={newsArticles.length}>
          <LinkList items={newsArticles.map(article => ({ label: article.title, href: `/news/${article.slug}.html` }))} />
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
    </div>
  );
}
