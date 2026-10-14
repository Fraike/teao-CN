import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/live-site/catalog";
import ProductDetail from "@/components/live-site/product-detail";
import QualityPage from "@/components/live-site/quality-page";
import FaqPage from "@/components/live-site/faq-page";
import { getPilotPage, LIVE_ORIGIN, PILOT_PRODUCT_PATH, QUALITY_PATH, FAQ_PATH } from "@/lib/live-site";
import { getCategoryRoute } from "@/lib/live-catalog";

const QUALITY_META: Metadata = {
  title: { absolute: "质量控制 | IATF 16949 认证 · 100% 扭矩检测 | 特澳 TEAO" },
  description: "IATF 16949 认证质量管理体系,100% 扭矩检测与 100% 外观检测。实验室支持扭矩、寿命、尺寸与环境验证,提供 PPAP 与扭矩测试报告。",
  alternates: { canonical: LIVE_ORIGIN + QUALITY_PATH },
  robots: { index: false, follow: true },
};

const FAQ_META: Metadata = {
  title: { absolute: "常见问题 | 阻尼器定制与选型 FAQ | 特澳 TEAO" },
  description: "关于特澳阻尼器定制、扭矩选型、打样、交期、质量认证与询盘的常见问题解答。",
  alternates: { canonical: LIVE_ORIGIN + FAQ_PATH },
  robots: { index: false, follow: true },
};

type Props = { params: Promise<{ legacyPath: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).legacyPath;
  const type = getPilotPage(segments);
  if (!type) notFound();
  if (type === "quality") return QUALITY_META;
  if (type === "faq") return FAQ_META;
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
  if (type === "quality") return <QualityPage />;
  if (type === "faq") return <FaqPage />;
  const route = getCategoryRoute(segments);
  if (route) return <CategoryPage category={route.category} page={route.page} />;
  if (type === "product") return <ProductDetail />;
  notFound();
}
