"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, Loader2, Package, Search, X } from "lucide-react";

interface SearchItem {
  type: "product" | "news";
  title: string;
  label: string;
  excerpt: string;
  image?: string;
  url: string;
  publishedAt?: string;
}

interface SearchResponse {
  products: SearchItem[];
  news: SearchItem[];
  total: number;
}

const EMPTY: SearchResponse = { products: [], news: [], total: 0 };

export default function GlobalSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("search failed");
        setResults((await response.json()) as SearchResponse);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults(EMPTY);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    setLoading(false);
  };

  const group = (title: string, items: SearchItem[], icon: "product" | "news") => {
    if (!items.length) return null;
    const Icon = icon === "product" ? Package : FileText;
    return (
      <section>
        <div className="mb-2 flex items-center gap-2 px-1 text-micro font-medium uppercase tracking-[0.14em] text-muted-light">
          <Icon size={14} className="text-brand-700" />
          {title}
        </div>
        <div className="space-y-2">
          {items.map(item => (
            <Link
              key={`${item.type}-${item.url}`}
              href={item.url}
              onClick={close}
              className="group grid min-h-[80px] grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-line bg-white p-3 transition-all hover:border-brand-500/40 hover:shadow-[0_10px_26px_rgba(232,120,26,0.08)]"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-surface">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="56px" className="object-contain p-1" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-muted-light"><Icon size={18} /></span>
                )}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate rounded-full bg-surface px-2 py-0.5 text-micro font-semibold text-muted">{item.label}</span>
                  {item.publishedAt && <span className="shrink-0 text-micro text-muted-light">{item.publishedAt}</span>}
                </div>
                <h3 className="truncate text-body font-semibold text-ink group-hover:text-brand-700">{item.title}</h3>
                {item.excerpt && <p className="mt-1 line-clamp-1 text-xs text-muted">{item.excerpt}</p>}
              </div>
              <ArrowRight size={16} className="text-muted-light group-hover:text-brand-700" />
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜索"
        title="搜索产品与新闻"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition-colors hover:border-brand-500 hover:text-brand-700 lg:h-[38px] lg:w-[38px]"
      >
        <Search size={17} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] px-4 pt-20 sm:pt-24" role="dialog" aria-modal="true" aria-label="站内搜索">
          <button type="button" aria-label="关闭搜索" onClick={close} className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm" />
          <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_26px_80px_rgba(30,30,32,0.22)]">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={19} className="shrink-0 text-brand-700" />
              <input
                ref={inputRef}
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="搜索产品型号、新闻…"
                className="h-11 min-w-0 flex-1 bg-transparent text-body-lg font-semibold text-ink outline-none placeholder:text-muted-light"
              />
              {loading && <Loader2 size={18} className="animate-spin text-muted-light" />}
              <button type="button" onClick={close} aria-label="关闭搜索" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink">
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[min(68vh,620px)] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div className="py-10 text-center">
                  <p className="text-body font-semibold text-ink">输入至少 2 个字符</p>
                  <p className="mt-2 text-body text-muted">可搜索产品型号、阻尼器类型、技术文章与新闻。</p>
                </div>
              ) : loading && results.total === 0 ? (
                <div className="flex items-center justify-center gap-2 py-12 text-body font-semibold text-muted">
                  <Loader2 size={18} className="animate-spin" /> 搜索中…
                </div>
              ) : results.total === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-body font-semibold text-ink">没有找到「{query.trim()}」</p>
                  <p className="mt-2 text-body text-muted">试试型号(如 RD-T036)或关键词(如 手套箱、齿轮阻尼器)。</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {group("产品", results.products, "product")}
                  {group("新闻", results.news, "news")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
