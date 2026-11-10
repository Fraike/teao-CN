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
import { contact } from "@/content/live-site/contact";

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "关于特澳 | 20+ 年阻尼器定制厂家",
    description: "特澳 TEAO 成立于 2001 年,专注阻尼器与锁扣机构研发制造,IATF 16949 认证,8000 万件年产能。",
    url: "https://www.chinateao.com/about-us/",
    mainEntity: {
      "@type": "Organization",
      name: "东莞市特澳电子科技有限公司",
      alternateName: "特澳 TEAO",
      url: "https://www.chinateao.com/",
      logo: "https://www.chinateao.com/images/logo-color.webp",
      foundingDate: "2001",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CN",
        addressRegion: "广东省",
        addressLocality: "东莞市",
        streetAddress: "黄江镇黄江北三街2号",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        name: contact.primaryName,
        telephone: contact.primaryMobile,
        email: contact.email,
        areaServed: "CN",
        availableLanguage: ["zh-CN"],
      },
    },
  },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd[0]) }} />
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
