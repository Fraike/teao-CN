import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { container } from "./container";
import type { SimpleApplication } from "@/content/live-site/applications";

const capabilities = ["扭矩按应用调校", "卡扣 / 螺钉等多种安装", "提供样品验证与 PPAP 文档"];

export default function SimpleApplicationPage({ app }: { app: SimpleApplication }) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{app.title}阻尼器应用 | 特澳 TEAO</h1>
      <SectionHead eyebrow="应用案例" title={`${app.title}阻尼器应用`} description={app.description} />

      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <Reveal>
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_18px_50px_rgba(30,30,32,0.06)]">
            <Image src={app.image} alt={app.title} fill sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-700 backdrop-blur">
              {app.title}
            </span>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-700">应用说明</span>
          </div>
          <h2 className="mt-4 text-[30px] font-black leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px]">
            {app.title}领域的阻尼应用
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {app.description}。欢迎提供应用位置、目标扭矩与安装空间,特澳可推荐标准阻尼平台或按结构空间定制方案。
          </p>

          <ul className="mt-6 space-y-2.5">
            {capabilities.map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-ink-soft">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Check size={12} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/contacts/">获取报价 →</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
