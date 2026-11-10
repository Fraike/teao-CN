"use client";

import { ClipboardCheck, Zap, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { qualityPromises } from "@/content/about";
import { AboutHead } from "./about-head";

const icons = [ClipboardCheck, Zap, ShieldCheck, Truck];

export function QualityPromise() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead eyebrow="品质承诺" title="每一件产品,都经得起检验" description="从来料、过程到出货,四级品控体系确保每一件阻尼器都符合标准。" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qualityPromises.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  {/* Step number */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-black text-brand-500 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(232,120,26,0.35)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <Icon className="h-7 w-7 text-brand-500" strokeWidth={1.5} />

                  <h3 className="mt-3 text-base font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.description}</p>

                  {/* Bottom accent */}
                  <div className="mt-5 h-1 w-0 rounded-full bg-brand-500 transition-all duration-500 group-hover:w-16" />
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Delivery promise highlight */}
        <Reveal delay={3}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200 bg-brand-50/70 p-6 text-center sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-extrabold text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                交付承诺
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  标准品 <b className="text-brand-600">3-5 天</b> 发货
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  定制件 <b className="text-brand-600">15-20 天</b> 交付
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  批次 <b className="text-brand-600">可追溯</b> 至原材料
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
