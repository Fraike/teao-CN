import { db } from "@/db";
import { categories } from "@/db/schema";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import Link from "next/link";

export async function ProductGrid() {
  const cats = await db.select().from(categories).orderBy(categories.sortOrder);

  return (
    <section className="section bg-white py-20" id="products">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <SectionHead
          eyebrow="产品中心"
          title={<>从标准型号到<b className="font-black text-brand-700">按图非标定制</b></>}
          description="每款产品支持扭矩范围、阻尼方向、安装方式和材料定制。点击查看参数表、尺寸图和性能曲线。"
        />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5">
          {cats.map((cat, i) => (
            <Reveal key={cat.id} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <article className="group rounded-[14px] border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 ease-out hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                {/* Image */}
                <div className="grid place-items-center aspect-[1/0.78] bg-[#FAF8F5] p-[22px] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-[88%] object-contain transition-transform duration-400 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Body */}
                <div className="px-5 pt-[18px] pb-[22px]">
                  <h3 className="text-base font-bold text-ink">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-[1.65] text-muted min-h-[38px]">
                    {cat.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-soft">
                    <span className="text-[11px] font-medium text-muted">了解更多</span>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 transition-all duration-200 hover:gap-[7px]"
                    >
                      获取报价 &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
