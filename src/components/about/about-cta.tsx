"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { contact, telHref } from "@/content/live-site/contact";

const products = [
  { src: "/images/products/gear-damper/GearDamperSingle.webp", label: "齿轮阻尼器" },
  { src: "/images/products/axial-damper/AxialDamperSingle.webp", label: "轴向阻尼器" },
  { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", label: "手套箱阻尼器" },
];

const trust = ["24 小时内响应", "免费技术评估", { text: "不限数量打样", note: "20 个以下" }];

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-gradient-to-b from-surface-warm to-white py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[420px] w-[420px] rounded-full border border-brand-500/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-micro font-medium uppercase tracking-[0.14em] text-brand-700
                before:content-[''] before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500">
                开始合作
              </span>
              <h2 className="mt-4 max-w-[640px] text-[clamp(30px,4vw,46px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
                有阻尼器需求?<br />
                让我们为您提供<span className="text-brand-700">专业方案</span>
              </h2>
              <p className="mt-4 max-w-[560px] text-body-lg leading-relaxed text-muted">
                发送图纸或样品,我们将在 24 小时内提供技术评估和报价建议。
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contacts/"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-body-lg font-semibold text-white shadow-[0_12px_28px_rgba(232,120,26,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_16px_34px_rgba(232,120,26,0.32)]"
                >
                  立即询价
                  <ArrowUpRight size={18} />
                </Link>
                <a
                  href={telHref(contact.primaryMobile)}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-7 py-3.5 text-body-lg font-semibold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  {contact.primaryName} {contact.primaryMobile}
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6 text-caption font-semibold text-muted">
                {trust.map(item => {
                  const label = typeof item === "string" ? item : item.text;
                  const note = typeof item === "string" ? null : item.note;
                  return (
                    <span key={label} className="flex items-center gap-1.5">
                      <Check size={15} className="text-brand-700" strokeWidth={3} />
                      {label}
                      {note && <span className="text-micro font-normal text-muted-light">({note})</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="hidden flex-col gap-3 lg:flex">
              {products.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_28px_rgba(30,30,32,0.05)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line-soft bg-surface">
                    <Image src={item.src} alt="" fill className="object-contain p-2" sizes="56px" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-micro font-medium uppercase tracking-[0.14em] text-brand-700">
                      0{index + 1}
                    </span>
                    <p className="mt-0.5 text-body font-semibold text-ink">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
