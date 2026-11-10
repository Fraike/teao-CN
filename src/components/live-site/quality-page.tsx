import Image from "next/image";
import Link from "next/link";
import { Gauge, Eye, Clock, Thermometer, Target, Sliders, Waves, Shield } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { container } from "./catalog";
import { inspectionCards, engineeringCapabilities, labGroups, iatfNote } from "@/content/live-site/quality";

const inspectionIcons = [Gauge, Eye];
const capabilityIcons = [Gauge, Clock, Thermometer, Target, Sliders, Waves];

const qualityJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "东莞市特澳电子科技有限公司",
  alternateName: "特澳 TEAO",
  url: "https://www.chinateao.com/",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "IATF 16949 认证",
    credentialCategory: "质量管理体系认证",
  },
};

export default function QualityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(qualityJsonLd) }} />
      <PageHero
        eyebrow="质量控制"
        title="每一件阻尼器,都有据可查"
        description="IATF 16949 认证体系,100% 扭矩检测与 100% 外观检测,从原材料到成品的批次可追溯。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "质量控制" }]}
      />

      <section className={`${container} py-16 lg:py-20`}>
        <div className="grid gap-6 lg:grid-cols-2">
          {inspectionCards.map((card, i) => {
            const Icon = inspectionIcons[i];
            return (
              <Reveal key={card.badge} delay={((i % 2) + 1) as 1 | 2}>
                <div className="overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
                  </div>
                  <div className="p-7">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                        <Icon className="h-7 w-7 text-brand-700" />
                      </span>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{card.badge}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                      {card.points.map(point => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className={`${container} py-16 lg:py-20`}>
          <SectionHead eyebrow="工程能力" title="按你的需求调校每一款阻尼器" description="从扭矩、方向到安装结构,工程团队可按应用要求调整关键参数。" />
          <div className="grid gap-5 sm:grid-cols-2">
            {engineeringCapabilities.map((cap, i) => {
              const Icon = capabilityIcons[i];
              return (
                <Reveal key={cap.title} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
                  <div className="flex gap-5 rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand-500/30">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
                      <Icon className="h-5 w-5 text-brand-700" />
                    </span>
                    <div>
                      <h4 className="text-[15px] font-bold text-ink">{cap.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{cap.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${container} py-16 lg:py-20`}>
        <SectionHead eyebrow="实验室" title="经校准设备提供的清晰验证数据" description="特澳实验室支持扭矩、寿命、尺寸与环境验证,满足汽车级质量控制要求。" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {labGroups.map((group, gi) => (
            <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-2xl border border-line bg-white p-5">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">{group.label}</h4>
                <ul className="space-y-4">
                  {group.items.map(item => (
                    <li key={item.equipment}>
                      <div className="text-[13px] font-bold leading-snug text-ink">{item.equipment}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <span className="rounded-lg bg-surface px-2.5 py-2 text-muted">
                          <span className="block text-[9px] font-bold uppercase tracking-wider">量程</span>
                          <span className="mt-0.5 block font-bold">{item.range}</span>
                        </span>
                        <span className="rounded-lg bg-surface px-2.5 py-2 text-muted">
                          <span className="block text-[9px] font-bold uppercase tracking-wider">精度</span>
                          <span className="mt-0.5 block font-bold">{item.accuracy}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${container} py-16 lg:py-20`}>
        <div className="flex items-start gap-5 rounded-2xl border border-line bg-gradient-to-br from-surface to-white p-8 sm:p-10">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
            <Shield className="h-7 w-7 text-brand-700" />
          </span>
          <div>
            <h3 className="text-xl font-bold">{iatfNote.title}</h3>
            <p className="mb-6 mt-3 leading-relaxed text-muted">{iatfNote.description}</p>
            <Link href={iatfNote.ctaHref} className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-7 py-3.5 text-sm font-bold text-ink-soft transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700">
              {iatfNote.ctaLabel} →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className={`${container} py-16 lg:py-20 text-center`}>
          <Reveal>
            <h2 className="text-[28px] font-bold tracking-tight sm:text-[34px]">需要验证过的质量数据?</h2>
            <p className="mx-auto mb-8 mt-4 max-w-xl text-[15px] text-muted">可索取 PPAP 文档、扭矩测试报告与质量认证,用于你的项目评估。</p>
            <Button href={liveHref("/contacts/")}>索取质量文档 →</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
