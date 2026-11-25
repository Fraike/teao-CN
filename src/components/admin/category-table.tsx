"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Row {
  id: number;
  slug: string;
  path: string;
  name: string;
  image: string;
  pageSize: number;
  sortOrder: number;
  productCount: number;
  pageCount: number;
}

export default function CategoryTable({ data }: { data: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove(row: Row) {
    if (row.productCount > 0) return;
    if (!confirm(`确认删除分类「${row.name}」？`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/categories/${row.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">分类</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">Slug / 路径</th>
              <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">商品</th>
              <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">页数</th>
              <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">每页</th>
              <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">排序</th>
              <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {data.map(row => (
              <tr key={row.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {row.image ? <Image src={row.image} alt={row.name} width={36} height={36} className="h-9 w-9 rounded-lg border border-line object-contain" unoptimized /> : <span className="h-9 w-9 rounded-lg border border-line bg-surface" />}
                    <span className="font-bold text-ink">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted"><div className="font-semibold text-ink-soft">{row.slug}</div><div>{row.path}</div></td>
                <td className="px-4 py-3 text-right text-ink-soft">{row.productCount}</td>
                <td className="px-4 py-3 text-right text-muted">{row.pageCount}</td>
                <td className="px-4 py-3 text-right text-muted">{row.pageSize}</td>
                <td className="px-4 py-3 text-right text-muted">{row.sortOrder}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link href={`/admin/categories/${row.id}`} className="text-xs font-bold text-brand-700 hover:underline">编辑</Link>
                  <button type="button" onClick={() => void remove(row)} disabled={busy || row.productCount > 0} title={row.productCount > 0 ? "分类下还有商品，不能删除" : ""} className="text-xs font-bold text-red-600 hover:underline disabled:opacity-30">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
