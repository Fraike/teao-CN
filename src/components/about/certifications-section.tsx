"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { systemCertificates, patentCertificates } from "@/content/about";
import { AboutHead } from "./about-head";

export function CertificationsSection() {
  return (
    <section className="bg-surface-warm py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead eyebrow="资质认证" title="体系认证与专利技术" description="IATF 16949 汽车行业质量管理体系 + ISO 14001 环境管理体系双重认证。" />

        {/* System Certifications */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {systemCertificates.map((cert, i) => (
            <Reveal key={cert.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5} className="h-full">
              <div className="group relative cursor-default overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_16px_40px_rgba(232,120,26,0.1)]">
                <div className="flex items-start gap-5">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-white p-1 shadow-sm transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex rounded-full bg-green/10 px-2.5 py-0.5 text-micro font-extrabold text-green tracking-wider">
                      已获证
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold text-ink">{cert.name}</h3>
                    <p className="mt-1.5 text-caption leading-relaxed text-muted">
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
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-micro font-bold text-brand-700">
              国家专利证书
            </span>
            <p className="mt-1.5 text-caption text-muted">
              持续创新，已获得多项结构设计及功能专利
            </p>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {patentCertificates.map((pat, i) => (
            <Reveal key={pat.name} delay={Math.min(i + 2, 5) as 1 | 2 | 3 | 4 | 5} className="w-full sm:w-[calc(50%-8px)] lg:w-[300px]">
              <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_14px_36px_rgba(232,120,26,0.1)]">
                <div className="relative aspect-[1/1.414] overflow-hidden bg-white p-3">
                  <Image
                    src={pat.image}
                    alt={pat.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 90vw, 300px"
                  />
                </div>
                <figcaption className="border-t border-line-soft px-4 py-3.5">
                  <h4 className="text-caption font-extrabold text-ink">{pat.name}</h4>
                  <p className="mt-1 text-micro leading-relaxed text-muted">{pat.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
