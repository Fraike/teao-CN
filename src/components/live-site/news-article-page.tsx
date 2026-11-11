import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { LIVE_ORIGIN } from "@/lib/live-site";
import { prepareArticleHtml } from "@/lib/article-html";
import { getPublishedNews, type PublicNews } from "@/lib/news-store";
import { contact, telHref } from "@/content/live-site/contact";
import { container } from "./container";
import InquiryCTA from "./inquiry-cta";

const COMPANY_NAME = "东莞市特澳电子科技有限公司";

function articleJsonLd(article: PublicNews) {
  const url = `${LIVE_ORIGIN}/news/${article.slug}.html`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: article.cover ? LIVE_ORIGIN + article.cover : LIVE_ORIGIN + "/images/og/default.jpg",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: COMPANY_NAME },
    publisher: { "@type": "Organization", name: COMPANY_NAME },
  };
}

export default async function NewsArticlePage({ article }: { article: PublicNews }) {
  const { html, headings } = prepareArticleHtml(article.content);
  const all = await getPublishedNews();
  const sameCategory = all.filter(item => item.category === article.category && item.slug !== article.slug);
  const others = all.filter(item => item.category !== article.category && item.slug !== article.slug);
  const related = [...sameCategory, ...others].slice(0, 3);
  const takeaways = headings.length >= 2
    ? headings.slice(0, 4).map(heading => heading.text)
    : article.summary.split(/[。!?]/).map(item => item.trim()).filter(Boolean).slice(0, 3);

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

      <div className={`${container} py-16 lg:py-20`}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article>
            {takeaways.length > 0 && (
              <div className="mb-8 rounded-2xl border border-brand-500/20 bg-brand-50/60 p-5">
                <p className="text-micro font-black uppercase tracking-[0.14em] text-brand-700">核心要点</p>
                <ul className="mt-3 space-y-2">
                  {takeaways.map(item => (
                    <li key={item} className="flex items-start gap-2 text-body leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.cover && (
              <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative aspect-[16/9]">
                  <Image src={article.cover} alt={article.title} fill priority sizes="(max-width: 1024px) 100vw, 880px" className="object-cover" />
                </div>
              </figure>
            )}

            <div className="rich-text mt-8" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-12 border-t border-line pt-8">
              <Link href="/news/" className="text-body font-medium text-muted transition-colors hover:text-brand-700">← 返回新闻列表</Link>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24">
            {headings.length > 0 && (
              <nav aria-label="本文目录" className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-3 text-micro font-black uppercase tracking-[0.14em] text-muted-light">本文目录</h2>
                <ol className="space-y-2">
                  {headings.map((heading, index) => (
                    <li key={heading.id} className="flex gap-2 text-caption leading-snug">
                      <span className="font-black tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                      <a href={`#${heading.id}`} className="text-ink-soft transition-colors hover:text-brand-700">{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {related.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-3 text-micro font-black uppercase tracking-[0.14em] text-muted-light">相关文章</h2>
                <ul className="space-y-3">
                  {related.map(item => (
                    <li key={item.slug}>
                      <Link href={`/news/${item.slug}.html`} className="text-caption font-semibold leading-snug text-ink-soft transition-colors hover:text-brand-700">
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-micro text-muted-light">{item.publishedAt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-surface-warm p-5">
              <p className="text-micro font-black uppercase tracking-[0.14em] text-brand-700">销售工程师</p>
              <p className="mt-1 text-lg font-black text-ink">{contact.primaryName}</p>
              <div className="mt-2 space-y-1.5 text-caption text-muted">
                <a href={telHref(contact.primaryMobile)} className="flex items-center gap-2 transition-colors hover:text-brand-700">
                  <Phone size={14} className="text-brand-700" />
                  {contact.primaryMobile}
                </a>
                <p className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-brand-700" />
                  微信 {contact.wechat}
                </p>
              </div>
              <Link href="/contacts/" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-4 py-2.5 text-body font-bold text-white transition-colors hover:bg-brand-700">
                获取报价
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <InquiryCTA />
    </>
  );
}
