import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedNews } from "@/lib/news-store";

export async function NewsStrip() {
  const newsArticles = (await getPublishedNews()).slice(0, 3);
  return (
    <section className="border-t border-line bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <SectionHead
          eyebrow="新闻动态"
          title="公司动态与工程进展"
          description="产能、质量体系与技术选型方面的最新更新。"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {newsArticles.map((article, i) => (
            <Reveal key={article.slug} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
              <Link
                href={`/news/${article.slug}.html`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_18px_40px_rgba(232,120,26,0.1)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={article.cover}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-micro font-bold uppercase tracking-[0.12em] text-muted-light">
                    <span className="text-brand-700">{article.categoryLabel}</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-body-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-caption leading-relaxed text-muted">{article.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-caption font-bold text-brand-700">
                    阅读全文
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/news/" className="text-body font-bold text-brand-700 hover:underline">
            查看全部新闻 →
          </Link>
        </div>
      </div>
    </section>
  );
}
