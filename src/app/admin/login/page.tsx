"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "登录失败");
      }
      router.replace("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  const field = "h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition-all placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10";

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="relative mx-auto mb-8 h-10 w-[106px]">
          <Image src="/images/logo-color.webp" alt="TEAO 特澳" fill sizes="106px" className="object-contain" priority />
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-7 shadow-[0_20px_50px_rgba(30,30,32,0.08)]">
          <h1 className="text-xl font-black text-ink">后台登录</h1>
          <p className="mt-1 text-sm text-muted">使用管理员账号登录,管理新闻内容。</p>

          <label className="mt-6 block text-[13px] font-bold text-ink" htmlFor="username">账号</label>
          <input id="username" className={`${field} mt-1.5`} value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />

          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="password">密码</label>
          <input id="password" type="password" className={`${field} mt-1.5`} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
