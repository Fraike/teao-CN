import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { CONVERT_PATH, LIVE_ORIGIN } from "@/lib/live-site";
import { container } from "./catalog";
import TorqueConverter from "./torque-converter";

const convertJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "扭矩单位换算器",
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Web",
  description: "免费在线扭矩单位换算工具,支持 N·m、cN·m、mN·m、kgf·cm、kgf·m、gf·cm、lbf·in、lbf·ft、ozf·in 九种单位即时互转,适用于阻尼器扭矩选型与工程参数对比。",
  url: LIVE_ORIGIN + CONVERT_PATH,
  inLanguage: "zh-CN",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
  publisher: {
    "@type": "Organization",
    name: "东莞市特澳电子科技有限公司",
    url: LIVE_ORIGIN + "/",
  },
};

const howToSteps = [
  { step: "01", title: "输入数值", description: "在上方输入框中输入任意扭矩数值。" },
  { step: "02", title: "选择单位", description: "在下拉菜单中选择该数值对应的单位。" },
  { step: "03", title: "读取结果", description: "九种常用单位的换算结果会即时更新,无需点击按钮。" },
];

export default function ConvertPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(convertJsonLd) }} />
      <PageHero
        eyebrow="工程工具"
        title="扭矩单位换算"
        description="九种常用扭矩单位即时互转,用于阻尼器选型与技术参数对齐。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "扭矩换算" }]}
        align="center"
      />

      <section className={`${container} py-16 lg:py-20`}>
        <TorqueConverter />
      </section>

      <section className="border-y border-line bg-white">
        <div className={`${container} py-16 lg:py-20`}>
          <SectionHead
            eyebrow="使用说明"
            title="三步完成扭矩换算"
            description="无需点击按钮,所有单位结果随输入即时更新。"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {howToSteps.map((item, i) => (
              <Reveal key={item.step} delay={(i + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-2xl border border-line bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  <span className="text-xs font-bold tracking-[0.14em] text-brand-700">{item.step}</span>
                  <h3 className="mt-2 font-bold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-line bg-surface p-5 text-center text-sm leading-relaxed text-muted">
            <strong className="text-brand-700">特澳提示:</strong>
            不同厂商的阻尼器扭矩标注单位差异较大——gf·cm、N·m、mN·m、kgf·cm 等。对比产品参数时,可用本工具快速统一单位。
          </div>
        </div>
      </section>
    </>
  );
}
