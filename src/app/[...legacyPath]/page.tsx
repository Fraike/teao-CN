import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/live-site/catalog";
import ProductDetail from "@/components/live-site/product-detail";
import { getPilotPage, LIVE_ORIGIN, PILOT_PRODUCT_PATH } from "@/lib/live-site";
import { getCategoryRoute } from "@/lib/live-catalog";

type Props = { params: Promise<{ legacyPath: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).legacyPath;
  const type = getPilotPage(segments);
  if (!type) notFound();
  const product = type === "product";
  const categoryRoute = getCategoryRoute(segments);
  return {
    title: { absolute: product ? "RD-T038 / RD-V038 双向齿轮阻尼器 | 特澳 TEAO" : `${categoryRoute!.category.label}产品与选型${categoryRoute!.page.number > 1 ? ` - 第 ${categoryRoute!.page.number} 页` : ""} | 特澳 TEAO` },
    description: product ? "RD-T038 / RD-V038 双向齿轮阻尼器，螺钉安装，无角度限制。查看产品实拍、材质、阻尼测试及性能曲线，联系特澳获取选型建议。" : categoryRoute!.category.description,
    alternates: { canonical: LIVE_ORIGIN + encodeURI(product ? PILOT_PRODUCT_PATH : categoryRoute!.page.path) },
    // These are review samples; remove only after content verification and release review.
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPage({ params }: Props) {
  const segments = (await params).legacyPath;
  const type = getPilotPage(segments);
  const route = getCategoryRoute(segments);
  if (route) return <CategoryPage category={route.category} page={route.page} />;
  if (type === "product") return <ProductDetail />;
  notFound();
}
