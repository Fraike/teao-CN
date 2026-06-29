import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ProductGrid } from "@/components/home/product-grid";
import { ApplicationSection } from "@/components/home/application-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <Suspense fallback={
        <section className="section bg-white py-20">
          <div className="mx-auto w-[min(1240px,calc(100%-48px))] text-center text-muted">
            加载产品分类中...
          </div>
        </section>
      }>
        <ProductGrid />
      </Suspense>
      <ApplicationSection />
    </>
  );
}
