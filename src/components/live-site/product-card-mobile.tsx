import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge, Wrench } from "lucide-react";
import { liveHref } from "@/lib/live-site";
import { formatTorque, getForceBar, getTorqueBar } from "@/lib/product-display";
import type { EnrichedProduct } from "@/lib/product-enrichment";

export default function ProductCardMobile({ product }: { product: EnrichedProduct }) {
  const href = liveHref(product.path);
  const external = !href.startsWith("/");
  const torqueBar = getTorqueBar(product.torque);
  const forceBar = getForceBar(product.force);

  return (
    <article className="group flex gap-3 rounded-2xl border border-line bg-white p-3 transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_12px_28px_rgba(232,120,26,0.08)]">
      <a href={href} className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-surface to-white sm:h-[100px] sm:w-[100px]">
        <Image src={product.image} alt={product.title} fill sizes="100px" loading="lazy" className="object-contain p-2.5" />
      </a>

      <div className="flex min-w-0 flex-1 flex-col">
        <a href={href}>
          <h3 className="line-clamp-1 text-[13px] font-bold text-ink group-hover:text-brand-700">{product.model}</h3>
        </a>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{product.title}</p>

        <div className="mt-2">
          {product.torque && torqueBar ? (
            <div className="rounded-lg border border-brand-500/25 bg-brand-50 px-2.5 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.05em] text-muted-light">
                  <Gauge size={11} className="text-brand-500" />
                  可调扭矩
                </span>
                <span className="text-[10px] font-semibold text-ink tabular-nums">{formatTorque(product.torque)}</span>
              </div>
              <div className="relative mt-1 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-brand-500/20">
                <div className="absolute inset-y-0.5 rounded-full bg-brand-500" style={{ left: `${torqueBar.start}%`, width: `${torqueBar.width}%` }} />
              </div>
            </div>
          ) : product.force && forceBar ? (
            <div className="rounded-lg border border-brand-500/25 bg-brand-50 px-2.5 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.05em] text-muted-light">
                  <Wrench size={11} className="text-brand-500" />
                  操作力
                </span>
                <span className="text-[10px] font-semibold text-ink tabular-nums">
                  {product.force.min === product.force.max ? `${product.force.min} ${product.force.unit}` : `${product.force.min} – ${product.force.max} ${product.force.unit}`}
                </span>
              </div>
              <div className="relative mt-1 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-brand-500/20">
                <div className="absolute inset-y-0.5 rounded-full bg-brand-500" style={{ left: `${forceBar.start}%`, width: `${forceBar.width}%` }} />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-line bg-surface px-2.5 py-1.5 text-[10px] text-muted-light">扭矩可定制</div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="min-w-0 truncate text-[10px] text-muted">
            {product.chips.slice(0, 2).map(chip => `${chip.label} ${chip.value}`).join(" · ")}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <a href={href} className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand-700">
              {external ? "原站详情" : "详情"}
              <ArrowUpRight size={12} />
            </a>
            <Link href="/contacts/" className="text-[11px] font-bold text-ink-soft">询价</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
