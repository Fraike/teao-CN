import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getCatalog } from "@/lib/live-catalog";
import { LIVE_ORIGIN } from "@/lib/live-site";
import { enrichProduct } from "@/lib/product-enrichment";
import { compareModel } from "@/lib/product-sort";
import { pageOpenGraph } from "@/lib/metadata";
import { container } from "@/components/live-site/catalog";
import ListingHero from "@/components/live-site/listing-hero";
import ListingTabs from "@/components/live-site/listing-tabs";
import ProductList from "@/components/live-site/product-list";
import InquiryCTA from "@/components/live-site/inquiry-cta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "产品中心",
  description: "特澳产品中心：齿轮阻尼器、圆筒阻尼器、手套箱阻尼器、锁扣和其他零部件，按分类查看型号及产品资料。",
  alternates: { canonical: LIVE_ORIGIN + "/products/" },
  openGraph: pageOpenGraph({
    title: "产品中心 | 阻尼器与锁扣型号",
    description: "按分类查看齿轮阻尼器、圆筒阻尼器、手套箱阻尼器、锁扣与定制零部件。",
    path: "/products/",
  }),
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const categories = await getCatalog();
  const categoryPath = typeof query.category === "string"
    ? categories.find(category => category.id === query.category)?.pages[0]?.path ?? null
    : null;
  if (categoryPath) permanentRedirect(encodeURI(categoryPath));

  const products = categories
    .flatMap(category =>
      category.pages.flatMap(page => page.products.map(product => enrichProduct(category.id, product)))
    )
    .sort((a, b) => compareModel(a.model, b.model));

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "产品中心",
    description: "特澳阻尼器、锁扣与配套零部件产品目录。",
    url: LIVE_ORIGIN + "/products/",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.model,
          description: product.title,
          url: LIVE_ORIGIN + encodeURI(product.path),
        },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      <ListingHero
        title="产品中心"
        description="按产品类别查看型号与应用资料，选择适合您机构的阻尼器、锁扣及配套零部件。"
      />
      <ListingTabs categories={categories} />
      <div className={`${container} pb-12 pt-8`}>
        <ProductList products={products} pageSize={10} searchable />
      </div>
      <InquiryCTA />
    </>
  );
}
