"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { systemCertificates, patentCertificates } from "@/content/about";

export function CertificationsSection() {
  return (
    <section className="bg-surface-warm py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              资质认证
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              体系认证与专利技术
            </h2>
            <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted">
              IATF 16949 汽车行业质量管理体系 + ISO 14001 环境管理体系双重认证。
            </p>
          </div>
        </Reveal>

        {/* System Certifications */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {systemCertificates.map((cert, i) => (
            <Reveal key={cert.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group relative cursor-default overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-5">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-line shadow-sm transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex rounded-full bg-green/10 px-2.5 py-0.5 text-[10px] font-extrabold text-green tracking-wider">
                      已获证
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold text-ink">{cert.name}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Patent Certificates */}
        <Reveal>
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
              国家专利证书
            </span>
            <p className="mt-1.5 text-[13px] text-muted">
              持续创新，已获得多项结构设计及功能专利
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {patentCertificates.map((pat, i) => (
            <Reveal key={pat.name} delay={Math.min(i + 2, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group cursor-default overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
                  <Image
                    src={pat.image}
                    alt={pat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-extrabold text-ink">{pat.name}</h4>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{pat.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
