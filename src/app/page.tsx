import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ProductGrid } from "@/components/home/product-grid";
import { ApplicationSection } from "@/components/home/application-section";
import { CapabilitySection } from "@/components/home/capability-section";
import { QualitySection } from "@/components/home/quality-section";
import { PartnerSection } from "@/components/home/partner-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <Suspense fallback={<div className="py-20 text-center text-muted">加载中...</div>}>
        <ProductGrid />
      </Suspense>
      <ApplicationSection />
      <CapabilitySection />
      <QualitySection />
      <PartnerSection />
      <CTASection />
    </>
  );
}
