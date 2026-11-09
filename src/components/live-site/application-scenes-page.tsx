"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { container } from "./container";
import type { ApplicationMap, ApplicationScene } from "@/content/live-site/applications";

export default function ApplicationScenesPage({ eyebrow, title, description, scenes, map }: {
  eyebrow: string;
  title: string;
  description: string;
  scenes: ApplicationScene[];
  map: ApplicationMap;
}) {
  const [active, setActive] = useState(scenes[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.4] }
    );
    scenes.forEach(scene => {
      const element = document.getElementById(scene.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [scenes]);

  const goToScene = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{title} | 特澳 TEAO</h1>
      <SectionHead eyebrow={eyebrow} title={title} description={description} />

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_rgba(30,30,32,0.06)]">
        <div className="relative w-full" style={{ aspectRatio: map.aspect }}>
          <Image src={map.image} alt={map.alt} fill priority sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          {map.hotspots.map(hotspot => {
            const isActive = active === hotspot.id;
            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => goToScene(hotspot.id)}
                style={{ left: hotspot.left, top: hotspot.top }}
                aria-label={`查看${hotspot.label}应用`}
                aria-pressed={isActive}
                className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-2.5 py-2 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive ? "scale-105 bg-brand-700 text-white shadow-[0_14px_30px_rgba(232,120,26,0.4)]" : "bg-brand-500 text-white shadow-[0_10px_24px_rgba(232,120,26,0.3)] hover:scale-105 hover:bg-brand-700"
                }`}
              >
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/95 ${isActive ? "animate-pulse" : ""}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-700" />
                </span>
                <span className="hidden whitespace-nowrap pr-0.5 text-[12px] font-bold lg:inline">{hotspot.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-light">点击图中标记查看对应应用</p>
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {map.hotspots.map(hotspot => (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => goToScene(hotspot.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  active === hotspot.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-muted"
                }`}
              >
                {hotspot.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {scenes.map((scene, i) => (
          <Reveal key={scene.id} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
            <article
              id={scene.id}
              className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 lg:p-6 ${
                active === scene.id ? "border-brand-500/40 shadow-[0_16px_40px_rgba(232,120,26,0.1)]" : "border-line"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <em className="not-italic text-lg font-black leading-none text-brand-500">{scene.no}</em>
                <h2 className="text-[17px] font-bold leading-tight">{scene.title}</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line-soft bg-surface">
                  <Image src={scene.gif} alt={scene.title} fill unoptimized className="object-contain p-2" sizes="(max-width: 768px) 100vw, 420px" />
                </div>
                <div>
                  <p className="mb-4 text-sm leading-relaxed text-muted">{scene.description}</p>
                  <div className="space-y-2.5">
                    {scene.groups.map(group => (
                      <div key={group.title} className="overflow-hidden rounded-lg border border-line">
                        <div className="flex min-h-[36px] items-center justify-between bg-surface px-3 text-xs font-bold">
                          <Link href={liveHref(group.categoryPath)} className="text-brand-700 hover:underline">{group.title}</Link>
                        </div>
                        <div className="flex flex-wrap gap-2 px-3 py-2.5">
                          {group.models.map(model => (
                            <span key={model} className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft">{model}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
