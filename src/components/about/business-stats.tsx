"use client";

import { Reveal } from "@/components/ui/reveal";
import { businessStats } from "@/content/about";
import { AboutHead } from "./about-head";

export function BusinessStats() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead align="center" eyebrow="经营数据" title="数字背后的实力" description="每一项数据,都是 20+ 年积累的信任凭证" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 lg:gap-4">
          {businessStats.map((stat, i) => (
            <Reveal key={stat.label} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group cursor-default rounded-2xl border border-line bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)] lg:p-7">
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
