import { liveCatalog } from "@/lib/live-catalog";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import Link from "next/link";

export async function ProductGrid() {
  const cats = liveCatalog;

  return (
    <section className="bg-white py-20" id="products">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <SectionHead
          eyebrow="产品中心"
          title={<>从标准型号到<b className="font-black text-brand-700">按图非标定制</b></>}
          description="每款产品支持扭矩范围、阻尼方向、安装方式和材料定制。点击查看参数表、尺寸图和性能曲线。"
        />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5">
          {cats.map((cat, i) => (
            <Reveal key={cat.id} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <Link
                href={cat.path}
                className="group block h-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.1)]"
              >
                {/* Image */}
                <div className="relative aspect-[1/0.78] overflow-hidden bg-white p-5">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 1024px) 45vw, 220px"
                    className="object-contain transition-transform duration-400 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Body */}
                <div className="px-5 pb-5">
                  <h3 className="text-base font-bold text-ink transition-colors group-hover:text-brand-700">{cat.label}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-brand-700">
                    查看分类
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
