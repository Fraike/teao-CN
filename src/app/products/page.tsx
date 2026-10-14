import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { liveCatalog } from "@/lib/live-catalog";
import { developmentCategoryPath, LIVE_ORIGIN } from "@/lib/live-site";
import { CategoryNav, container, ProductCards } from "@/components/live-site/catalog";

export const metadata: Metadata = {
  title: "产品中心",
  description: "特澳产品中心：齿轮阻尼器、圆筒阻尼器、手套箱阻尼器、锁扣和其他零部件，按分类查看型号及产品资料。",
  alternates: { canonical: LIVE_ORIGIN + "/products/" },
  robots: { index: false, follow: true },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const categoryPath = typeof query.category === "string" ? developmentCategoryPath(query.category) : null;
  if (categoryPath) permanentRedirect(encodeURI(categoryPath));
  const products = liveCatalog.flatMap(category => category.pages.flatMap(page => page.products));
  return <>
    <section className="border-b border-line bg-white"><div className={`${container} py-12`}>
      <h1 className="text-3xl font-bold">产品中心</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-muted">按产品类别查看型号与应用资料，选择适合您机构的阻尼器、锁扣及配套零部件。</p>
      <div className="mt-7"><CategoryNav active="" /></div>
    </div></section>
    <section className={`${container} py-12`}><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-bold">产品型号</h2><p className="text-sm text-muted">共 {products.length} 款</p></div><ProductCards items={products} /></section>
  </>;
}
