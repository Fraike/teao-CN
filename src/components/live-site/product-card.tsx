import Image from "next/image";
import { ArrowUpRight, Gauge, Wrench } from "lucide-react";
import { liveHref } from "@/lib/live-site";
import { formatTorque, getForceBar, getTorqueBar } from "@/lib/product-display";
import type { EnrichedProduct } from "@/lib/product-enrichment";

export default function ProductCard({ product }: { product: EnrichedProduct }) {
  const href = liveHref(product.path);
  const external = !href.startsWith("/");

  return (
    <article className="group grid h-full grid-cols-[120px_1fr] items-center gap-5 rounded-2xl border border-line bg-white p-4 shadow-[0_4px_24px_rgba(17,24,39,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[0_16px_40px_rgba(232,120,26,0.10)]">
      <a href={href} className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-surface to-white">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="120px"
          loading="lazy"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        />
      </a>

      <div className="flex min-w-0 flex-col">
        <a href={href}>
          <h3 className="line-clamp-1 text-[14px] font-bold leading-tight text-ink transition-colors group-hover:text-brand-700">
            {product.model}
          </h3>
        </a>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{product.title}</p>

        <div className="mt-3">
          <RangeBlock product={product} />
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {product.chips.map((chip, index) => {
              const accent = index === product.accentIndex;
              return (
                <span
                  key={chip.label}
                  className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 ${accent ? "border-brand-500/30 bg-brand-50" : "border-line bg-white"}`}
                >
                  <span className={`shrink-0 text-[10px] uppercase tracking-[0.04em] ${accent ? "text-brand-700" : "text-muted-light"}`}>{chip.label}</span>
                  <span className={`truncate text-[12px] ${accent ? "font-semibold text-brand-700" : "text-ink-soft"}`}>{chip.value}</span>
                </span>
              );
            })}
          </div>
          <a
            href={href}
            aria-label={`${external ? "查看原站详情" : "查看产品详情"}：${product.model}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(232,120,26,0.28)]"
          >
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}

function RangeBlock({ product, compact = false }: { product: EnrichedProduct; compact?: boolean }) {
  const torqueBar = getTorqueBar(product.torque);
  const forceBar = getForceBar(product.force);

  if (product.torque && torqueBar) {
    return (
      <div className={`rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-50/70 to-brand-50 ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted-light">
            <Gauge size={13} className="text-brand-500" />
            可调扭矩
          </span>
          <span className="text-[11px] font-semibold text-ink tabular-nums">{formatTorque(product.torque)}</span>
        </div>
        <Bar bar={torqueBar} />
        <div className="mt-1 flex justify-between text-[9px] text-muted-light">
          <span>0</span>
          <span>{torqueBar.scaleMax} {product.torque.unit}</span>
        </div>
      </div>
    );
  }

  if (product.force && forceBar) {
    return (
      <div className={`rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-50/70 to-brand-50 ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted-light">
            <Wrench size={13} className="text-brand-500" />
            操作力
          </span>
          <span className="text-[11px] font-semibold text-ink tabular-nums">
            {product.force.min === product.force.max ? `${product.force.min} ${product.force.unit}` : `${product.force.min} – ${product.force.max} ${product.force.unit}`}
          </span>
        </div>
        <Bar bar={forceBar} />
        <div className="mt-1 flex justify-between text-[9px] text-muted-light">
          <span>0</span>
          <span>{forceBar.scaleMax} {product.force.unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-dashed border-line bg-surface text-[11px] text-muted-light ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}>
      扭矩可定制
    </div>
  );
}

function Bar({ bar }: { bar: { start: number; width: number } }) {
  return (
    <div className="relative h-3 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-brand-500/20">
      <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(232,120,26,0.06),rgba(232,120,26,0.12))]" />
      <div
        className="absolute inset-y-1 rounded-full bg-brand-500 shadow-[0_0_12px_rgba(232,120,26,0.35)] transition-all duration-700"
        style={{ left: `${bar.start}%`, width: `${bar.width}%` }}
      />
    </div>
  );
}
