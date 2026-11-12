import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";

const capabilities = [
  {
    title: "模具开发",
    description: "根据产品结构和安装空间进行方案评估，自有模具设计与制造能力。",
  },
  {
    title: "注塑生产",
    description: "POM / PA66+GF 等工程塑料精密注塑，过程尺寸与外观控制。",
  },
  {
    title: "自动化装配线",
    description: "半自动到全自动装配，保证产品一致性，适配不同批量需求。",
  },
  {
    title: "扭矩全检",
    description: "围绕核心性能指标进行 100% 出厂扭矩检测与记录。",
  },
  {
    title: "可靠性测试",
    description: "寿命测试、高低温循环、盐雾测试等环境适应性验证能力。",
  },
  {
    title: "批量交付",
    description: "年产能可达千万级，支持汽车主机厂、Tier-1 及家电供应链节奏。",
  },
];

export function CapabilitySection() {
  return (
    <section className="bg-white home-section-space" id="factory">
      <div className="home-shell">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[clamp(2rem,4vw,6rem)]">
          {/* ── Left: photo + description ── */}
          <Reveal>
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-micro font-bold tracking-[0.14em] uppercase text-brand-700
                before:content-[''] before:block before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                制造实力
              </p>
              <h2 className="mt-2 text-[36px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">
                模具开发 &rarr; 注塑生产 &rarr;<br />
                <b className="font-black text-brand-700">自动化装配 &rarr; 批量交付</b>
              </h2>
              <p className="mt-[18px] max-w-[430px] text-body leading-[1.75] text-muted">
                国内采购判断供应商时，工厂实拍、设备清单和检测能力是关键依据。
                我们拥有完整的模具、注塑、装配、检测一体化能力，支持从样品到数百万级的批量交付。
              </p>
              <div className="mt-6 overflow-hidden rounded-[14px] border border-line shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                <div className="relative h-[480px] w-full">
                  <Image
                    src="/images/company/automation-workshop.webp"
                    alt="特澳自动化生产车间"
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-104"
                    sizes="(min-width: 1024px) 39vw, 92vw"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Right: 2x3 capability grid ── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="group relative flex min-h-[140px] flex-col justify-center overflow-hidden rounded-[14px] border border-line bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-[280ms] ease-out hover:border-brand-500/20 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                  {/* Left accent bar — grows on hover */}
                  <span className="absolute top-0 left-0 h-0 w-[3px] bg-brand-500 transition-all duration-[350ms] ease-out group-hover:h-full" />
                  <strong className="text-body-lg font-bold text-ink">{cap.title}</strong>
                  <p className="mt-2 text-caption leading-[1.7] text-muted">{cap.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
