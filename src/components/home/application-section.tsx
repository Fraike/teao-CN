import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import Link from "next/link";

/* ── SVG icons for each application card ── */
function CupIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function GloveBoxIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}

function ChargePortIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/* ── Application card data ── */
const appCards = [
  {
    icon: <CupIcon />,
    title: "汽车杯托 / 储物盒",
    description: "解决弹开过快、末端撞击和手感突兀问题，让开合节奏一致且安静。",
    recommend: "推荐：齿轮阻尼器 RD-T 系列",
  },
  {
    icon: <GloveBoxIcon />,
    title: "手套箱 / 扶手箱",
    description: "控制打开速度，提升乘员舱使用质感，避免储物格意外砸落。",
    recommend: "推荐：手套箱阻尼器 RD-V 系列",
  },
  {
    icon: <StorageIcon />,
    title: "家电 / 卫浴盖板",
    description: "洗衣机、马桶盖、电饭煲等开合结构的缓降静音，提升产品品质感。",
    recommend: "推荐：轴向阻尼器 / 定制机构",
  },
  {
    icon: <ChargePortIcon />,
    title: "医疗 / 工业机构",
    description: "设备罩壳、检修面板、运动机构模块的可控缓冲与平稳运动方案。",
    recommend: "推荐：齿轮 / 轴向阻尼器",
  },
];

export function ApplicationSection() {
  return (
    <section className="section bg-[#F7F6F4] py-20" id="applications">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <SectionHead
          eyebrow="应用领域"
          title={<>先看场景，<b className="font-black text-brand-700">再选产品</b></>}
          description="国内采购更习惯从使用场景出发找解决方案。以下是我们最常见的应用领域和推荐产品组合。"
        />

        <div className="grid grid-cols-1 gap-5 items-stretch lg:grid-cols-[1.1fr_0.9fr]">
          {/* ── Left hero card ── */}
          <Reveal>
            <div
              className="relative flex flex-col justify-between min-h-[440px] p-10 rounded-[14px] overflow-hidden text-white"
              style={{
                background:
                  "linear-gradient(160deg, rgba(26,26,30,0.82) 0%, rgba(26,26,30,0.45) 50%, rgba(26,26,30,0.80) 100%), url('/images/company/automation-workshop.webp') center/cover no-repeat",
              }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-brand-500/15 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

              <div className="relative z-10">
                <h3 className="text-[28px] leading-[1.25] font-semibold max-w-[450px]">
                  多领域开合机构的<br />
                  <em className="not-italic text-brand-500 font-black">静音缓冲方案</em>
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.8] text-white/75 max-w-[440px]">
                  解决杯托弹开撞击、手套箱下落过快、家电盖板缓降、马桶盖缓冲、医疗设备平稳运动等问题。稳定扭矩输出，适配 -30°C ～ +80°C 温度区间。
                </p>
              </div>

              <Link
                href="/contacts/"
                className="relative z-10 inline-flex items-center gap-1.5 border-[1.5px] border-white/28 bg-white/6 px-[22px] py-3 text-[13px] font-bold rounded-lg transition-all duration-250 hover:border-white/50 hover:bg-white/12 w-fit"
              >
                提交应用需求 &rarr;
              </Link>
            </div>
          </Reveal>

          {/* ── Right 2x2 grid ── */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {appCards.map((card, i) => (
              <Reveal key={card.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="group/card rounded-[14px] border border-line bg-white p-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-[280ms] ease-out hover:border-brand-500/20 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:-translate-y-[3px]">
                  {/* Icon */}
                  <div className="w-10 h-10 grid place-items-center bg-brand-50 text-brand-700 rounded-[10px] mb-3 transition-all duration-[280ms] ease-out group-hover/card:bg-brand-500 group-hover/card:text-white">
                    {card.icon}
                  </div>

                  <h4 className="text-[15px] font-bold text-ink">
                    {card.title}
                  </h4>
                  <p className="mt-1.5 text-[12.5px] leading-[1.65] text-muted">
                    {card.description}
                  </p>
                  <span className="inline-block mt-2.5 px-2.5 py-[3px] text-[11px] font-bold text-brand-700 bg-brand-50 rounded">
                    {card.recommend}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
