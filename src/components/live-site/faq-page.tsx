import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { faqGroups } from "@/content/live-site/faq";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap(group =>
    group.items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className={`${container} py-14`}>
        <h1 className="sr-only">常见问题 | 阻尼器定制与选型</h1>
        <SectionHead
          eyebrow="常见问题"
          title="阻尼器定制与选型,快速答疑"
          description="关于特澳产品、定制能力、交期与询盘的常见问题解答。"
        />
        <div className="mx-auto max-w-3xl space-y-10">
          {faqGroups.map((group, gi) => (
            <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
              <section>
                <h2 className="mb-4 text-lg font-bold text-ink">{group.label}</h2>
                <div className="divide-y divide-line-soft rounded-xl border border-line bg-white">
                  {group.items.map(item => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
                        {item.q}
                        <span className="shrink-0 text-brand-700 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-7 text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
