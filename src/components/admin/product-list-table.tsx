"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductRow {
  id: number;
  model: string;
  name: string;
  listingTitle: string;
  path: string;
  category: string;
  isActive: number;
  sortOrder: number;
}

interface CategoryOption { slug: string; name: string }

export default function ProductListTable({ data, categories }: { data: ProductRow[]; categories: CategoryOption[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const labelFor = (slug: string) => categories.find(category => category.slug === slug)?.name ?? slug;

  const filtered = useMemo(() => data.filter(product => {
    if (search) {
      const q = search.toLowerCase();
      if (![product.model, product.name, product.listingTitle, product.path].join(" ").toLowerCase().includes(q)) return false;
    }
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (statusFilter === "active" && !product.isActive) return false;
    if (statusFilter === "draft" && product.isActive) return false;
    return true;
  }), [data, search, categoryFilter, statusFilter]);

  function toggleSelect(id: number) {
    setSelected(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(product => product.id)));
  }

  async function bulk(action: "publish" | "unpublish" | "delete") {
    if (!selected.size) return;
    if (action === "delete" && !confirm(`确认删除选中的 ${selected.size} 个商品？`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "操作失败");
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("确认删除该商品？")) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setBusy(false);
    }
  }

  const field = "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-500";

  return (
    <div>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</div>}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${field} w-64`} placeholder="搜索型号、名称或路径…" value={search} onChange={event => setSearch(event.target.value)} />
        <select className={field} value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
          <option value="">全部分类</option>
          {categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}
        </select>
        <select className={field} value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
          <option value="">全部状态</option>
          <option value="active">已上架</option>
          <option value="draft">已下架</option>
        </select>
        <span className="ml-auto text-xs text-muted">显示 {filtered.length} / {data.length} 个商品</span>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2">
          <span className="text-xs font-bold text-brand-700">已选中 {selected.size} 项</span>
          <button type="button" onClick={() => void bulk("publish")} disabled={busy} className="text-xs font-bold text-green-700 hover:underline disabled:opacity-50">批量上架</button>
          <button type="button" onClick={() => void bulk("unpublish")} disabled={busy} className="text-xs font-bold text-muted hover:underline disabled:opacity-50">批量下架</button>
          <button type="button" onClick={() => void bulk("delete")} disabled={busy} className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50">批量删除</button>
        </div>
      )}

      <div className="max-h-[72vh] overflow-auto rounded-xl border border-line bg-white">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">未找到商品。</p>
        ) : (
          <table className="w-full min-w-[980px] text-sm">
            <thead className="sticky top-0 z-10 border-b border-line bg-surface">
              <tr>
                <th className="w-10 whitespace-nowrap px-4 py-3"><input type="checkbox" checked={selected.size > 0 && selected.size === filtered.length} onChange={toggleAll} /></th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">型号</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">产品名称</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">分类</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] text-muted-light">状态</th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">排序</th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-black uppercase tracking-[0.08em] text-muted-light">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filtered.map(product => (
                <tr key={product.id} className={selected.has(product.id) ? "bg-brand-50/60" : "hover:bg-surface"}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)} /></td>
                  <td className="px-4 py-3 font-bold text-brand-700">{product.model}</td>
                  <td className="max-w-[340px] truncate px-4 py-3 text-ink-soft">{product.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{labelFor(product.category)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${product.isActive ? "bg-green-100 text-green-700" : "bg-surface text-muted"}`}>{product.isActive ? "已上架" : "已下架"}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-muted-light">{product.sortOrder}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-xs font-bold text-brand-700 hover:underline">编辑</Link>
                      <button type="button" onClick={() => void remove(product.id)} disabled={busy} className="text-xs font-bold text-red-600 hover:underline disabled:opacity-50">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
