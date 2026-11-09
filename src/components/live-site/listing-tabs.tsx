import Link from "next/link";
import { liveCategories, liveHref } from "@/lib/live-site";
import { container } from "./container";

export default function ListingTabs({ active }: { active?: string }) {
  const pill = (isActive: boolean) =>
    `shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors ${
      isActive
        ? "bg-brand-500 text-white"
        : "border border-line bg-white text-muted hover:border-brand-500 hover:text-brand-700"
    }`;

  return (
    <div className={container}>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/products/" className={pill(!active)}>全部产品</Link>
        {liveCategories.map(category => (
          <Link key={category.path} href={liveHref(category.path)} className={pill(active === category.path)}>
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
