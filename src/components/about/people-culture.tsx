"use client";

import Image from "next/image";
import { GraduationCap, HeartPulse, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { peopleCulture } from "@/content/about";

const cultureIcons = [GraduationCap, HeartPulse, ShieldCheck];

export function PeopleCulture() {
  const cultureImages = [
    { src: peopleCulture.images.office, alt: "特澳办公室团队合影" },
    { src: peopleCulture.images.employeeWork, alt: "特澳团队互动" },
    { src: peopleCulture.images.training, alt: "特澳员工培训" },
    { src: peopleCulture.images.building, alt: "特澳团建活动" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-12 lg:py-16">
      {/* Decorative ring */}
      <div className="pointer-events-none absolute left-[-80px] top-[-140px] h-[320px] w-[320px] rounded-full border border-brand-500/10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-11">
          {/* Left: text */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                {peopleCulture.eyebrow}
              </span>
              <h2 className="mt-2.5 text-[26px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] lg:text-[38px]">
                {peopleCulture.title}
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-muted lg:text-[17px]">
                {peopleCulture.description}
              </p>
            </div>
          </Reveal>

          {/* Right: image grid */}
          <Reveal delay={1}>
            <div className="relative mx-auto max-w-[680px]">
              {/* Decorative dashed outline behind */}
              <div className="absolute -left-4 top-8 hidden h-[78%] w-[58%] rounded-2xl border border-brand-500/12 bg-white/40 lg:block" />

              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
                {cultureImages.map((image, index) => (
                  <figure
                    key={image.src}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_30px_rgba(15,23,42,0.055)] ${
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
              <Reveal key={item.name} delay={Math.min(index + 2, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="h-full rounded-xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                  <Icon className="h-6 w-6 text-brand-500" strokeWidth={1.7} />
                  <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.02em] text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
