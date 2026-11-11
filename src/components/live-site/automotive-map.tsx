"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ApplicationMap } from "@/content/live-site/applications";

export default function AutomotiveMap({ map, sceneIds }: { map: ApplicationMap; sceneIds: string[] }) {
  const [active, setActive] = useState(sceneIds[0] ?? "");

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
    sceneIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sceneIds]);

  const goToScene = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
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
                isActive
                  ? "scale-105 bg-brand-700 text-white shadow-[0_14px_30px_rgba(232,120,26,0.4)]"
                  : "bg-brand-500 text-white shadow-[0_10px_24px_rgba(232,120,26,0.3)] hover:scale-105 hover:bg-brand-700"
              }`}
            >
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/95 ${isActive ? "animate-pulse" : ""}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-700" />
              </span>
              <span className="hidden whitespace-nowrap pr-0.5 text-caption font-bold lg:inline">{hotspot.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-micro font-semibold uppercase tracking-[0.08em] text-muted-light">点击图中标记查看对应应用</p>
        <div className="flex gap-2 overflow-x-auto lg:hidden">
          {map.hotspots.map(hotspot => (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => goToScene(hotspot.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-micro font-bold transition-colors ${
                active === hotspot.id ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-muted"
              }`}
            >
              {hotspot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
