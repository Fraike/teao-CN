import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

/** 关于页统一的区块标题:橙色小标题 + 大标题 + 说明。 */
export function AboutHead({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal>
      <div className={centered ? "mx-auto mb-10 max-w-2xl text-center" : "mb-10 max-w-[640px]"}>
        <span className="inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-700 before:content-[''] before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-[clamp(26px,3vw,36px)] font-black leading-[1.1] tracking-[-0.03em] text-ink">{title}</h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
    </Reveal>
  );
}
