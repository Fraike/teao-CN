import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
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
    dateModified: article.publishedAt,
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

      <PageHero
        eyebrow={article.categoryLabel}
        title={article.title}
        description={article.summary}
        breadcrumb={[
          { label: "首页", href: "/" },
          { label: "新闻", href: "/news/" },
          { label: article.title },
        ]}
        actions={
          <span className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold text-muted">
            {article.publishedAt}
          </span>
        }
      />

      <article className={`${container} py-16 lg:py-20`}>
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-surface">
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
