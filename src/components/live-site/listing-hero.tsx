import Link from "next/link";
import { container } from "./container";

export default function ListingHero({ title, description, crumb }: { title: string; description?: string; crumb?: string }) {
  return (
    <section className="pb-8 pt-10 lg:pb-12 lg:pt-14">
      <div className={container}>
        <nav aria-label="面包屑" className="flex flex-wrap items-center gap-2 text-body text-muted">
          <Link href="/" className="transition-colors hover:text-brand-700">首页</Link>
          <span className="text-line">/</span>
          <Link href="/products/" className="transition-colors hover:text-brand-700">产品</Link>
          {crumb && (
            <>
              <span className="text-line">/</span>
              <span className="text-ink">{crumb}</span>
            </>
          )}
        </nav>
        <h1 className="mt-5 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">{title}</h1>
        {description && <p className="mt-4 max-w-[640px] text-body-lg leading-relaxed text-muted">{description}</p>}
      </div>
    </section>
  );
}
