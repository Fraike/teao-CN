import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/live-site/catalog";
import ProductDetail from "@/components/live-site/product-detail";
import QualityPage from "@/components/live-site/quality-page";
import FaqPage from "@/components/live-site/faq-page";
import ApplicationsPage from "@/components/live-site/applications-page";
import AutomotiveOverviewPage from "@/components/live-site/automotive-overview-page";
import ApplicationScenesPage from "@/components/live-site/application-scenes-page";
import SimpleApplicationPage from "@/components/live-site/simple-application-page";
import AboutPage from "@/components/live-site/about-page";
import ContactPage from "@/components/live-site/contact-page";
import NewsPage from "@/components/live-site/news-page";
import NewsArticlePage from "@/components/live-site/news-article-page";
import ConvertPage from "@/components/live-site/convert-page";
import { getPilotPage, getNewsSlug, legacyPathFromSegments, LIVE_ORIGIN, QUALITY_PATH, FAQ_PATH, APPLICATIONS_PATH, AUTOMOTIVE_INTERIOR_PATH, INTERIOR_PATH, EXTERIOR_PATH, HOME_LIFE_PATH, OFFICE_EQUIPMENT_PATH, INDUSTRIAL_APPLICATION_PATH, ABOUT_PATH, CONTACTS_PATH, NEWS_PATH, CONVERT_PATH } from "@/lib/live-site";
import { getCategoryRoute, liveCatalog } from "@/lib/live-catalog";
import { getProductContent } from "@/lib/product-content";
import { automotiveInteriorScenes, automotiveExteriorScenes, automotiveInteriorMap, automotiveExteriorMap, simpleApplications } from "@/content/live-site/applications";
import { newsArticles } from "@/content/live-site/news";

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

const noindex = { index: false, follow: true } as const;
const canon = (p: string): Metadata["alternates"] => ({ canonical: LIVE_ORIGIN + p });

const APPLICATIONS_META: Metadata = {
  title: { absolute: "应用案例 | 阻尼器应用场景 | 特澳 TEAO" },
  description: "特澳阻尼器应用案例:汽车内外饰、家居、办公设备与工业设备。齿轮阻尼器、轴向阻尼器、锁扣与定制模块的典型应用。",
  alternates: canon(APPLICATIONS_PATH), robots: noindex,
};
const AUTOMOTIVE_INTERIOR_META: Metadata = {
  title: { absolute: "汽车内外饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车内饰与外饰阻尼器应用:中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒、遮阳板、外门把手与充电口盖。",
  alternates: canon(AUTOMOTIVE_INTERIOR_PATH), robots: noindex,
};
const INTERIOR_META: Metadata = {
  title: { absolute: "汽车内饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车内饰阻尼器应用场景:中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的软开、缓降与回弹控制。",
  alternates: canon(INTERIOR_PATH), robots: noindex,
};
const EXTERIOR_META: Metadata = {
  title: { absolute: "汽车外饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车外饰阻尼器应用场景:平嵌式/常规外门把手与新能源汽车充电口盖的软开、软关与防撞击控制。",
  alternates: canon(EXTERIOR_PATH), robots: noindex,
};
const HOME_LIFE_META: Metadata = {
  title: { absolute: "家居阻尼器应用 | 特澳 TEAO" },
  description: "家居阻尼器应用:马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。",
  alternates: canon(HOME_LIFE_PATH), robots: noindex,
};
const OFFICE_EQUIPMENT_META: Metadata = {
  title: { absolute: "办公设备阻尼器应用 | 特澳 TEAO" },
  description: "办公设备阻尼器应用:打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。",
  alternates: canon(OFFICE_EQUIPMENT_PATH), robots: noindex,
};
const INDUSTRIAL_APPLICATION_META: Metadata = {
  title: { absolute: "工业设备阻尼器应用 | 特澳 TEAO" },
  description: "工业设备阻尼器应用:检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。",
  alternates: canon(INDUSTRIAL_APPLICATION_PATH), robots: noindex,
};

const ABOUT_META: Metadata = {
  title: { absolute: "关于特澳 | 20+年阻尼器定制厂家" },
  description: "特澳 TEAO 成立于 2001 年，专注阻尼器与锁扣机构研发制造 20 余年。IATF 16949 认证，8000 万件年产能，模具·注塑·装配·检测一体化源头工厂。",
  alternates: canon(ABOUT_PATH), robots: { index: true, follow: true },
};
const CONTACTS_META: Metadata = {
  title: { absolute: "联系我们" },
  description: "联系特澳 TEAO 销售工程团队 — 提供图纸、样品或应用场景描述，工程师将在 2 小时内响应，为您提供选型建议与报价方案。",
  alternates: canon(CONTACTS_PATH), robots: { index: true, follow: true },
};
const NEWS_META: Metadata = {
  title: { absolute: "新闻 | 特澳 TEAO" },
  description: "特澳最新动态、阻尼器工程进展、质量管理与技术资源。",
  alternates: canon(NEWS_PATH), robots: { index: true, follow: true },
};
const CONVERT_META: Metadata = {
  title: { absolute: "扭矩单位换算器 | N·m、kgf·cm、gf·cm 在线换算 | 特澳 TEAO" },
  description: "免费在线扭矩单位换算工具,支持 N·m、cN·m、mN·m、kgf·cm、kgf·m、gf·cm、lbf·in、lbf·ft、ozf·in 九种单位即时互转,适用于阻尼器扭矩选型、参数对比与运动控制设计。",
  keywords: ["扭矩换算", "扭矩单位换算", "N·m 转 kgf·cm", "gf·cm 转 mN·m", "阻尼器扭矩", "扭矩换算器"],
  alternates: canon(CONVERT_PATH),
  robots: { index: true, follow: true },
  openGraph: {
    title: "扭矩单位换算器 | 特澳 TEAO",
    description: "九种常用扭矩单位即时换算,适用于阻尼器扭矩选型与参数对比。",
    type: "website",
  },
};

function newsArticleMeta(slug: string): Metadata {
  const article = newsArticles.find(item => item.slug === slug)!;
  return {
    title: { absolute: `${article.title} | 特澳 TEAO` },
    description: article.summary,
    alternates: canon(`/news/${article.slug}.html`),
    robots: { index: true, follow: true },
    openGraph: { title: article.title, description: article.summary, type: "article", publishedTime: article.publishedAt },
  };
}

type Props = { params: Promise<{ legacyPath: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).legacyPath;
  const type = getPilotPage(segments);
  if (!type) notFound();
  if (type === "quality") return QUALITY_META;
  if (type === "faq") return FAQ_META;
  if (type === "applications") return APPLICATIONS_META;
  if (type === "automotive-interior") return AUTOMOTIVE_INTERIOR_META;
  if (type === "interior") return INTERIOR_META;
  if (type === "exterior") return EXTERIOR_META;
  if (type === "home-life") return HOME_LIFE_META;
  if (type === "office-equipment") return OFFICE_EQUIPMENT_META;
  if (type === "industrial-application") return INDUSTRIAL_APPLICATION_META;
  if (type === "about") return ABOUT_META;
  if (type === "contacts") return CONTACTS_META;
  if (type === "news") return NEWS_META;
  const newsSlug = getNewsSlug(segments);
  if (type === "news-article" && newsSlug) return newsArticleMeta(newsSlug);
  if (type === "convert") return CONVERT_META;
  if (type === "product") {
    const path = legacyPathFromSegments(segments);
    const content = getProductContent(path);
    if (!content) notFound();
    const category = liveCatalog.find(item => item.id === content.categoryId)!;
    return {
      title: { absolute: `${content.model} ${category.label} | 特澳 TEAO` },
      description: content.summary,
      alternates: { canonical: LIVE_ORIGIN + encodeURI(path) },
      // These are review samples; remove only after content verification and release review.
      robots: { index: false, follow: true },
      openGraph: {
        title: `${content.model} ${category.label}`,
        description: content.summary,
        images: content.images.slice(0, 1).map(image => ({ url: image.url })),
      },
    };
  }
  const categoryRoute = getCategoryRoute(segments);
  return {
    title: { absolute: `${categoryRoute!.category.label}产品与选型${categoryRoute!.page.number > 1 ? ` - 第 ${categoryRoute!.page.number} 页` : ""} | 特澳 TEAO` },
    description: categoryRoute!.category.description,
    alternates: { canonical: LIVE_ORIGIN + encodeURI(categoryRoute!.page.path) },
    // These are review samples; remove only after content verification and release review.
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPage({ params }: Props) {
  const segments = (await params).legacyPath;
  const type = getPilotPage(segments);
  if (type === "quality") return <QualityPage />;
  if (type === "faq") return <FaqPage />;
  if (type === "applications") return <ApplicationsPage />;
  if (type === "automotive-interior") return <AutomotiveOverviewPage />;
  if (type === "interior") return <ApplicationScenesPage eyebrow="汽车内饰" title="汽车内饰阻尼器应用" description="点击座舱图中的标记,查看中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的阻尼应用。" scenes={automotiveInteriorScenes} map={automotiveInteriorMap} />;
  if (type === "exterior") return <ApplicationScenesPage eyebrow="汽车外饰" title="汽车外饰阻尼器应用" description="点击车身图中的标记,查看外门把手与新能源汽车充电口盖的阻尼应用。" scenes={automotiveExteriorScenes} map={automotiveExteriorMap} />;
  if (type === "home-life") return <SimpleApplicationPage app={simpleApplications[0]} />;
  if (type === "office-equipment") return <SimpleApplicationPage app={simpleApplications[1]} />;
  if (type === "industrial-application") return <SimpleApplicationPage app={simpleApplications[2]} />;
  if (type === "about") return <AboutPage />;
  if (type === "contacts") return <ContactPage />;
  if (type === "news") return <NewsPage />;
  const newsSlug = getNewsSlug(segments);
  if (type === "news-article" && newsSlug) {
    const article = newsArticles.find(item => item.slug === newsSlug)!;
    return <NewsArticlePage article={article} />;
  }
  if (type === "convert") return <ConvertPage />;
  const route = getCategoryRoute(segments);
  if (route) return <CategoryPage category={route.category} page={route.page} />;
  if (type === "product") {
    const content = getProductContent(legacyPathFromSegments(segments));
    if (!content) notFound();
    const category = liveCatalog.find(item => item.id === content.categoryId)!;
    return <ProductDetail product={content} category={category} />;
  }
  notFound();
}
