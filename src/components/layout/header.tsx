"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { liveCategories } from "@/lib/live-site";

const navItems = [
  { label: "首页", href: "/" },
  {
    label: "产品中心",
    href: "/products/",
    children: liveCategories.map(category => ({ label: category.label, href: category.path })),
  },
  { label: "应用领域", href: "/applications" },
  { label: "制造实力", href: "/#factory" },
  { label: "质量认证", href: "/#quality" },
  { label: "关于我们", href: "/about" },
  { label: "联系我们", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const frame = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-shadow duration-300 ${
        scrolled
          ? "border-line bg-white/95 shadow-md backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/logo-color.webp"
            alt="TEAO 特澳"
            width={52}
            height={52}
            priority
            className="rounded"
          />
          <span className="text-lg font-black tracking-[0.12em] text-brand-500">
            TEAO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="主导航" className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
              onFocus={() => item.children && setOpenDropdown(item.label)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null);
              }}
            >
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-[15px] font-semibold text-ink-soft transition-colors hover:text-brand-500"
              >
                {item.label}
                {item.children && (
                  <svg
                    className={`mt-px h-3.5 w-3.5 transition-transform duration-200 ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Link>

              {/* Dropdown */}
              {item.children && openDropdown === item.label && (
                <div className="absolute left-1/2 top-full pt-2 -translate-x-1/2">
                  <div className="min-w-[180px] rounded-xl border border-line bg-white p-1.5 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block rounded-lg px-4 py-2.5 text-[15px] font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center rounded-full bg-brand-500 px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-700"
        >
          获取报价
        </Link>
        <details className="relative xl:hidden">
          <summary className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-semibold">菜单</summary>
          <nav onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open");
          }} aria-label="手机导航" className="absolute right-0 top-14 max-h-[75vh] w-[min(300px,calc(100vw-40px))] overflow-y-auto rounded-xl border border-line bg-white p-4 shadow-lg">
            {navItems.map(item => <div key={item.href} className="border-b border-line-soft py-2 last:border-0">
              <Link href={item.href} className="block px-2 py-2 font-semibold">{item.label}</Link>
              {item.children && <div className="ml-3 border-l border-line pl-3">{item.children.map(child => <Link key={child.href} href={child.href} className="block py-2 text-sm text-muted hover:text-brand-700">{child.label}</Link>)}</div>}
            </div>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
