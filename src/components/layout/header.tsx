"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "首页", href: "/" },
  {
    label: "产品中心",
    href: "/products",
    children: [
      { label: "齿轮阻尼器", href: "/products/gear-damper" },
      { label: "轴向阻尼器", href: "/products/axial-damper" },
      { label: "手套箱阻尼器", href: "/products/glove-box-damper" },
      { label: "Push-Push 锁扣", href: "/products/latch" },
      { label: "定制零部件", href: "/products/custom" },
    ],
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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-shadow duration-300 ${
        scrolled
          ? "border-line bg-white/95 shadow-md backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/logo-color.webp"
            alt="TEAO 特澳"
            width={42}
            height={42}
            priority
            className="rounded"
          />
          <span className="text-base font-black tracking-[0.12em] text-brand-500">
            TEAO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() =>
                item.children && setOpenDropdown(item.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  item.children
                    ? "text-ink-soft hover:text-brand-500"
                    : "text-ink-soft hover:text-brand-500"
                }`}
              >
                {item.label}
                {item.children && (
                  <svg
                    className={`mt-px h-3 w-3 transition-transform duration-200 ${
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
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
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
          className="inline-flex shrink-0 items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          获取报价
        </Link>
      </div>
    </header>
  );
}
