"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ExternalLink,
  FolderTree,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Package,
} from "lucide-react";

const primaryItems = [
  { href: "/admin", label: "工作台", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/media", label: "媒体库", icon: Images },
  { href: "/admin/inquiries", label: "询盘管理", icon: Inbox },
  { href: "/admin/news", label: "新闻管理", icon: Newspaper },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-[73px] items-center border-b border-line px-6">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
            <Image src="/images/logo-color.webp" alt="TEAO 特澳" width={96} height={36} priority className="h-8 w-auto object-contain" />
            <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-muted">Admin</span>
          </Link>
        </div>

        <nav aria-label="后台导航" className="flex-1 px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-light">内容管理</p>
          <div className="space-y-1">
            {primaryItems.map(item => {
              const active = isActive(pathname, item.href, "exact" in item ? item.exact : undefined);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${active ? "bg-brand-500 text-white" : "bg-surface text-muted group-hover:bg-white group-hover:text-brand-700"}`}>
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
                </Link>
              );
            })}
          </div>

          <div className="my-5 border-t border-line-soft" />
          <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-light">站点</p>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-muted group-hover:bg-white group-hover:text-brand-700">
              <ExternalLink size={16} />
            </span>
            <span>查看前台</span>
            <ArrowUpRight size={13} className="ml-auto opacity-50" />
          </Link>
        </nav>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-black text-brand-700">
              {username.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink">{username}</p>
              <p className="text-[10px] font-medium text-muted">管理员</p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button type="submit" aria-label="退出登录" className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
            <Image src="/images/logo-color.webp" alt="TEAO 特澳" width={84} height={32} priority className="h-7 w-auto object-contain" />
            <span className="rounded border border-line bg-surface px-1 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="max-w-[96px] truncate text-xs font-semibold text-muted">{username}</span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" aria-label="退出登录" className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted hover:bg-surface hover:text-red-600">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="后台导航" className="flex flex-wrap gap-1 px-3 pb-3">
          {primaryItems.map(item => {
            const active = isActive(pathname, item.href, "exact" in item ? item.exact : undefined);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  active ? "bg-brand-500 text-white" : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={13} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/" target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted hover:bg-surface hover:text-ink">
            <ExternalLink size={13} /> 前台
          </Link>
        </nav>
      </header>
    </>
  );
}
