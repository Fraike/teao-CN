import Link from "next/link";
import Image from "next/image";
import { Car, Bath, Monitor, Cog, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { applicationCards } from "@/content/live-site/applications";

const cardIcons = [Car, Bath, Monitor, Cog];

const applicationsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "应用案例",
  description: "特澳阻尼器应用案例:汽车内外饰、家居、办公设备与工业设备。",
  url: "https://www.chinateao.com/applications/",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: applicationCards.map((card, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Thing", name: card.title, url: "https://www.chinateao.com" + card.href },
    })),
  },
};

export default function ApplicationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationsJsonLd) }} />
      <PageHero
        eyebrow="应用案例"
        title="为每一种应用而设计"
        description="特澳阻尼器服务于汽车、家居、办公设备与工业领域,覆盖开合、缓冲、缓降与回弹控制。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "应用案例" }]}
      />

      <section className={`${container} py-16 lg:py-20`}>
        <div className="grid gap-6 md:grid-cols-2">
          {applicationCards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <Reveal key={card.key} delay={((i % 2) + 1) as 1 | 2}>
                <Link
                  href={card.href}
                  className="group relative block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_16px_44px_rgba(30,30,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_24px_60px_rgba(232,120,26,0.14)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute left-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-700 backdrop-blur">
                      <Icon size={18} />
                    </span>
                    <div className="absolute inset-x-5 bottom-5 text-white">
                      <h2 className="text-2xl font-black tracking-tight">{card.title}</h2>
                      <p className="mt-1 max-w-[420px] text-caption leading-relaxed text-white/80">{card.description}</p>
                    </div>
                    <span className="absolute right-5 bottom-5 grid h-10 w-10 place-items-center rounded-full bg-white text-brand-700 shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
