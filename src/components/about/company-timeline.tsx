"use client";

import { Reveal } from "@/components/ui/reveal";
import { timeline } from "@/content/about";
import { AboutHead } from "./about-head";

export function CompanyTimeline() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-12">
          {/* Left: section head */}
        <AboutHead eyebrow="发展历程" title={<>每一步<br />都算数</>} description="从深圳创业到东莞新厂,20+ 年来我们始终专注阻尼器一件事。" />

          {/* Right: timeline cards */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5} className="h-full">
                <div className="group relative cursor-default rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-brand-50 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  {/* Top accent bar */}
                  <div className="mb-2 h-1 w-8 rounded-full bg-line transition-all duration-300 group-hover:w-12 group-hover:bg-brand-500" />

                  <b className="block text-xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-600">
                    {item.year}
                  </b>
                  <h3 className="mt-1.5 text-body font-semibold leading-tight text-ink-soft">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-caption leading-relaxed text-muted">
                    {item.description}
                  </p>

                  {/* Connector dot */}
                  <div className="absolute -top-[7px] right-4 h-3 w-3 rounded-full border-2 border-line bg-white transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:scale-110" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
