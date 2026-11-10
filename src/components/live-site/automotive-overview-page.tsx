import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./container";
import { automotiveInteriorMap, automotiveExteriorMap } from "@/content/live-site/applications";

const zoneEntries = [
  {
    title: "汽车内饰",
    description: "中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板。",
    href: "/applications/automotive-interior/internal/",
    image: automotiveInteriorMap.image,
    count: 6,
  },
  {
    title: "汽车外饰",
    description: "平嵌式外门把手与新能源汽车充电口盖。",
    href: "/applications/automotive-interior/external/",
    image: automotiveExteriorMap.image,
    count: 2,
  },
];

const automotiveOverviewJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "汽车内外饰阻尼器应用",
  description: "汽车内饰与外饰阻尼器应用:中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒、遮阳板、外门把手与充电口盖。",
  url: "https://www.chinateao.com/applications/automotive-interior/",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: zoneEntries.map((entry, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Thing", name: entry.title, url: "https://www.chinateao.com" + entry.href },
    })),
  },
};

export default function AutomotiveOverviewPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(automotiveOverviewJsonLd) }} />
      <PageHero
        eyebrow="汽车内外饰"
        title="车内车外,静音顺滑"
        description="电动车与高端座舱更安静,开合、回弹的机械声更容易被察觉。选择区域,查看对应位置的应用与推荐型号。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "应用案例", href: "/applications/" }, { label: "汽车内外饰" }]}
      />

      <section className={`${container} py-16 lg:py-20`}>
        <div className="grid gap-6 lg:grid-cols-2">
          {zoneEntries.map((entry, i) => (
            <Reveal key={entry.href} delay={((i % 2) + 1) as 1 | 2}>
              <Link
                href={entry.href}
                className="group relative block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_16px_44px_rgba(30,30,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_24px_60px_rgba(232,120,26,0.14)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image
                    src={entry.image}
                    alt={`${entry.title}阻尼器应用位置`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-700 backdrop-blur">
                    {entry.count} 个应用位置
                  </span>
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <h2 className="text-2xl font-black tracking-tight">{entry.title}</h2>
                    <p className="mt-1 max-w-[420px] text-[13px] leading-relaxed text-white/80">{entry.description}</p>
                  </div>
                  <span className="absolute right-5 bottom-5 grid h-10 w-10 place-items-center rounded-full bg-white text-brand-700 shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
