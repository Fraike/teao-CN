import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-ink text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-5 lg:px-8">
          <Link href="/admin/news" className="text-sm font-black tracking-[0.08em]">TEAO 后台</Link>
          <nav className="flex items-center gap-4 text-[13px] font-semibold text-white/70">
            <Link href="/admin/news" className="transition-colors hover:text-white">新闻管理</Link>
            <Link href="/news/" target="_blank" className="transition-colors hover:text-white">查看前台</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-[12px] text-white/60">
            <span>{session.username}</span>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="font-semibold text-white/80 transition-colors hover:text-white">退出</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
    </div>
  );
}
