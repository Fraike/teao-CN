import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";

const zoneEntries = [
  { title: "汽车内饰", description: "中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的阻尼应用。", href: "/applications/automotive-interior/internal/" },
  { title: "汽车外饰", description: "外门把手与新能源充电口盖的阻尼应用。", href: "/applications/automotive-interior/external/" },
];

export default function AutomotiveOverviewPage() {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">汽车内外饰阻尼器应用 | 特澳 TEAO</h1>
      <SectionHead
        eyebrow="汽车内外饰"
        title="车内车外,静音顺滑"
        description="电动车与高端座舱更安静,开合、回弹的机械声更容易被察觉。选对阻尼器,让每一次动作更精致。"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {zoneEntries.map((entry, i) => (
          <Reveal key={entry.href} delay={((i % 2) + 1) as 1 | 2}>
            <Link href={entry.href} className="group block rounded-2xl border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.06)]">
              <h2 className="mb-3 text-2xl font-bold">{entry.title}</h2>
              <p className="mb-5 text-muted leading-relaxed">{entry.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-500">进入 →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
