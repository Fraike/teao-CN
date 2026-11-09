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
