import Link from "next/link";
import Image from "next/image";
import { Car, Bath, Monitor, Cog } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { applicationCards } from "@/content/live-site/applications";

const cardIcons = [Car, Bath, Monitor, Cog];

export default function ApplicationsPage() {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">应用案例 | 阻尼器应用场景 | 特澳 TEAO</h1>
      <SectionHead
        eyebrow="应用案例"
        title="为每一种应用而设计"
        description="特澳阻尼器服务于汽车、家居、办公设备与工业领域,覆盖开合、缓冲、缓降与回弹控制。"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {applicationCards.map((card, i) => {
          const Icon = cardIcons[i];
          return (
            <Reveal key={card.key} delay={((i % 2) + 1) as 1 | 2}>
              <Link href={card.href} className="group block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.06)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
                </div>
                <div className="p-7">
                  <Icon className="mb-4 h-10 w-10 text-brand-500" />
                  <h2 className="mb-3 text-2xl font-bold">{card.title}</h2>
                  <p className="text-muted leading-relaxed">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-brand-500">
                    查看应用 →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
