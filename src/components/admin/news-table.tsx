"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface NewsRow {
  id: number;
  slug: string;
  title: string;
  categoryLabel: string;
  publishedAt: string;
  isPublished: boolean;
}

const statusOptions = [
  { key: "all", label: "全部" },
  { key: "published", label: "已发布" },
  { key: "draft", label: "草稿" },
] as const;

type Status = (typeof statusOptions)[number]["key"];

export default function NewsTable({ rows }: { rows: NewsRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(row => {
      if (status === "published" && !row.isPublished) return false;
      if (status === "draft" && row.isPublished) return false;
      if (!needle) return true;
      return row.title.toLowerCase().includes(needle) || row.slug.toLowerCase().includes(needle);
    });
  }, [rows, query, status]);

  async function remove(id: number) {
    if (!window.confirm("确定删除这篇文章吗?")) return;
    const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
    else alert("删除失败");
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {statusOptions.map(option => (
          <button
            key={option.key}
            type="button"
            onClick={() => setStatus(option.key)}
            aria-pressed={status === option.key}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              status === option.key ? "border-brand-500 bg-brand-500 text-white" : "border-line bg-white text-muted hover:border-brand-500 hover:text-brand-700"
            }`}
          >
            {option.label}
          </button>
        ))}
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="搜索标题或 slug…"
          className="ml-auto h-9 w-full max-w-[280px] rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-brand-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-[11px] font-black uppercase tracking-[0.08em] text-muted-light">
            <tr>
              <th className="px-5 py-3">标题</th>
              <th className="px-5 py-3">分类</th>
              <th className="px-5 py-3">日期</th>
              <th className="px-5 py-3">状态</th>
              <th className="px-5 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-t border-line-soft hover:bg-surface/60">
                <td className="max-w-[420px] px-5 py-3">
                  <Link href={`/admin/news/${row.id}`} className="line-clamp-1 font-bold text-ink hover:text-brand-700">{row.title}</Link>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-light">/news/{row.slug}.html</p>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{row.categoryLabel}</td>
                <td className="px-5 py-3 text-[13px] tabular-nums text-muted">{row.publishedAt}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${row.isPublished ? "bg-green/10 text-green" : "bg-surface text-muted"}`}>
                    {row.isPublished ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/news/${row.id}`} className="text-[12px] font-bold text-brand-700 hover:underline">编辑</Link>
                  <button type="button" onClick={() => remove(row.id)} className="ml-4 text-[12px] font-semibold text-muted hover:text-red-600">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="py-14 text-center text-sm text-muted-light">没有匹配的文章。</p>}
      </div>

      <p className="mt-3 text-xs text-muted-light">共 {filtered.length} 篇 · 数据库共 {rows.length} 篇</p>
    </div>
  );
}
