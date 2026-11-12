"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./product-card";
import ListingPagination from "./listing-pagination";
import type { EnrichedProduct } from "@/lib/product-enrichment";

export default function ProductList({
  products,
  pageSize = 10,
  searchable = false,
}: {
  products: EnrichedProduct[];
  pageSize?: number;
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter(product =>
      product.model.toLowerCase().includes(needle) || product.title.toLowerCase().includes(needle)
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  const changePage = (next: number) => {
    setPage(next);
    document.getElementById("product-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="product-list" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-light">产品</span>
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-xs font-semibold text-white">
            {filtered.length}
          </span>
        </div>
        {searchable && (
          <div className="relative w-full max-w-[280px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="搜索型号…"
              aria-label="搜索产品型号"
              className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-caption text-ink transition-all placeholder:text-muted-light focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10"
            />
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:gap-5">
            {visible.map(product => <ProductCard key={product.path} product={product} />)}
          </div>
          <ListingPagination page={current} totalPages={totalPages} onChange={changePage} />
        </>
      ) : (
        <div className="py-16 text-center text-body text-muted-light">没有找到匹配的产品,试试其他型号关键词。</div>
      )}
    </section>
  );
}
