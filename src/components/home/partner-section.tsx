import Image from "next/image";
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
    <section className="bg-white py-20" id="clients">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[320px_1fr]">
          {/* ── Left: section copy ── */}
          <Reveal>
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-micro font-bold tracking-[0.14em] uppercase text-brand-700
                before:content-[''] before:block before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                客户案例
              </p>
              <h2 className="mt-2 text-[36px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">
                服务汽车及<br />
                <b className="font-black text-brand-700">家电供应链客户</b>
              </h2>
              <p className="mt-3.5 max-w-[430px] text-body leading-[1.75] text-muted">
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
                    <Image
                      src={`/images/partners/${partner.en}.webp`}
                      alt={partner.name}
                      width={140}
                      height={46}
                      sizes="140px"
                      loading="lazy"
                      className="max-h-[46px] w-auto max-w-[82%] object-contain opacity-90 grayscale-[20%] transition-all duration-300 ease-out hover:scale-105 hover:opacity-100 hover:grayscale-0"
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
