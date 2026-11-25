"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Trash2, Upload } from "lucide-react";

interface MediaItem { name: string; url: string; size: number; modified: string; source: string }

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (source) params.set("source", source);
    const response = await fetch(`/api/admin/media?${params.toString()}`);
    if (!response.ok) throw new Error("加载失败");
    const data = await response.json();
    return (data.items ?? []) as MediaItem[];
  }, [query, source]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchItems());
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const next = await fetchItems();
        if (!cancelled) setItems(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      }
    })();
    return () => { cancelled = true; };
  }, [fetchItems]);

  async function upload(file: File) {
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "上传失败");
      setNotice(`已上传 ${data.name}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  }

  async function remove(item: MediaItem) {
    if (!confirm(`确认删除 ${item.name}？`)) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/media?url=${encodeURIComponent(item.url)}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      setNotice("已删除");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    }
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setNotice("已复制 URL");
    setTimeout(() => setNotice(""), 2000);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索文件名…" className="h-10 w-64 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" />
        <select value={source} onChange={event => setSource(event.target.value)} className="h-10 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500">
          <option value="">全部来源</option>
          <option value="images">项目图片</option>
          <option value="uploads">已上传</option>
        </select>
        <button type="button" onClick={() => void load()} className="h-10 rounded-lg border border-line px-4 text-sm font-semibold text-ink-soft hover:border-brand-500">刷新</button>
        <label className="ml-auto inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-bold text-white hover:bg-brand-700">
          <Upload size={15} /> 上传图片
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
        </label>
      </div>

      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
      {notice && <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700">{notice}</p>}
      <p className="mb-3 text-xs text-muted">{loading ? "加载中…" : `共 ${items.length} 张图片`}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map(item => (
          <div key={item.url} className="overflow-hidden rounded-xl border border-line bg-white">
            <span className="relative block aspect-square bg-surface">
              <Image src={item.url} alt={item.name} fill sizes="200px" className="object-contain p-2" unoptimized />
            </span>
            <div className="border-t border-line-soft px-2 py-2">
              <p className="truncate text-[11px] text-muted" title={item.url}>{item.name}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-muted-light">{(item.size / 1024).toFixed(0)} KB</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => void copy(item.url)} className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-surface hover:text-brand-700" aria-label="复制 URL"><Copy size={12} /></button>
                  {item.source === "uploads" && <button type="button" onClick={() => void remove(item)} className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-red-50 hover:text-red-600" aria-label="删除"><Trash2 size={12} /></button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && items.length === 0 && <p className="py-16 text-center text-sm text-muted">没有找到图片。</p>}
    </div>
  );
}
