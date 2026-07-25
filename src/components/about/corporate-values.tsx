"use client";

import { BookOpen, HeartHandshake, Leaf, Building2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { corporateValues } from "@/content/about";

const icons = [BookOpen, HeartHandshake, Leaf, Building2];

export function CorporateValues() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[0.78fr_1fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                企业社会责任
              </span>
              <h2 className="mt-2.5 text-[26px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] lg:text-[38px]">
                做有温度的企业
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted lg:text-[17px]">
              企业的价值不仅在于产品，更在于对员工、社区和环境的责任。我们相信负责任的企业成长意味着为所有人创造价值。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corporateValues.map((value, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={value.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                  <Icon className="mb-5 h-7 w-7 text-brand-500" strokeWidth={1.5} />
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-ink">{value.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
