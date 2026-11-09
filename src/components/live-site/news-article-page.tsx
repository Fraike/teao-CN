import Image from "next/image";
import Link from "next/link";
import { container } from "./catalog";
import type { NewsArticle } from "@/content/live-site/news";

const COMPANY_NAME = "东莞市特澳电子科技有限公司";

function articleJsonLd(article: NewsArticle) {
  const url = `https://www.chinateao.com/news/${article.slug}.html`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    image: `https://www.chinateao.com${article.image}`,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: COMPANY_NAME },
    publisher: { "@type": "Organization", name: COMPANY_NAME },
  };
}

export default function NewsArticlePage({ article }: { article: NewsArticle }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }} />
      <article className={`${container} py-14`}>
        <div className="mx-auto max-w-3xl">
          <nav aria-label="面包屑" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-brand-700">首页</Link>
            <span>/</span>
            <Link href="/news/" className="hover:text-brand-700">新闻</Link>
            <span>/</span>
            <span aria-current="page" className="min-w-0 truncate text-ink">{article.title}</span>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-white">{article.categoryLabel}</span>
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-bold text-muted">{article.publishedAt}</span>
          </div>

          <h1 className="text-[32px] font-black leading-[1.15] tracking-tight text-ink sm:text-[40px]">{article.title}</h1>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{article.summary}</p>

          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-surface">
            <Image src={article.image} alt={article.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-contain p-6" />
          </div>

          <div className="mt-10 space-y-5">
            {article.content.map(paragraph => (
              <p key={paragraph} className="text-[15px] leading-8 text-ink-soft">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <Link href="/news/" className="text-sm font-medium text-muted transition-colors hover:text-brand-700">← 返回新闻列表</Link>
          </div>
        </div>
      </article>
    </>
  );
}
