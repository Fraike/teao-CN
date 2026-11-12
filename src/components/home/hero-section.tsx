import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { liveCatalog } from "@/lib/live-catalog";
import { liveHref } from "@/lib/live-site";

const heroProducts = ["gear-damper", "axial-damper", "latch"]
  .map(id => liveCatalog.find(category => category.id === id))
  .filter((category): category is NonNullable<typeof category> => Boolean(category));

const proofPoints = [
  "200+ 家客户",
  "支持按图定制",
  "PPAP 文件支持",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface-warm">
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

      <div className="home-shell relative z-[2] grid items-center gap-10 py-[clamp(2.5rem,4.6vw,5.5rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-[clamp(2rem,4vw,5rem)]">
        {/* ── Left content ── */}
        <div className="min-w-0">
          {/* Eyebrow */}
          <Reveal>
            <p className="flex items-center gap-2.5 text-caption font-medium tracking-[0.06em] text-brand-700">
              <span className="h-px w-6 bg-brand-500" />
              汽车 · 家电 · 卫浴 · 医疗 · 工业供应链
            </p>
          </Reveal>

          {/* Headline */}
          <h1 className="mt-5 font-sans text-[clamp(1.75rem,3.4vw,3.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
            <Reveal delay={1} className="inline-block">
              多领域{" "}
            </Reveal>
            <Reveal delay={2} className="inline-block">
              <em className="not-italic font-semibold text-brand-700">阻尼器</em>
            </Reveal>
            <Reveal delay={3} className="inline-block">
              与锁扣
            </Reveal>
            <br />
            <Reveal delay={4} className="inline-block">
              <span className="font-semibold">定制源头厂家</span>
            </Reveal>
          </h1>

          {/* Description */}
          <Reveal delay={2}>
            <p className="mt-5 max-w-[34rem] text-body leading-[1.8] text-muted">
              扭矩、方向与安装结构按图定制,从打样到量产一体化交付。
            </p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={4}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button href="#products" variant="primary">
                查看产品型号
              </Button>
              <Button href="/contacts/" variant="outline">
                获取报价
              </Button>
            </div>
          </Reveal>

          {/* Proof points */}
          <Reveal delay={5}>
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted">
              {proofPoints.map(point => (
                <li key={point} className="flex items-center gap-1.5">
                  <Check size={13} className="shrink-0 text-brand-500" strokeWidth={3} />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ── Right panel: product collage ── */}
        <aside className="relative min-w-0" aria-label="主要产品">
          <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(ellipse_at_55%_35%,rgba(232,120,26,0.12),transparent_62%)]" />
          <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 lg:gap-4">
            {heroProducts.map((category, index) => (
              <Link
                key={category.id}
                href={liveHref(category.path)}
                aria-label={`查看${category.label}`}
                className={`group relative overflow-hidden rounded-2xl border border-line shadow-[0_10px_30px_rgba(30,30,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_18px_42px_rgba(232,120,26,0.12)] ${
                  index === 0
                    ? "col-span-2 h-[clamp(8.5rem,36vw,12rem)] sm:col-span-1 sm:h-44 lg:col-span-2 lg:h-[clamp(11rem,min(14vw,30svh),19rem)] bg-[linear-gradient(135deg,#FFF7EF_0%,#FFFFFF_62%)]"
                    : "h-[clamp(6.5rem,28vw,10rem)] bg-white sm:h-44 lg:h-[clamp(9rem,min(11vw,22svh),15rem)]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  preload={index === 0}
                  sizes={index === 0 ? "(min-width: 1024px) 45vw, (min-width: 640px) 31vw, 92vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 45vw"}
                  className="object-contain px-3 pt-2 pb-8 sm:px-5 lg:px-8 lg:pt-5 lg:pb-10 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 rounded-full sm:bottom-3 sm:left-3 bg-white/95 px-3 py-1 text-micro font-semibold text-ink shadow-sm">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

