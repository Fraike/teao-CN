import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { liveCatalog } from "@/lib/live-catalog";
import { liveHref } from "@/lib/live-site";

const heroProducts = ["gear-damper", "axial-damper", "latch"]
  .map(id => liveCatalog.find(category => category.id === id))
  .filter((category): category is NonNullable<typeof category> => Boolean(category));

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
              专注阻尼器与锁扣机构研发制造,支持扭矩、方向与安装结构按图定制,从打样到量产一体化交付。
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

        {/* ── Right panel: product collage ── */}
        <aside className="relative hidden min-h-[460px] lg:block" aria-label="主要产品">
          {heroProducts.map((category, index) => {
            const placement = [
              "right:6px; top:10px; width:min(420px,68%); height:300px; z-index:3;",
              "left:0; bottom:96px; width:min(300px,48%); height:230px; z-index:2;",
              "right:0; bottom:8px; width:min(360px,58%); height:210px; z-index:4;",
            ][index];
            return (
              <Link
                key={category.id}
                href={liveHref(category.path)}
                aria-label={`查看${category.label}`}
                className="group absolute overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_24px_64px_rgba(232,120,26,0.08),0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_28px_70px_rgba(232,120,26,0.16)]"
                style={parseStyle(placement)}
              >
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 50vw, 420px"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-ink shadow-sm">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </aside>
      </div>
    </section>
  );
}

function parseStyle(styleStr: string): Record<string, string> {
  const obj: Record<string, string> = {};
  styleStr.split(";").forEach(pair => {
    const [key, value] = pair.split(":").map(part => part.trim());
    if (key && value) obj[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  });
  return obj;
}
