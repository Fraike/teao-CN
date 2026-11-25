import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3, ShieldCheck, TrendingUp } from "lucide-react";
import { patents } from "@/content/patents";

const summaries = [
  {
    icon: Layers3,
    value: "5 大技术方向",
    label: "齿轮 · 齿条 · 空气 / 拉绳 · 门锁",
    detail: "覆盖核心开合结构与测试方法",
  },
  {
    icon: TrendingUp,
    value: "2017–2024",
    label: "持续授权",
    detail: "围绕客户场景持续迭代",
  },
  {
    icon: ShieldCheck,
    value: "发明 + 实用新型",
    label: "双重保护",
    detail: "结构设计与测试方法同步布局",
  },
] as const;

export function PatentWall() {
  return (
    <section id="patents" className="relative isolate scroll-mt-24 overflow-hidden bg-ink py-12 lg:py-16">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 18% 0%, rgba(232,120,26,0.16) 0%, transparent 46%), radial-gradient(ellipse at 92% 88%, rgba(249,211,180,0.08) 0%, transparent 42%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <span className="pointer-events-none absolute -right-8 top-0 -z-10 select-none text-[120px] font-black leading-none tracking-[-0.08em] text-white/[0.025] lg:text-[190px]">
        PATENT
      </span>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/20 bg-brand-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-200">
              <ShieldCheck size={12} /> 知识产权 · 荣誉墙
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl lg:text-[34px] lg:leading-[1.12]">
              多项核心专利，守护每一次<span className="text-brand-200">开合</span>
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/60">
              从结构设计到测试方法，特澳持续进行专利布局。专利不是墙上的装饰，而是产品稳定交付的底气。
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/45">
            <ShieldCheck size={14} className="text-brand-200" /> 2017–2024 · 持续授权
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-2.5 lg:gap-3"
        >
          {patents.map(patent => (
            <div
              key={patent.id}
              className="relative aspect-[1/1.414] overflow-hidden rounded-xl border border-white/10 bg-white p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-md bg-white">
                <Image
                  src={patent.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 18vw, 220px"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
          {summaries.map(({ icon: Icon, value, label, detail }) => (
            <div key={value} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-brand-200">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm font-black text-white/90">{value}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/55">{label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/40">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-white/45">
            以上为部分授权专利展示，信息以证书原件为准。
          </p>
          <Link
            href="/products/"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-[11px] font-bold text-white/75 transition-colors hover:border-brand-200/40 hover:text-white"
          >
            查看专利产品 <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
