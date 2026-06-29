import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href: string;
  className?: string;
}

const base = "inline-flex items-center justify-center gap-1.5 px-7 py-3.5 text-sm font-bold rounded-lg transition-all duration-250 cursor-pointer";

const variants = {
  primary: "bg-brand-500 text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)]",
  outline: "bg-white text-ink-soft border-1.5 border-line shadow-sm hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50",
};

export function Button({ children, variant = "primary", href, className = "" }: ButtonProps) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}
