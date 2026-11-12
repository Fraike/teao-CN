import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import InquiryCTA from "./inquiry-cta";
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
      <PageHero
        eyebrow="常见问题"
        title="阻尼器定制与选型,快速答疑"
        description="关于特澳产品、定制能力、交期与询盘的常见问题解答。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "常见问题" }]}
      />

      <section className={`${container} py-16 lg:py-20`}>
        <div className="mx-auto max-w-3xl space-y-10">
          {faqGroups.map((group, gi) => (
            <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-ink">{group.label}</h2>
                <div className="divide-y divide-line-soft rounded-2xl border border-line bg-white">
                  {group.items.map(item => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-body font-semibold text-ink">
                        {item.q}
                        <span className="shrink-0 text-brand-700 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="px-5 pb-5 text-body leading-7 text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
