"use client";

import Image from "next/image";
import { Settings, Wrench, Cog } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { competencies } from "@/content/about";

const icons = [Settings, Wrench, Cog];

export function CoreCapabilities() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              核心能力
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              从模具到交付 · 全链路自主可控
            </h2>
            <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted">
              模具开发、精密注塑、自动化装配、100%检测 — 每一个环节都在自有工厂内完成。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {competencies.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={Math.min(i + 2, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1e]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-extrabold text-brand-700">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-500" strokeWidth={1.5} />
                      <div>
                        <h3 className="text-lg font-extrabold text-ink">{item.title}</h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
