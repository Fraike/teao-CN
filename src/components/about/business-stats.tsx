"use client";

import { Reveal } from "@/components/ui/reveal";
import { businessStats } from "@/content/about";

export function BusinessStats() {
  return (
    <section className="bg-surface-warm py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              经营数据
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              数字背后的实力
            </h2>
            <p className="mt-2 text-[14px] text-muted">
              每一项数据，都是 24 年积累的信任凭证
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 lg:gap-4">
          {businessStats.map((stat, i) => (
            <Reveal key={stat.label} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group cursor-default rounded-xl border border-line bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg lg:p-7">
                <span className="block text-3xl font-black tracking-[-0.04em] text-brand-500 lg:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[12.5px] font-bold leading-snug text-ink-soft">
                  {stat.label}
                </span>
                <span className="mt-1 block text-[11px] font-semibold text-brand-600">
                  {stat.unit}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
