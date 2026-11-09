import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { contact, telHref } from "@/content/live-site/contact";

const trustBadges = [
  { label: "IATF 16949", color: "var(--color-green)" },
  { label: "ISO 14001", color: "var(--color-blue)" },
  { label: "8000万件年产能", color: "var(--color-brand-500)" },
  { label: "100%扭矩全检", color: "var(--color-green)" },
  { label: "支持图纸/样品定制", color: "var(--color-brand-500)" },
];

const quickProducts = [
  {
    label: "齿轮阻尼器",
    image: "/images/products/gear-damper/GearDamperCategory.webp",
  },
  {
    label: "轴向阻尼器",
    image: "/images/products/axial-damper/AxialDamperCategory.webp",
  },
];

const sceneTags = [
  "汽车杯托",
  "手套箱",
  "家电盖板",
  "马桶盖",
  "医疗设备",
  "工业机构",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(170deg,#FBF9F6_0%,#F5F2ED_40%,#F0EDE8_100%)]">
      {/* Background overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 78% 30%, rgba(232,120,26,0.08) 0%, transparent 50%), radial-gradient(ellipse at 5% 80%, rgba(232,120,26,0.04) 0%, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at 65% 40%, black 0%, transparent 60%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 65% 40%, black 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto grid w-[min(1240px,calc(100%-48px))] items-center gap-10 py-14 lg:grid-cols-[1fr_400px]">
        {/* ── Left content ── */}
        <div>
          {/* Eyebrow tag */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-[20px] border border-brand-500/20 bg-white/70 px-[18px] py-2 text-[12.5px] font-bold tracking-[0.04em] text-brand-700 backdrop-blur-[8px]">
              <span className="h-[7px] w-[7px] rounded-full bg-brand-500 shadow-[0_0_8px_rgba(232,120,26,0.15)]" />
              面向汽车 · 家电 · 卫浴 · 医疗 · 工业供应链
            </div>
          </Reveal>

          {/* Headline */}
          <h1 className="mt-[22px] font-sans text-[clamp(36px,4.5vw,60px)] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
            <Reveal delay={1} className="inline-block">
              多领域{" "}
            </Reveal>
            <Reveal delay={2} className="inline-block">
              <em className="not-italic relative font-black text-brand-700">
                阻尼器
                <span className="absolute bottom-[2px] left-0 h-2 w-full rounded bg-brand-500/12 -z-[1]" />
              </em>
            </Reveal>
            <Reveal delay={3} className="inline-block">
              与锁扣
            </Reveal>
            <br />
            <Reveal delay={4} className="inline-block">
              <b className="font-black">定制源头厂家</b>
            </Reveal>
          </h1>

          {/* Description */}
          <Reveal delay={2}>
            <p className="mt-4 max-w-[540px] text-[15px] leading-[1.8] text-muted">
              特澳 TEAO
              专注齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push
              锁扣及定制缓冲机构研发制造。产品广泛应用于汽车、家电、卫浴、医疗、工业等领域，支持扭矩、角度、方向和安装结构按图定制，从打样到量产一体化交付。
            </p>
          </Reveal>

          {/* Trust badges */}
          <Reveal delay={3}>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-brand-500/25 hover:bg-brand-50 hover:-translate-y-px"
                >
                  <span
                    className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                    style={{ backgroundColor: badge.color }}
                  />
                  {badge.label}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={4}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button
                href="#contact"
                variant="primary"
                className="gap-[7px]"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                发送图纸获取选型建议
              </Button>
              <Button
                href={telHref(contact.primaryMobile)}
                variant="outline"
                className="gap-1.5"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                电话咨询
              </Button>
              <Button
                href="/contacts/#wechat"
                variant="outline"
                className="gap-1.5"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                加微信
              </Button>
            </div>
          </Reveal>

          {/* Scene tags */}
          <Reveal delay={5}>
            <p className="mt-4 text-[12.5px] font-medium leading-[1.7] text-muted-light">
              适用于：
              {sceneTags.map((tag) => (
                <code
                  key={tag}
                  className="mx-0.5 inline-block rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700"
                >
                  {tag}
                </code>
              ))}
              等开合缓冲结构
            </p>
          </Reveal>
        </div>

        {/* ── Right panel: hidden on mobile ── */}
        <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:self-stretch lg:justify-center">
          {/* Inquiry card */}
          <div className="rounded-[14px] border border-line bg-white/85 p-[26px] shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-[16px]">
            <h3 className="text-center text-lg font-bold text-ink">
              工程师在线评估
            </h3>
            <p className="mb-4 mt-1 text-center text-[12.5px] leading-[1.65] text-muted">
              提交产品类型、应用场景、目标扭矩或上传图纸，工程师将在 2
              小时内给出选型与打样建议。
            </p>
            <div className="mb-3.5 grid grid-cols-2 gap-2">
              {quickProducts.map((prod) => (
                <div
                  key={prod.label}
                  className="cursor-pointer rounded-[10px] border border-line-soft bg-white p-3 text-center transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-brand-500/25 hover:bg-brand-50"
                >
                  <div className="mx-auto w-[85%] aspect-[1.1] relative">
                    <Image
                      src={prod.image}
                      alt={prod.label}
                      fill
                      className="object-contain"
                      sizes="160px"
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-ink-soft">
                    {prod.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[10px] border border-line-soft bg-surface p-3 text-center">
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.05em] text-muted-light">
                  需要提供
                </label>
                <strong className="block text-[13px] font-semibold text-ink">
                  图纸 / 样品 / 年用量
                </strong>
              </div>
              <div className="rounded-[10px] border border-line-soft bg-surface p-3 text-center">
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.05em] text-muted-light">
                  回复方式
                </label>
                <strong className="block text-[13px] font-semibold text-ink">
                  电话 / 微信 / 邮件
                </strong>
              </div>
            </div>
          </div>

          {/* Hotline strip */}
          <div className="flex items-center gap-2.5 rounded-[10px] bg-[linear-gradient(135deg,#E8781A,#F09630)] px-[18px] py-3.5 text-white">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            <div>
              <b className="block text-lg font-bold">{contact.primaryName} {contact.primaryMobile}</b>
              <span className="text-[11px] opacity-85">
                微信 {contact.wechat} · 工作日 8:30–18:00
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
