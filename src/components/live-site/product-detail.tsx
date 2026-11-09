import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge, Wrench } from "lucide-react";
import { liveHref, LIVE_ORIGIN } from "@/lib/live-site";
import { getForceBar, getTorqueBar } from "@/lib/product-display";
import { enrichProduct } from "@/lib/product-enrichment";
import {
  buildProductFaq,
  formatCycles,
  formatRange,
  getRelatedProducts,
  type ProductContent,
} from "@/lib/product-content";
import type { CatalogCategory } from "@/lib/live-catalog";
import ProductCard from "./product-card";
import ProductGallery from "./product-gallery";
import DimensionDrawing from "./dimension-drawing";
import InquiryCTA from "./inquiry-cta";
import { container } from "./container";

function SectionTitle({ index, title, description }: { index: string; title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
      <div className="flex items-baseline gap-4">
        <span className="text-[11px] font-black tracking-[0.18em] text-brand-700">{index}</span>
        <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">{title}</h2>
      </div>
      {description && <p className="max-w-[380px] text-xs leading-relaxed text-muted">{description}</p>}
    </div>
  );
}

export default function ProductDetail({ product, category }: { product: ProductContent; category: CatalogCategory }) {
  const related = getRelatedProducts(category.id, product.path, 4, product.model).map(item => enrichProduct(category.id, item));
  const faq = buildProductFaq(product);
  const torqueBar = getTorqueBar(product.torque);
  const forceBar = getForceBar(product.force);
  const rangeBar = torqueBar ?? forceBar;

  const stats = [
    product.durability ? { label: "耐久性", value: formatCycles(product.durability.cycles) } : null,
    product.hardTorque ? { label: "硬扭矩", value: product.hardTorque } : null,
    product.hardForce ? { label: "按压力", value: product.hardForce } : null,
    product.soundType ? { label: "声音", value: product.soundType } : null,
    product.bufferDirection ? { label: "阻尼方向", value: product.bufferDirection } : null,
    product.assemblyMethod ? { label: "安装方式", value: product.assemblyMethod } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  let sectionIndex = 0;
  const nextSection = () => String(++sectionIndex).padStart(2, "0");

  const canonical = LIVE_ORIGIN + encodeURI(product.path);
  const additionalProperty = [
    product.torque ? { "@type": "PropertyValue", name: "可调扭矩", value: formatRange(product.torque) } : null,
    product.force ? { "@type": "PropertyValue", name: "操作力", value: formatRange(product.force) } : null,
    product.hardTorque ? { "@type": "PropertyValue", name: "硬扭矩", value: product.hardTorque } : null,
    product.hardForce ? { "@type": "PropertyValue", name: "按压力", value: product.hardForce } : null,
    product.durability ? { "@type": "PropertyValue", name: "耐久性", value: formatCycles(product.durability.cycles) } : null,
    product.bufferDirection ? { "@type": "PropertyValue", name: "阻尼方向", value: product.bufferDirection } : null,
    product.assemblyMethod ? { "@type": "PropertyValue", name: "安装方式", value: product.assemblyMethod } : null,
    ...product.materials.map(item => ({ "@type": "PropertyValue", name: item.part, value: item.material })),
  ].filter(Boolean);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.model,
    description: product.summary,
    image: product.images.map(image => LIVE_ORIGIN + image.url),
    category: category.label,
    brand: { "@type": "Brand", name: "特澳 TEAO" },
    manufacturer: { "@type": "Organization", name: "东莞市特澳电子科技有限公司" },
    additionalProperty,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: LIVE_ORIGIN + "/" },
      { "@type": "ListItem", position: 2, name: "产品", item: LIVE_ORIGIN + "/products/" },
      { "@type": "ListItem", position: 3, name: category.label, item: LIVE_ORIGIN + encodeURI(category.path) },
      { "@type": "ListItem", position: 4, name: product.model, item: canonical },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-line bg-gradient-to-b from-surface-warm via-white to-white">
        <div className={container}>
          <nav aria-label="面包屑" className="flex flex-wrap items-center gap-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-light">
            <Link href="/" className="transition-colors hover:text-brand-700">首页</Link>
            <span className="text-line">/</span>
            <Link href="/products/" className="transition-colors hover:text-brand-700">产品</Link>
            <span className="text-line">/</span>
            <Link href={category.path} className="transition-colors hover:text-brand-700">{category.label}</Link>
            <span className="text-line">/</span>
            <span aria-current="page" className="text-ink-soft">{product.model}</span>
          </nav>

          <div className="grid items-start gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={product.images} altBase={product.model} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-700">{category.label}</span>
              </div>

              <h1 className="mt-4 text-[clamp(32px,4.2vw,52px)] font-black leading-[0.98] tracking-[-0.045em] text-ink">
                {product.name}
              </h1>
              <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-muted">{product.summary}</p>

              {product.characteristics.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.characteristics.map(item => (
                    <span key={item} className="rounded-full border border-line bg-white px-3 py-1 text-[11px] font-bold tracking-[0.02em] text-ink-soft">{item}</span>
                  ))}
                </div>
              )}

              {rangeBar && (
                <div className="mt-8 rounded-2xl border border-brand-500/20 bg-white p-5 shadow-[0_10px_30px_rgba(232,120,26,0.06)]">
                  <div className="mb-3 flex items-end justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-light">
                      {torqueBar ? <Gauge size={14} className="text-brand-500" /> : <Wrench size={14} className="text-brand-500" />}
                      {torqueBar ? "可调扭矩" : "操作力"}
                    </span>
                    <span className="text-xl font-black tabular-nums tracking-[-0.02em] text-ink">
                      {product.torque ? formatRange(product.torque) : product.force ? formatRange(product.force) : ""}
                    </span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-surface ring-1 ring-line">
                    <div
                      className="absolute inset-y-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 shadow-[0_0_14px_rgba(232,120,26,0.4)]"
                      style={{ left: `${rangeBar.start}%`, width: `${rangeBar.width}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-semibold tabular-nums text-muted-light">
                    <span>0</span>
                    <span>{rangeBar.scaleMax} {(product.torque ?? product.force)!.unit}</span>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/contacts/"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_14px_30px_rgba(30,30,32,0.2)]"
                >
                  获取报价
                  <ArrowUpRight size={16} />
                </Link>
                <a
                  href="tel:076982937929"
                  className="inline-flex items-center rounded-full border border-line bg-white px-8 py-4 text-sm font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  电话咨询
                </a>
              </div>

              <p className="mt-5 text-[11px] leading-relaxed text-muted-light">
                支持按应用调校扭矩、方向与安装结构;提供样品验证与 PPAP 文档。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark performance band */}
      {stats.length > 0 && (
        <section className="bg-ink">
          <div className={`${container} flex flex-wrap`}>
            {stats.map(item => (
              <div key={item.label} className="min-w-[150px] flex-1 border-l border-white/10 px-5 py-6 first:border-l-0 first:pl-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{item.label}</p>
                <p className="mt-2 text-lg font-black tracking-[-0.02em] tabular-nums text-white lg:text-xl">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {product.dimensionDrawing && (
        <section className={`${container} py-14`}>
          <SectionTitle index={nextSection()} title="尺寸图" description="点击图片可全屏查看,便于核对安装空间与结构配合。" />
          <div className="rounded-2xl border border-line bg-surface-warm p-5 lg:p-8">
            <div className="mx-auto max-w-4xl">
              <DimensionDrawing src={product.dimensionDrawing} alt={`${product.model} 尺寸图`} />
            </div>
          </div>
        </section>
      )}

      {(product.specifications.length > 0 || product.materials.length > 0) && (
        <section className="border-y border-line bg-white">
          <div className={`${container} py-14`}>
            <SectionTitle index={nextSection()} title="技术参数" description="以下参数来自产品实测与图纸,可按应用要求调整。" />
            <div className={`grid gap-6 ${product.specifications.length > 0 && product.materials.length > 0 ? "lg:grid-cols-2" : ""}`}>
              {product.specifications.length > 0 && (
                <div className="rounded-2xl border border-line bg-white p-6">
                  <h3 className="mb-4 text-[13px] font-black uppercase tracking-[0.12em] text-ink">规格</h3>
                  <table className="w-full">
                    <tbody>
                      {product.specifications.map(spec => (
                        <tr key={spec.label} className="border-t border-line-soft transition-colors first:border-t-0 hover:bg-surface/70">
                          <th scope="row" className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-[0.04em] text-muted">{spec.label}</th>
                          <td className="py-3 text-right text-sm font-bold tabular-nums text-ink">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {product.materials.length > 0 && (
                <div className="rounded-2xl border border-line bg-white p-6">
                  <h3 className="mb-4 text-[13px] font-black uppercase tracking-[0.12em] text-ink">材料清单</h3>
                  <table className="w-full">
                    <tbody>
                      {product.materials.map(item => (
                        <tr key={item.part} className="border-t border-line-soft transition-colors first:border-t-0 hover:bg-surface/70">
                          <th scope="row" className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-[0.04em] text-muted">{item.part}</th>
                          <td className="py-3 text-right text-sm font-bold tabular-nums text-ink">{item.material}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {product.variants && (
        <section className={`${container} py-14`}>
          <SectionTitle index={nextSection()} title="型号对比" description="同系列不同变体的关键尺寸差异,便于快速选型。" />
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-ink text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">参数</th>
                  {product.variants.variants.map(model => (
                    <th key={model} scope="col" className="px-5 py-4 text-right text-[12px] font-bold tabular-nums">{model}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.variants.rows.map(row => {
                  const uniform = row.values.every(value => value === row.values[0]);
                  return (
                    <tr key={row.param} className={`border-t border-line-soft ${uniform ? "text-muted-light" : "text-ink"}`}>
                      <th scope="row" className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-[0.04em]">{row.param}</th>
                      {row.values.map((value, index) => (
                        <td key={`${row.param}-${index}`} className="px-5 py-3 text-right font-semibold tabular-nums">{value}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {product.performanceCharts && (
        <section className="border-y border-line bg-surface-warm">
          <div className={`${container} py-14`}>
            <SectionTitle index={nextSection()} title="性能曲线" description="扭矩随转速与温度的变化趋势,用于评估实际工况下的手感。" />
            <div className="grid gap-5 lg:grid-cols-2">
              {[
                { src: product.performanceCharts.rotation, label: "扭矩 - 转速曲线" },
                { src: product.performanceCharts.temperature, label: "扭矩 - 温度曲线" },
              ].filter((item): item is { src: string; label: string } => Boolean(item.src)).map(chart => (
                <figure key={chart.label} className="rounded-2xl border border-line bg-white p-5">
                  <div className="relative aspect-[2/1] rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(232,120,26,0.05),transparent_45%)]">
                    <Image src={chart.src} alt={`${product.model} ${chart.label}`} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-contain" />
                  </div>
                  <figcaption className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                    <span className="h-px w-6 bg-brand-500" />
                    {chart.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.applicationScenarios.length > 0 && (
        <section className={`${container} py-14`}>
          <SectionTitle index={nextSection()} title="应用场景" description="该型号在典型机构中的实际使用位置。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.applicationScenarios.map(scene => (
              <figure key={`${scene.image}-${scene.label}`} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-surface">
                  <Image src={scene.image} alt={scene.label} fill unoptimized sizes="(max-width: 768px) 100vw, 400px" className="object-contain p-2" />
                </div>
                <figcaption className="border-t border-line-soft px-4 py-3 text-[13px] font-bold text-ink">{scene.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line bg-white">
        <div className={`${container} py-14`}>
          <SectionTitle index={nextSection()} title="选型常见问题" description="报价前常被问到的三个问题。" />
          <div className="divide-y divide-line-soft rounded-2xl border border-line bg-white">
            {faq.map((item, index) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-sm font-bold text-ink lg:px-6">
                  <span className="text-[11px] font-black tabular-nums text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{item.question}</span>
                  <span className="shrink-0 text-lg font-light text-brand-700 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 pl-[52px] text-sm leading-7 text-muted lg:px-6 lg:pl-[56px]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className={`${container} py-14`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-black tracking-[0.18em] text-brand-700">{nextSection()}</span>
                <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">相关产品</h2>
              </div>
              <Link href={liveHref(category.path)} className="text-sm font-bold text-brand-700 hover:underline">
                查看全部 {category.label} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-5">
              {related.map(item => <ProductCard key={item.path} product={item} />)}
            </div>
          </div>
        </section>
      )}

      <InquiryCTA />
    </>
  );
}
