import Image from "next/image";
import Link from "next/link";
import { Gauge, Wrench } from "lucide-react";
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

export default function ProductDetail({ product, category }: { product: ProductContent; category: CatalogCategory }) {
  const related = getRelatedProducts(category.id, product.path).map(item => enrichProduct(category.id, item));
  const faq = buildProductFaq(product);
  const torqueBar = getTorqueBar(product.torque);
  const forceBar = getForceBar(product.force);

  const stats = [
    product.durability ? { label: "耐久性", value: formatCycles(product.durability.cycles) } : null,
    product.hardTorque ? { label: "硬扭矩", value: product.hardTorque.replace("gf.cm", "gf·cm") } : null,
    product.hardForce ? { label: "按压力", value: `${product.hardForce} N` } : null,
    product.soundType ? { label: "声音", value: product.soundType } : null,
    product.bufferDirection ? { label: "阻尼方向", value: product.bufferDirection } : null,
    product.assemblyMethod ? { label: "安装方式", value: product.assemblyMethod } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  const canonical = LIVE_ORIGIN + encodeURI(product.path);
  const additionalProperty = [
    product.torque ? { "@type": "PropertyValue", name: "可调扭矩", value: formatRange(product.torque) } : null,
    product.force ? { "@type": "PropertyValue", name: "操作力", value: formatRange(product.force) } : null,
    product.hardTorque ? { "@type": "PropertyValue", name: "硬扭矩", value: product.hardTorque } : null,
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
      <div className={container}>
        <nav aria-label="面包屑" className="flex flex-wrap items-center gap-2 py-5 text-xs text-muted">
          <Link href="/" className="hover:text-brand-700">首页</Link>
          <span className="text-line">/</span>
          <Link href="/products/" className="hover:text-brand-700">产品</Link>
          <span className="text-line">/</span>
          <Link href={category.path} className="hover:text-brand-700">{category.label}</Link>
          <span className="text-line">/</span>
          <span aria-current="page" className="text-ink">{product.model}</span>
        </nav>
      </div>

      <section className={`${container} pb-12`}>
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} altBase={product.model} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{category.label}</p>
            <span className="mt-3 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{product.model}</span>
            <h1 className="mt-3 text-[clamp(28px,3.6vw,42px)] font-black leading-[1.05] tracking-[-0.03em] text-ink">
              {product.name}
            </h1>
            <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-muted">{product.summary}</p>

            {product.characteristics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.characteristics.map(item => (
                  <span key={item} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft">{item}</span>
                ))}
              </div>
            )}

            {(torqueBar || forceBar) && (
              <div className="mt-6 max-w-[480px] rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-50/70 to-brand-50 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted-light">
                    {torqueBar ? <Gauge size={13} className="text-brand-500" /> : <Wrench size={13} className="text-brand-500" />}
                    {torqueBar ? "可调扭矩" : "操作力"}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-ink">
                    {product.torque ? formatRange(product.torque) : product.force ? formatRange(product.force) : ""}
                  </span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-white shadow-inner ring-1 ring-brand-500/20">
                  <div
                    className="absolute inset-y-1 rounded-full bg-brand-500 shadow-[0_0_12px_rgba(232,120,26,0.35)]"
                    style={{
                      left: `${(torqueBar ?? forceBar)!.start}%`,
                      width: `${(torqueBar ?? forceBar)!.width}%`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[9px] text-muted-light">
                  <span>0</span>
                  <span>{(torqueBar ?? forceBar)!.scaleMax} {(product.torque ?? product.force)!.unit}</span>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contacts/" className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] transition-all hover:-translate-y-0.5 hover:bg-brand-700">
                获取报价 →
              </Link>
              <a href="tel:076982937929" className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-7 py-3.5 text-sm font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700">
                电话咨询
              </a>
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-y border-line bg-white">
          <div className={`${container} grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-6`}>
            {stats.map(item => (
              <div key={item.label} className="rounded-xl border border-line bg-surface px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-light">{item.label}</p>
                <p className="mt-1 text-sm font-bold text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {product.dimensionDrawing && (
        <section className={`${container} py-12`}>
          <div className="grid items-center gap-6 rounded-2xl border border-line bg-surface p-5 lg:grid-cols-[240px_1fr] lg:p-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-light">Drawing</p>
              <h2 className="mt-2 text-xl font-extrabold text-ink">尺寸图</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">点击图片可全屏查看,便于核对安装空间。</p>
            </div>
            <DimensionDrawing src={product.dimensionDrawing} alt={`${product.model} 尺寸图`} />
          </div>
        </section>
      )}

      <section className={`${container} pb-12`}>
        <div className={`grid gap-6 ${product.materials.length > 0 ? "lg:grid-cols-2" : ""}`}>
          {product.specifications.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-5 lg:p-6">
              <h2 className="mb-4 text-xl font-extrabold text-ink">技术规格</h2>
              <table className="w-full text-left text-sm">
                <tbody>
                  {product.specifications.map(spec => (
                    <tr key={spec.label} className="border-t border-line-soft first:border-t-0">
                      <th scope="row" className="w-32 py-2.5 pr-4 font-medium text-muted">{spec.label}</th>
                      <td className="py-2.5 font-semibold text-ink">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.materials.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-5 lg:p-6">
              <h2 className="mb-4 text-xl font-extrabold text-ink">材料清单</h2>
              <table className="w-full text-left text-sm">
                <tbody>
                  {product.materials.map(item => (
                    <tr key={item.part} className="border-t border-line-soft first:border-t-0">
                      <th scope="row" className="w-32 py-2.5 pr-4 font-medium text-muted">{item.part}</th>
                      <td className="py-2.5 font-semibold text-ink">{item.material}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {product.variants && (
        <section className={`${container} pb-12`}>
          <h2 className="mb-4 text-xl font-extrabold text-ink">型号对比</h2>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-ink text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">参数</th>
                  {product.variants.variants.map(model => (
                    <th key={model} scope="col" className="px-4 py-3 font-bold">{model}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.variants.rows.map(row => {
                  const uniform = row.values.every(value => value === row.values[0]);
                  return (
                    <tr key={row.param} className={`border-t border-line-soft ${uniform ? "text-muted-light" : "text-ink"}`}>
                      <th scope="row" className="px-4 py-2.5 font-medium">{row.param}</th>
                      {row.values.map((value, index) => (
                        <td key={`${row.param}-${index}`} className="px-4 py-2.5 tabular-nums">{value}</td>
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
        <section className="border-y border-line bg-white">
          <div className={`${container} py-12`}>
            <h2 className="mb-6 text-xl font-extrabold text-ink">性能曲线</h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {[
                { src: product.performanceCharts.rotation, label: "扭矩 - 转速曲线" },
                { src: product.performanceCharts.temperature, label: "扭矩 - 温度曲线" },
              ].filter((item): item is { src: string; label: string } => Boolean(item.src)).map(chart => (
                <figure key={chart.label} className="rounded-2xl border border-line bg-white p-4">
                  <div className="relative aspect-[2/1]">
                    <Image src={chart.src} alt={`${product.model} ${chart.label}`} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-contain" />
                  </div>
                  <figcaption className="mt-3 text-center text-xs font-semibold text-muted">{chart.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.applicationScenarios.length > 0 && (
        <section className={`${container} py-12`}>
          <h2 className="mb-6 text-xl font-extrabold text-ink">应用场景</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.applicationScenarios.map(scene => (
              <figure key={`${scene.image}-${scene.label}`} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-surface">
                  <Image src={scene.image} alt={scene.label} fill unoptimized sizes="(max-width: 768px) 100vw, 400px" className="object-contain p-2" />
                </div>
                <figcaption className="px-4 py-3 text-sm font-semibold text-ink">{scene.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className={`${container} pb-12`}>
        <h2 className="mb-5 text-xl font-extrabold text-ink">选型常见问题</h2>
        <div className="divide-y divide-line-soft rounded-2xl border border-line bg-white">
          {faq.map(item => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
                {item.question}
                <span className="shrink-0 text-brand-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${container} pb-12`}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold text-ink">相关产品</h2>
            <Link href={liveHref(category.path)} className="text-sm font-bold text-brand-700 hover:underline">查看全部 {category.label} →</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-5">
            {related.map(item => <ProductCard key={item.path} product={item} />)}
          </div>
        </section>
      )}

      <InquiryCTA />
    </>
  );
}
