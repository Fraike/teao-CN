"use client";

import { useEffect, useRef, useState } from "react";
import { businessStats } from "@/content/about";
import { AboutHead } from "./about-head";

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setCount(0);
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function parseValue(value: string): { target: number; suffix: string } | null {
  const match = String(value).match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { target: Number(match[1]), suffix: match[2] };
}

export function BusinessStats() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead
          eyebrow="经营数据"
          title="数字背后的实力"
          description="每一项数据,都是 20+ 年积累的信任凭证。"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {businessStats.map(stat => {
            const parsed = parseValue(stat.value);
            return (
              <div
                key={stat.label}
                className="group h-full rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]"
              >
                <span className="block text-[36px] font-black leading-none tracking-[-0.04em] text-brand-500 tabular-nums lg:text-[44px]">
                  {parsed ? <CountUp target={parsed.target} suffix={parsed.suffix} /> : stat.value}
                </span>
                <span className="mt-3 block text-sm font-bold leading-snug text-ink">{stat.label}</span>
                <span className="mt-1 block text-[11px] font-semibold text-muted-light">{stat.unit}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
