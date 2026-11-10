import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ProductGrid } from "@/components/home/product-grid";
import { ApplicationSection } from "@/components/home/application-section";
import { CapabilitySection } from "@/components/home/capability-section";
import { QualitySection } from "@/components/home/quality-section";
import { PartnerSection } from "@/components/home/partner-section";
import { NewsStrip } from "@/components/home/news-strip";
import { CTASection } from "@/components/home/cta-section";
import { contact } from "@/content/live-site/contact";

export const metadata: Metadata = {
  title: { absolute: "特澳 TEAO — 阻尼器与锁扣机构定制厂家" },
  description:
    "特澳 TEAO 专注阻尼器、齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制缓冲机构。IATF 16949 认证，20+ 年制造经验，支持来图定制。",
  alternates: { canonical: "https://www.chinateao.com/" },
  openGraph: {
    title: "特澳 TEAO — 阻尼器与锁扣机构定制厂家",
    description:
      "IATF 16949 认证，20+ 年制造经验，专注阻尼器与锁扣机构，覆盖汽车、家电、卫浴、医疗、工业等领域。",
    url: "https://www.chinateao.com/",
    siteName: "特澳 TEAO",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/images/og/home.png", width: 1200, height: 630, alt: "特澳 TEAO — 阻尼器与锁扣定制源头厂家" }],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "东莞市特澳电子科技有限公司",
    alternateName: "特澳 TEAO",
    url: "https://www.chinateao.com/",
    logo: "https://www.chinateao.com/images/logo-color.webp",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "广东省",
      addressLocality: "东莞市",
      streetAddress: "黄江镇黄江北三街2号",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: contact.primaryName,
        telephone: contact.primaryMobile,
        email: contact.email,
        areaServed: "CN",
        availableLanguage: ["zh-CN"],
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "特澳 TEAO",
    url: "https://www.chinateao.com/",
    inLanguage: "zh-CN",
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd[0]) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd[1]) }} />
      <HeroSection />
      <StatsBar />
      <Suspense fallback={<div className="py-20 text-center text-muted">加载中...</div>}>
        <ProductGrid />
      </Suspense>
      <ApplicationSection />
      <CapabilitySection />
      <QualitySection />
      <PartnerSection />
      <NewsStrip />
      <CTASection />
    </>
  );
}
