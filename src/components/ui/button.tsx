import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href: string;
  className?: string;
}

const base = "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-7 py-3.5 text-body font-semibold transition-all duration-300";

const variants = {
  primary: "bg-brand-500 text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)]",
  outline: "border border-line bg-white text-ink-soft shadow-sm hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700",
};

export function Button({ children, variant = "primary", href, className = "" }: ButtonProps) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}
