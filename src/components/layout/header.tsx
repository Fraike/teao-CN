"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { liveCatalog } from "@/lib/live-catalog";
import { liveHref } from "@/lib/live-site";
import GlobalSearch from "./global-search";

const navItems = [
  { label: "首页", href: "/" },
  { label: "产品中心", href: "/products/", mega: true },
  { label: "应用领域", href: liveHref("/applications/") },
  { label: "质量认证", href: "/quality-control/" },
  { label: "新闻", href: "/news/" },
  { label: "关于我们", href: "/about-us/" },
  { label: "联系我们", href: "/contacts/" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
        <nav
          className={`flex h-[73px] items-center justify-between px-5 lg:px-8 transition-all duration-300 ${
            scrolled
              ? "border-b border-line bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,.04)] backdrop-blur-xl"
              : "border-b border-transparent bg-white/70 backdrop-blur-lg"
          }`}
        >
          {/* Brand */}
          <Link href="/" aria-label="特澳 TEAO 首页" className="relative block h-9 w-[96px] shrink-0">
            <Image
              src="/images/logo-color.webp"
              alt="TEAO 特澳"
              fill
              priority
              sizes="96px"
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 text-body-lg font-semibold text-ink-soft lg:flex">
            {navItems.map((item) =>
              item.mega ? (
                <div key={item.label} className="group relative flex min-h-[73px] items-center">
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-1 after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-300 group-hover:after:scale-x-100 hover:text-brand-500 transition-colors"
                  >
                    {item.label}
                    <ChevronDown size={14} />
                  </Link>
                  {/* Mega menu */}
                  <div className="invisible absolute left-1/2 top-full grid w-[760px] -translate-x-1/2 translate-y-2.5 grid-cols-5 gap-2 rounded-2xl border border-line bg-white p-3 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,.08)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {liveCatalog.map((cat) => (
                      <Link
                        key={cat.id}
                        href={liveHref(cat.path)}
                        className="flex min-h-[142px] flex-col justify-between rounded-xl border border-line/60 bg-surface p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white"
                      >
                        <div className="relative h-[76px] w-full">
                          <Image
                            src={cat.image}
                            alt={cat.label}
                            fill
                            className="rounded-lg bg-white object-contain p-1.5"
                            sizes="140px"
                          />
                        </div>
                        <strong className="mt-3 text-xs leading-tight text-ink">{cat.label}</strong>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:text-brand-500 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <GlobalSearch />
            <a
              href="https://teao-damper.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问英文国际站"
              title="英文国际站"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-caption font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700 lg:h-[38px]"
            >
              <Globe size={14} />
              EN
            </a>
            <Link
              href="/convert/"
              className="hidden h-9 items-center rounded-full border border-line bg-white px-4 text-body font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700 sm:inline-flex lg:h-[38px]"
            >
              扭矩换算
            </Link>
            <Link
              href="/contacts/"
              className="inline-flex h-9 items-center rounded-full bg-brand-500 px-3.5 text-body font-bold text-white lg:px-4 shadow-[0_8px_20px_rgba(232,120,26,.2)] transition-all duration-300 hover:bg-brand-700 lg:h-[38px]"
            >
              获取报价
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-1 p-1.5 text-ink-soft lg:hidden"
              aria-label="切换菜单"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-white/95 pt-24 backdrop-blur-xl">
          <div className="flex flex-col gap-2 px-6 pb-10">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-line py-3 text-lg font-semibold text-ink"
                >
                  {item.label}
                </Link>
                {item.mega && (
                  <div className="grid grid-cols-2 gap-2 py-3">
                    {liveCatalog.map((cat) => (
                      <Link
                        key={cat.id}
                        href={liveHref(cat.path)}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg border border-line px-3 py-2 text-body text-muted transition-colors hover:border-brand-500/40 hover:text-brand-700"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/convert/"
              onClick={() => setMobileOpen(false)}
              className="mt-4 rounded-full border border-line py-3 text-center text-body font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              扭矩换算
            </Link>
            <a
              href="https://teao-damper.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line py-3 text-center text-body font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              English 国际站
            </a>
            <Link
              href="/contacts/"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-brand-500 py-3 text-center text-body font-bold text-white"
            >
              获取报价
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
