import { Reveal } from "./reveal";
import type { ReactNode } from "react";

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
}

const titleSizes = {
  md: "text-[clamp(26px,3vw,36px)]",
  lg: "text-[clamp(30px,3.6vw,44px)]",
};

export function SectionHead({ eyebrow, title, description, align = "left", size = "md" }: SectionHeadProps) {
  const centered = align === "center";
  return (
    <div className={`mb-10 ${centered ? "mx-auto max-w-2xl text-center" : "max-w-[680px]"}`}>
      <Reveal>
        <p className="mb-2 inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-700
          before:content-[''] before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500">
          {eyebrow}
        </p>
        <h2 className={`font-black leading-[1.1] tracking-[-0.03em] text-ink ${titleSizes[size]}`}>{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={1}>
          <p className={`mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted ${centered ? "mx-auto" : ""}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
