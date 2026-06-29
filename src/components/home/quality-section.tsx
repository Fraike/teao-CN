import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";

const certs = [
  {
    name: "IATF 16949",
    description: "汽车行业质量管理体系认证 — 覆盖产品设计、生产和服务全过程",
    badge: "IATF",
    badgeBg: "bg-[#2D8A56]",
  },
  {
    name: "ISO 14001",
    description: "环境管理体系认证 — 生产过程环保合规",
    badge: "ISO",
    badgeBg: "bg-[#3B82C4]",
  },
  {
    name: "专利与技术积累",
    description: "阻尼器、锁扣及相关缓冲结构的专利与工艺沉淀",
    badge: "PAT",
    badgeBg: "bg-brand-500",
  },
];

const qcSteps = [
  {
    num: "01",
    title: "来料检验",
    description: "关键原材料和外购件进入生产前先确认材质、尺寸和批次信息。",
  },
  {
    num: "02",
    title: "注塑过程控制",
    description: "注塑成型环节的温度、压力和时间监控，确保尺寸一致性。",
  },
  {
    num: "03",
    title: "100% 扭矩检测",
    description: "围绕核心使用手感和性能指标，对每个成品进行扭矩检测并记录。",
  },
  {
    num: "04",
    title: "出货检验与追溯",
    description: "批次号、外观、功能和包装出货前确认，支持后续质量问题追溯。",
  },
];

export function QualitySection() {
  return (
    <section className="section bg-[#F7F6F4] py-20" id="quality">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <SectionHead
          eyebrow="质量认证"
          title={<>不只是证书墙 — <b className="font-black text-brand-700">展示质量怎么管</b></>}
          description="从来料到出货的全流程质量控制，每一批次产品均可追溯。"
        />

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_1.1fr]">
          {/* ── Left: certification cards ── */}
          <div className="grid gap-3">
            {certs.map((cert) => (
              <Reveal key={cert.name}>
                <div className="group flex items-center justify-between rounded-[14px] border border-line bg-white p-[22px] px-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-[250ms] ease-out hover:translate-x-[3px] hover:border-brand-500/20 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                  <div className="cert-info">
                    <strong className="block text-[19px] font-bold text-ink">{cert.name}</strong>
                    <span className="mt-1 block text-[12.5px] text-muted">{cert.description}</span>
                  </div>
                  <div
                    className={`flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-[10px] text-xs font-bold text-white transition-transform duration-300 ease-out group-hover:rotate-[4deg] group-hover:scale-104 ${cert.badgeBg}`}
                  >
                    {cert.badge}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── Right: QC steps grid (2x2) ── */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {qcSteps.map((step, i) => (
              <Reveal key={step.num} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="group rounded-[14px] border border-line bg-white p-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-[250ms] ease-out hover:border-brand-500/20 hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-[7px] bg-brand-500 text-xs font-bold text-white transition-transform duration-[250ms] ease-out group-hover:scale-108">
                    {step.num}
                  </span>
                  <strong className="mt-3 block text-[15px] font-bold text-ink">{step.title}</strong>
                  <p className="mt-1.5 text-[12.5px] leading-[1.6] text-muted">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
