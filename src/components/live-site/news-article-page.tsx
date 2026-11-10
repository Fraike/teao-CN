import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { LIVE_ORIGIN } from "@/lib/live-site";
import { contact, telHref } from "@/content/live-site/contact";
import { newsArticles, type NewsArticle } from "@/content/live-site/news";
import { container } from "./container";
import InquiryCTA from "./inquiry-cta";

const COMPANY_NAME = "东莞市特澳电子科技有限公司";

function articleJsonLd(article: NewsArticle) {
  const url = `${LIVE_ORIGIN}/news/${article.slug}.html`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    image: LIVE_ORIGIN + article.cover,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: COMPANY_NAME },
    publisher: { "@type": "Organization", name: COMPANY_NAME },
  };
}

function relatedArticles(article: NewsArticle, limit = 3): NewsArticle[] {
  const sameCategory = newsArticles.filter(item => item.category === article.category && item.slug !== article.slug);
  const others = newsArticles.filter(item => item.category !== article.category && item.slug !== article.slug);
  return [...sameCategory, ...others].slice(0, limit);
}

export default function NewsArticlePage({ article }: { article: NewsArticle }) {
  const headingIds = new Map<number, string>();
  const headings: { id: string; text: string }[] = [];
  article.blocks.forEach((block, index) => {
    if (block.type === "h2") {
      const id = `h-${headings.length + 1}`;
      headingIds.set(index, id);
      headings.push({ id, text: block.text });
    }
  });
  const related = relatedArticles(article);

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
            <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="relative aspect-[16/9]">
                <Image
                  src={article.cover}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 880px"
                  className="object-cover"
                />
              </div>
            </figure>

            <div className="mt-8">
              {article.blocks.map((block, index) => {
                if (block.type === "h2") {
                  return (
                    <h2
                      key={`h2-${index}`}
                      id={headingIds.get(index)}
                      className="mt-12 scroll-mt-24 text-[22px] font-black leading-[1.3] tracking-[-0.02em] text-ink"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "h3") {
                  return (
                    <h3 key={`h3-${index}`} className="mt-8 text-[17px] font-bold leading-[1.4] text-ink">
                      {block.text}
                    </h3>
                  );
                }
                if (block.type === "img") {
                  return (
                    <figure key={`img-${index}`} className="mt-8">
                      <Image
                        src={block.src}
                        alt={block.alt}
                        width={block.width}
                        height={block.height}
                        sizes="(max-width: 1024px) 100vw, 880px"
                        className="h-auto w-full rounded-2xl border border-line"
                      />
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-xs text-muted-light">{block.caption}</figcaption>
                      )}
                    </figure>
                  );
                }
                if (block.type === "ul") {
                  return (
                    <ul key={`ul-${index}`} className="mt-5 list-disc space-y-2 pl-6 text-[15px] leading-8 text-ink-soft marker:text-brand-500">
                      {block.items.map((item, itemIndex) => (
                        <li key={`${index}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote key={`q-${index}`} className="mt-6 rounded-r-xl border-l-4 border-brand-500 bg-brand-50/60 px-5 py-4 text-[15px] leading-8 text-ink-soft">
                      {block.text}
                    </blockquote>
                  );
                }
                return (
                  <p key={`p-${index}`} className="mt-5 text-[15px] leading-[1.9] text-ink-soft">
                    {block.text}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 border-t border-line pt-8">
              <Link href="/news/" className="text-sm font-medium text-muted transition-colors hover:text-brand-700">← 返回新闻列表</Link>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24">
            {headings.length > 0 && (
              <nav aria-label="本文目录" className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-muted-light">本文目录</h2>
                <ol className="space-y-2">
                  {headings.map((heading, index) => (
                    <li key={heading.id} className="flex gap-2 text-[13px] leading-snug">
                      <span className="font-black tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                      <a href={`#${heading.id}`} className="text-ink-soft transition-colors hover:text-brand-700">{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {related.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-muted-light">相关文章</h2>
                <ul className="space-y-3">
                  {related.map(item => (
                    <li key={item.slug}>
                      <Link href={`/news/${item.slug}.html`} className="text-[13px] font-semibold leading-snug text-ink-soft transition-colors hover:text-brand-700">
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-muted-light">{item.publishedAt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-surface-warm p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">销售工程师</p>
              <p className="mt-1 text-lg font-black text-ink">{contact.primaryName}</p>
              <div className="mt-2 space-y-1.5 text-[13px] text-muted">
                <a href={telHref(contact.primaryMobile)} className="flex items-center gap-2 transition-colors hover:text-brand-700">
                  <Phone size={14} className="text-brand-700" />
                  {contact.primaryMobile}
                </a>
                <p className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-brand-700" />
                  微信 {contact.wechat}
                </p>
              </div>
              <Link
                href="/contacts/"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
              >
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
