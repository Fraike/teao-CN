"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0a0b0d] py-20 text-white lg:py-28">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-[0.12]">
        <Image
          src="/images/company/factory-entrance.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/97 via-[#0a0b0d]/88 to-[#0a0b0d]/72" />
      {/* Decorative ring */}
      <div className="pointer-events-none absolute -right-[100px] -bottom-[160px] h-[500px] w-[500px] rounded-full border border-brand-500/15" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
          {/* Left: text + CTAs */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-500 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                开始合作
              </span>
              <h2 className="mt-3.5 max-w-[640px] text-[clamp(30px,4vw,48px)] leading-[1.02] tracking-[-0.04em] font-black">
                有阻尼器需求？<br />
                让我们为您提供<span className="text-brand-500">专业方案</span>
              </h2>
              <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-white/55 lg:text-[18px]">
                发送图纸或样品，我们将在 24 小时内提供技术评估和报价建议
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-extrabold text-white shadow-[0_6px_24px_rgba(232,120,26,0.4)] transition-all hover:bg-brand-700 hover:shadow-[0_8px_30px_rgba(232,120,26,0.5)] hover:-translate-y-0.5"
                >
                  立即询价
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="tel:18617094202"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-transparent px-7 py-3.5 text-base font-extrabold text-white transition-all hover:border-brand-500 hover:text-brand-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  186-1709-4202
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right: product cards */}
          <Reveal delay={2}>
            <div className="hidden flex-col gap-3 lg:flex">
              {[
                { src: "/images/products/gear-damper/GearDamperSingle.webp", label: "齿轮阻尼器" },
                { src: "/images/products/axial-damper/AxialDamperSingle.webp", label: "轴向阻尼器" },
                { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", label: "手套箱阻尼器" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-[#F8F9FA]">
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-500">
                      0{index + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-extrabold text-ink">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Trust indicators */}
        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/45">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              24 小时内响应
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              免费技术评估
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              不限数量打样
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
