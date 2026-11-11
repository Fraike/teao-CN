"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { newsCategories, type NewsCategory } from "@/content/live-site/news";
import type { PublicNews } from "@/lib/news-store";
import ListingPagination from "./listing-pagination";

export default function NewsList({ articles, pageSize = 12 }: { articles: PublicNews[]; pageSize?: number }) {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (category === "all" ? articles : articles.filter(item => item.category === category)),
    [articles, category]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {newsCategories.map(item => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setCategory(item.key);
              setPage(1);
            }}
            aria-pressed={category === item.key}
            className={`rounded-full border px-4 py-2 text-body font-bold transition-colors ${
              category === item.key
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-line bg-white text-muted hover:border-brand-500 hover:text-brand-700"
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-semibold text-muted-light">{filtered.length} 篇文章</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(article => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}.html`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={article.cover || "/images/og/default.jpg"}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3 text-micro font-bold text-muted-light">
                <span className="text-brand-700">{article.categoryLabel}</span>
                <span>{article.publishedAt}</span>
              </div>
              <h2 className="mt-2 line-clamp-2 text-lg font-black leading-[1.25] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-700">
                {article.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-body leading-relaxed text-muted">{article.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-caption font-bold text-brand-700">
                阅读全文
                <ArrowUpRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && <p className="py-16 text-center text-body text-muted-light">该分类下暂无文章。</p>}

      <ListingPagination page={current} totalPages={totalPages} onChange={next => setPage(next)} />
    </section>
  );
}
