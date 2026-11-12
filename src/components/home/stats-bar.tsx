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

/* ── Stat definitions ── */
const stats = [
  { type: "counter" as const, target: 20, suffix: "+年", label: "阻尼器研发制造经验" },
  { type: "counter" as const, target: 8000, suffix: "万+", label: "年产能" },
  { type: "static" as const, value: "IATF", label: "16949 质量体系认证" },
  { type: "counter" as const, target: 100, suffix: "%", label: "出厂扭矩检测覆盖" },
  { type: "counter" as const, target: 5, suffix: "大", label: "核心产品线" },
];

export function StatsBar() {
  return (
    <section className="border-y border-line bg-white">
      <div className="home-shell grid grid-cols-2 sm:grid-cols-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-2 py-5 text-center sm:px-4 sm:py-7 ${i === stats.length - 1
              ? "col-span-2 sm:col-span-1"
              : `border-b border-line-soft sm:border-b-0 sm:border-r ${i % 2 === 0 ? "border-r" : ""}` }`}
          >
              <div className="flex items-baseline justify-center gap-[3px] text-[clamp(1.4rem,2.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
                {stat.type === "counter" ? (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </div>
              <span className="mt-1.5 block text-caption font-semibold tracking-[0.02em] text-muted">
                {stat.label}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
