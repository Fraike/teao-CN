"use client";

import { BookOpen, HeartHandshake, Leaf, Building2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { corporateValues } from "@/content/about";
import { AboutHead } from "./about-head";

const icons = [BookOpen, HeartHandshake, Leaf, Building2];

export function CorporateValues() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <AboutHead
          eyebrow="企业社会责任"
          title="做有温度的企业"
          description="企业的价值不仅在于产品,更在于对员工、社区和环境的责任。我们相信负责任的企业成长意味着为所有人创造价值。"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corporateValues.map((value, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={value.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.08)]">
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
