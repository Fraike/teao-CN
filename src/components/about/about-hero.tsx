"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trustBadges } from "@/content/about";

const sellingPoints = [
  { label: "20+ 年", desc: "阻尼器研发制造经验" },
  { label: "源头工厂", desc: "模具·注塑·装配·检测一体化" },
  { label: "IATF 认证", desc: "汽车级质量管理体系" },
];

export function AboutHero() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "linear-gradient(180deg, #000, transparent 85%)",
        }}
      />
      {/* Decorative ring */}
      <div className="pointer-events-none absolute -right-[14vw] top-[10%] h-[42vw] w-[42vw] max-w-[620px] max-h-[620px] rounded-full border border-brand-500/12" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 pb-14 lg:px-8 lg:pt-32 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Left: text */}
          <div>
            <div
              className={`inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="block h-[2px] w-[22px] rounded bg-brand-500" />
              关于特澳
            </div>

            <h1
              className={`mt-5 max-w-[640px] text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink transition-all duration-700 delay-100 sm:text-[40px] lg:text-[48px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              专注<span className="text-brand-500">阻尼器</span>与
              <span className="text-brand-500">锁扣</span>
              <br />
              定制制造{" "}
              <span className="inline-block rounded-lg bg-brand-50 px-2 py-0.5 text-brand-700">
                20+年
              </span>
            </h1>

            <p
              className={`mt-5 max-w-[560px] text-[16px] leading-relaxed text-muted transition-all duration-700 delay-200 lg:text-[18px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              特澳成立于 2001 年，是一家集模具开发、精密注塑、自动化装配和
              100% 扭矩检测于一体的阻尼器与锁扣源头制造厂家。凭借 IATF 16949
              认证体系和 8000 万件年产能，已为国内外 200+ 家汽车、家电、卫浴、医疗及工业领域企业提供可靠的缓冲控制解决方案。
            </p>

            {/* CTAs */}
            <div
              className={`mt-7 flex flex-wrap gap-3 transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(232,120,26,0.35)] transition-all hover:bg-brand-700 hover:shadow-[0_6px_20px_rgba(232,120,26,0.45)] hover:-translate-y-0.5"
              >
                立即询价
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:18617094202"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:border-brand-500 hover:bg-brand-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                186-1709-4202
              </a>
            </div>

            {/* Trust badges */}
            <div
              className={`mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line transition-all duration-700 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {trustBadges.map((b) => (
                <span
                  key={b}
                  className="flex items-center justify-center bg-white px-2 py-3 text-[11px] font-extrabold text-muted transition-colors hover:text-brand-700"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Selling points */}
            <div
              className={`mt-5 flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {sellingPoints.map((p) => (
                <div key={p.label} className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[13px] font-semibold text-ink-soft">
                    <span className="text-brand-600">{p.label}</span> · {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: factory image */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="relative aspect-[16/10] lg:aspect-[5/4] overflow-hidden rounded-2xl border border-line bg-[#1a1a1e] shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/company/factory-entrance.webp"
                alt="特澳工厂"
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow-sm">
                <span className="text-[11px] font-bold text-muted">东莞黄江厂房</span>
                <span className="ml-2 text-xs font-extrabold text-brand-600">20+ 条产线</span>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -left-4 bottom-8 hidden rounded-xl border border-line bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.06)] lg:block">
              <span className="block text-3xl font-black leading-none text-brand-500">8000万</span>
              <span className="mt-1 block text-[11px] font-bold text-muted">年综合产能（件）</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
