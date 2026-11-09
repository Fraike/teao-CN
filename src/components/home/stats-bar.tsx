"use client";

import { useEffect, useRef, useState } from "react";

/* ── Animated counter (only for numeric stats) ── */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  // SSR 直接输出真实数值,避免无 JS 时显示 0;进入视口后再从 0 播放动画。
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setCount(0);
          const duration = 1600;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
          obs.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Border helper ──
   Mobile (2 cols): cells 0,2 get border-r; cells 1,3 do NOT
   Desktop (5 cols): cells 0-3 get border-r; cell 4 never does
   All cells: border-b on mobile, removed on lg+
────────────────────────────────── */
function cellBorderClass(i: number, total: number) {
  const isLast = i === total - 1;
  if (isLast) return "border-b border-line-soft lg:border-b-0";

  const isMobileRight = i % 2 === 0; // cells 0,2 are right-column on mobile 2-col
  const isDesktopRight = i < total - 1; // cells 0-3 are not last on desktop 5-col

  if (isMobileRight && isDesktopRight) {
    // always has right border
    return "border-b border-r border-line-soft lg:border-b-0";
  }

  // only right border on desktop (i=1,3)
  return "border-b border-line-soft lg:border-b-0 lg:border-r lg:border-line-soft";
}

/* ── Stat definitions ── */
const stats = [
  { type: "counter" as const, target: 20, suffix: "+年", label: "阻尼器研发制造经验" },
  { type: "counter" as const, target: 8000, suffix: "万+", label: "年产能（参考值）" },
  { type: "static" as const, value: "IATF", label: "16949 质量体系认证" },
  { type: "counter" as const, target: 100, suffix: "%", label: "出厂扭矩检测覆盖" },
  { type: "counter" as const, target: 5, suffix: "大", label: "核心产品线" },
];

export function StatsBar() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("!opacity-100", "!translate-y-0");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative z-10 -mt-[18px]">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div
          ref={revealRef}
          className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out lg:grid-cols-5"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-4 py-7 text-center transition-colors duration-[250ms] hover:bg-surface ${cellBorderClass(i, stats.length)}`}
            >
              <div className="flex items-baseline justify-center gap-[3px] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                {stat.type === "counter" ? (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </div>
              <span className="mt-1.5 block text-[12.5px] font-semibold tracking-[0.02em] text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
