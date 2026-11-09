import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { newsArticles } from "@/content/live-site/news";

const newsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "新闻",
  description: "特澳最新动态、阻尼器工程进展、质量管理与技术资源。",
  url: "https://www.chinateao.com/news/",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: newsArticles.map((article, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Thing", name: article.title, url: `https://www.chinateao.com/news/${article.slug}.html` },
    })),
  },
};

export default function NewsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />
      <section className={`${container} py-14`}>
        <h1 className="sr-only">新闻 | 特澳 TEAO</h1>
        <SectionHead
          eyebrow="新闻"
          title="公司动态与工程进展"
          description="特澳最新动态、阻尼器工程进展、质量管理与技术资源。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article, i) => (
            <Reveal key={article.slug} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
              <Link href={`/news/${article.slug}.html`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_52px_rgba(0,0,0,0.1)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image src={article.image} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">{article.categoryLabel}</span>
                  <h2 className="line-clamp-2 text-lg font-extrabold leading-[1.2] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-700">{article.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{article.summary}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                    <span>{article.publishedAt}</span>
                    <span className="font-bold text-brand-700 group-hover:underline">阅读全文 →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
