"use client";
import { Reveal } from "@/components/ui/reveal";

const partners = [
  { name: "比亚迪", en: "BYD" },
  { name: "吉利", en: "Geely" },
  { name: "奇瑞", en: "Chery" },
  { name: "上汽", en: "SAIC" },
  { name: "一汽", en: "FAW" },
  { name: "广汽", en: "GAC" },
  { name: "长安", en: "Changan" },
  { name: "长城", en: "GreatWall" },
  { name: "东风", en: "Dongfeng" },
  { name: "蔚来", en: "NIO" },
  { name: "小鹏", en: "XPeng" },
  { name: "理想", en: "LiAuto" },
];

export function PartnerSection() {
  return (
    <section className="section bg-white py-20" id="clients">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[320px_1fr]">
          {/* ── Left: section copy ── */}
          <Reveal>
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] uppercase text-brand-700
                before:content-[''] before:block before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                客户案例
              </p>
              <h2 className="mt-2 text-[36px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">
                服务汽车及<br />
                <b className="font-black text-brand-700">家电供应链客户</b>
              </h2>
              <p className="mt-3.5 max-w-[430px] text-[14px] leading-[1.75] text-muted">
                产品已应用于国内外多家汽车品牌及零部件供应商项目，覆盖燃油车与新能源车型。
              </p>
            </div>
          </Reveal>

          {/* ── Right: logo grid ── */}
          <Reveal delay={1}>
            <div className="grid grid-cols-3 overflow-hidden rounded-[14px] border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:grid-cols-4">
              {partners.map((partner, i) => {
                // 4-col: cells 4,8 (index 3,7,11) are last in row — no border-r
                // 3-col mobile: cells 3,6,9 (index 2,5,8,11) are last in row
                const borderR =
                  !((i + 1) % 4 === 0) ? "border-r border-line-soft" : "";
                const borderB =
                  i < partners.length - (partners.length % 4 || 4)
                    ? "border-b border-line-soft"
                    : "";

                return (
                  <div
                    key={partner.en}
                    className={`grid min-h-[82px] place-items-center bg-white px-2.5 py-3.5 transition-all duration-[250ms] hover:bg-[#FAF8F5] ${borderR} ${borderB}
                      [&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(3n)]:border-line-soft lg:[&:nth-child(4n)]:border-r-0`}
                  >
                    <img
                      src={`https://teao-damper.com/images/partners/${partner.en}.webp`}
                      alt={partner.name}
                      loading="lazy"
                      className="max-w-[82%] max-h-[46px] object-contain transition-all duration-300 ease-out"
                      style={{
                        filter: "grayscale(20%) brightness(0.94)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.filter =
                          "grayscale(0%) brightness(1)";
                        (e.currentTarget as HTMLImageElement).style.transform =
                          "scale(1.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.filter =
                          "grayscale(20%) brightness(0.94)";
                        (e.currentTarget as HTMLImageElement).style.transform =
                          "scale(1)";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
