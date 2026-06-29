import { Reveal } from "./reveal";
import type { ReactNode } from "react";

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}

export function SectionHead({ eyebrow, title, description }: SectionHeadProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-11">
      <Reveal>
        <p className="text-[11.5px] font-bold text-brand-700 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
          before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
          {eyebrow}
        </p>
        <h2 className="text-[36px] leading-tight font-bold text-ink tracking-tight">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={1}>
          <p className="max-w-[430px] text-[14px] text-muted leading-relaxed">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
