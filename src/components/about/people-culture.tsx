"use client";

import Image from "next/image";
import { GraduationCap, HeartPulse, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { peopleCulture } from "@/content/about";
import { AboutHead } from "./about-head";

const cultureIcons = [GraduationCap, HeartPulse, ShieldCheck];

export function PeopleCulture() {
  const cultureImages = [
    { src: peopleCulture.images.office, alt: "特澳办公室团队合影" },
    { src: peopleCulture.images.employeeWork, alt: "特澳团队互动" },
    { src: peopleCulture.images.training, alt: "特澳员工培训" },
    { src: peopleCulture.images.building, alt: "特澳团建活动" },
  ];

  return (
    <section className="relative overflow-hidden bg-surface-warm py-16 lg:py-20">
      {/* Decorative ring */}
      <div className="pointer-events-none absolute left-[-80px] top-[-140px] h-[320px] w-[320px] rounded-full border border-brand-500/10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-11">
          {/* Left: text */}
        <AboutHead eyebrow={peopleCulture.eyebrow} title={peopleCulture.title} description={peopleCulture.description} />

          {/* Right: image grid */}
          <Reveal delay={1}>
            <div className="relative mx-auto max-w-[680px]">
              {/* Decorative dashed outline behind */}
              <div className="absolute -left-4 top-8 hidden h-[78%] w-[58%] rounded-2xl border border-brand-500/12 bg-white/40 lg:block" />

              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
                {cultureImages.map((image, index) => (
                  <figure
                    key={image.src}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_30px_rgba(30,30,32,0.05)] ${
                      index === 1 || index === 3 ? "translate-y-4" : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                      loading="lazy"
                      draggable={false}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Culture highlights */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-8">
          {peopleCulture.highlights.map((item, index) => {
            const Icon = cultureIcons[index];
            return (
              <Reveal key={item.name} delay={Math.min(index + 2, 5) as 1 | 2 | 3 | 4 | 5} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
                  <Icon className="h-6 w-6 text-brand-500" strokeWidth={1.7} />
                  <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-body leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
