import Link from "next/link";
import type { ReactNode } from "react";
import { container } from "@/components/live-site/container";
import { Reveal } from "./reveal";

interface Crumb {
  label: string;
  href?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  breadcrumb?: Crumb[];
  actions?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <section className="border-b border-line bg-surface-warm">
      <div className={`${container} pb-10 pt-12 lg:pb-14 lg:pt-16 ${centered ? "text-center" : ""}`}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="面包屑" className={`mb-6 flex flex-wrap items-center gap-2 text-micro font-semibold uppercase tracking-[0.08em] text-muted-light ${centered ? "justify-center" : ""}`}>
            {breadcrumb.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span className="text-line">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-brand-700">{crumb.label}</Link>
                ) : (
                  <span aria-current="page" className="text-ink-soft">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <Reveal>
          <span className={`inline-flex items-center gap-2 text-micro font-bold uppercase tracking-[0.14em] text-brand-700 before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500 before:content-[''] ${centered ? "justify-center" : ""}`}>
            {eyebrow}
          </span>
          <h1 className="mt-3 text-[clamp(32px,4vw,50px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {description && (
            <p className={`mt-4 max-w-[620px] text-body-lg leading-relaxed text-muted lg:text-body-lg ${centered ? "mx-auto" : ""}`}>
              {description}
            </p>
          )}
        </Reveal>

        {actions && <div className={`mt-7 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>{actions}</div>}
      </div>
    </section>
  );
}
