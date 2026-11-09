import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { container } from "./catalog";
import type { SimpleApplication } from "@/content/live-site/applications";

export default function SimpleApplicationPage({ app }: { app: SimpleApplication }) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{app.title}阻尼器应用 | 特澳 TEAO</h1>
      <SectionHead eyebrow="应用案例" title={`${app.title}阻尼器应用`} description={app.description} />
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
            <Image src={app.image} alt={app.title} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mb-4 text-2xl font-bold">{app.title}领域的阻尼应用</h2>
          <p className="mb-7 text-muted leading-relaxed">{app.description}。欢迎提供应用位置、目标扭矩与安装空间,特澳可推荐标准阻尼平台或按结构空间定制方案。</p>
          <Button href="/contacts/">获取报价 →</Button>
        </Reveal>
      </div>
    </section>
  );
}
