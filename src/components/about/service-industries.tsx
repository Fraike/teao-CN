"use client";

import { Car, Home, Bath, HeartPulse, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/content/about";
import { AboutHead } from "./about-head";

const icons = [Car, Home, Bath, HeartPulse, Wrench];

export function ServiceIndustries() {
  return (
    <section className="bg-surface-warm py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead align="center" eyebrow="服务行业" title="5 大行业 · 一站式阻尼缓冲方案" description="从汽车到家电,从卫浴到医疗 — 我们在多个行业积累了丰富的应用经验" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={industry.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-2xl border border-line bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 transition-all duration-300 group-hover:bg-brand-500">
                    <Icon className="h-6 w-6 text-brand-500 transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-ink">{industry.name}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                    {industry.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
