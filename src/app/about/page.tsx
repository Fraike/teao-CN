import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { BusinessStats } from "@/components/about/business-stats";
import { CoreCapabilities } from "@/components/about/core-capabilities";
import { CertificationsSection } from "@/components/about/certifications-section";
import { QualityPromise } from "@/components/about/quality-promise";
import { ServiceIndustries } from "@/components/about/service-industries";
import { CorporateValues } from "@/components/about/corporate-values";
import { PeopleCulture } from "@/components/about/people-culture";
import { AboutCTA } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "关于特澳 | 20+年阻尼器定制厂家",
  description:
    "特澳 TEAO 成立于 2001 年，专注阻尼器与锁扣机构研发制造 20 余年。IATF 16949 认证，8000 万件年产能，模具·注塑·装配·检测一体化源头工厂。",
  keywords: [
    "特澳",
    "TEAO",
    "阻尼器厂家",
    "阻尼器",
    "齿轮阻尼器厂家",
    "阻尼器制造商",
    "阻尼器定制",
    "IATF 16949",
    "源头工厂",
    "锁扣厂家",
  ],
  openGraph: {
    title: "关于特澳 | 20+年阻尼器定制厂家",
    description:
      "IATF 16949 认证源头工厂，模具·注塑·装配·检测一体化，8000 万件年产能。",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BusinessStats />
      <CoreCapabilities />
      <CompanyTimeline />
      <CertificationsSection />
      <QualityPromise />
      <ServiceIndustries />
      <CorporateValues />
      <PeopleCulture />
      <AboutCTA />
    </>
  );
}
