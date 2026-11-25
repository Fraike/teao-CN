"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaPicker from "./media-picker";

interface Props {
  initial?: {
    id: number;
    name: string;
    slug: string;
    path: string;
    description: string;
    image: string;
    pageSize: number;
    sortOrder: number;
  };
  isNew?: boolean;
  productCount?: number;
}

export default function CategoryForm({ initial, isNew = false, productCount = 0 }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    path: initial?.path ?? "",
    description: initial?.description ?? "",
    image: initial?.image ?? "",
    pageSize: initial?.pageSize ?? 12,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setDirty(true);
    setForm(previous => ({ ...previous, [key]: value }));
  }

  function handleSlug(value: string) {
    setDirty(true);
    setForm(previous => ({
      ...previous,
      slug: value,
      path: isNew && (!previous.path || previous.path === `/${previous.slug}/`) ? (value ? `/${value}/` : "") : previous.path,
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(isNew ? "/api/admin/categories" : `/api/admin/categories/${initial?.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "保存失败");
      setDirty(false);
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!initial?.id || productCount > 0) return;
    if (!confirm("确认删除该分类？")) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/categories/${initial.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setSaving(false);
    }
  }

  const field = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10";
  const label = "mb-1 block text-[13px] font-bold text-ink";

  return (
    <form onSubmit={event => void submit(event)} className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}

      <section className="rounded-2xl border border-line bg-white p-5 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>分类名称 *</label><input className={field} value={form.name} onChange={event => set("name", event.target.value)} required /></div>
          <div><label className={label}>Slug *</label><input className={`${field} ${!isNew ? "bg-surface text-muted" : ""}`} value={form.slug} onChange={event => handleSlug(event.target.value)} readOnly={!isNew} required /></div>
          <div><label className={label}>分类路径 *</label><input className={`${field} ${!isNew ? "bg-surface text-muted" : ""}`} value={form.path} onChange={event => set("path", event.target.value)} readOnly={!isNew} placeholder="/gear-damper/" required /></div>
          <div><label className={label}>每页产品数 *</label><input type="number" className={`${field} ${!isNew ? "bg-surface text-muted" : ""}`} value={form.pageSize} onChange={event => set("pageSize", Number(event.target.value))} readOnly={!isNew} required /></div>
          <div className="sm:col-span-2"><label className={label}>分类描述 *</label><textarea className={`${field} min-h-24 py-2`} value={form.description} onChange={event => set("description", event.target.value)} required /></div>
          <div><label className={label}>排序</label><input type="number" className={field} value={form.sortOrder} onChange={event => set("sortOrder", Number(event.target.value))} /></div>
          <div className="sm:col-span-2"><MediaPicker label="分类图 *" value={form.image} onChange={value => set("image", value)} /></div>
        </div>
        {!isNew && <p className="mt-3 text-xs text-muted">已有分类的 slug、路径和每页产品数不可修改，避免旧分页 URL 失效。</p>}
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4">
        <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-full bg-brand-500 px-6 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">{saving ? "保存中…" : isNew ? "创建分类" : "保存修改"}</button>
        <Link href="/admin/categories" onClick={event => { if (dirty && !confirm("有未保存的修改，确认离开？")) event.preventDefault(); }} className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-bold text-muted hover:border-brand-500">取消</Link>
        {!isNew && <button type="button" onClick={() => void remove()} disabled={saving || productCount > 0} title={productCount > 0 ? "分类下还有商品，不能删除" : ""} className="ml-auto inline-flex h-10 items-center rounded-full border border-red-200 px-5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-40">删除分类{productCount > 0 ? `（${productCount} 个商品）` : ""}</button>}
      </div>
    </form>
  );
}
