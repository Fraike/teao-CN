import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const base = "grid h-9 min-w-9 place-items-center rounded-lg px-3 text-sm font-semibold transition-colors";
const idle = `${base} border border-line bg-white text-muted hover:border-brand-500 hover:text-brand-700`;
const activeCls = `${base} bg-brand-500 text-white`;
const disabled = `${base} border border-line bg-white text-muted opacity-30 pointer-events-none`;

function pageList(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(page => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

export default function ListingPagination({
  page,
  totalPages,
  onChange,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
  hrefFor?: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const renderPage = (target: number) => {
    if (target === page) {
      return <span key={target} aria-current="page" className={activeCls}>{target}</span>;
    }
    if (hrefFor) {
      return <Link key={target} href={hrefFor(target)} className={idle}>{target}</Link>;
    }
    return <button key={target} type="button" onClick={() => onChange?.(target)} className={idle}>{target}</button>;
  };

  const prev = page > 1
    ? (hrefFor
        ? <Link href={hrefFor(page - 1)} aria-label="上一页" className={idle}><ChevronLeft size={16} /></Link>
        : <button type="button" onClick={() => onChange?.(page - 1)} aria-label="上一页" className={idle}><ChevronLeft size={16} /></button>)
    : <span aria-hidden="true" className={disabled}><ChevronLeft size={16} /></span>;

  const next = page < totalPages
    ? (hrefFor
        ? <Link href={hrefFor(page + 1)} aria-label="下一页" className={idle}><ChevronRight size={16} /></Link>
        : <button type="button" onClick={() => onChange?.(page + 1)} aria-label="下一页" className={idle}><ChevronRight size={16} /></button>)
    : <span aria-hidden="true" className={disabled}><ChevronRight size={16} /></span>;

  return (
    <nav aria-label="产品分页" className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {prev}
      {pageList(page, totalPages).map((item, index) =>
        item === "gap"
          ? <span key={`gap-${index}`} className="px-1 text-muted">…</span>
          : renderPage(item)
      )}
      {next}
    </nav>
  );
}
