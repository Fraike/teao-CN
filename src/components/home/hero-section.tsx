import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { contact, telHref } from "@/content/live-site/contact";

const trustBadges = [
  { label: "IATF 16949", color: "var(--color-green)" },
  { label: "ISO 14001", color: "var(--color-blue)" },
  { label: "8000万件年产能", color: "var(--color-brand-500)" },
  { label: "100%扭矩全检", color: "var(--color-green)" },
  { label: "支持图纸/样品定制", color: "var(--color-brand-500)" },
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
        <aside className="hidden lg:flex lg:flex-col lg:self-stretch lg:justify-center">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_18px_50px_rgba(30,30,32,0.1)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/company/automation-workshop.webp"
                alt="特澳自动化装配线"
                fill
                sizes="400px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-brand-700 backdrop-blur">
                自动化装配线 · 100% 扭矩全检
              </span>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">销售工程师</p>
              <p className="mt-1 text-xl font-black text-ink">{contact.primaryName}</p>
              <div className="mt-2 space-y-0.5 text-sm text-muted">
                <a href={telHref(contact.primaryMobile)} className="block font-semibold text-ink-soft transition-colors hover:text-brand-700">
                  {contact.primaryMobile}
                </a>
                <p>微信 {contact.wechat}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={telHref(contact.primaryMobile)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 px-3 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  电话咨询
                </a>
                <Link
                  href="/contacts/#wechat"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white px-3 py-2.5 text-[12.5px] font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  加微信
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
