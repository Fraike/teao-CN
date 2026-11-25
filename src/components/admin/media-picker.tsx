"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";

interface MediaItem { name: string; url: string; size: number; modified: string; source: string }

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function MediaPicker({ value, onChange, label, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload" | "url">("library");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (source) params.set("source", source);
    const response = await fetch(`/api/admin/media?${params.toString()}`);
    if (!response.ok) throw new Error("媒体库加载失败");
    const data = await response.json();
    return (data.items ?? []) as MediaItem[];
  }, [query, source]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchItems());
    } catch (err) {
      setError(err instanceof Error ? err.message : "媒体库加载失败");
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    if (!open || tab !== "library") return;
    let cancelled = false;
    (async () => {
      try {
        const next = await fetchItems();
        if (!cancelled) setItems(next);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "媒体库加载失败");
      }
    })();
    return () => { cancelled = true; };
  }, [open, tab, fetchItems]);

  async function upload(file: File) {
    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "上传失败");
      onChange(data.url);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      {label && <span className="mb-1 block text-[13px] font-bold text-ink">{label}</span>}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setOpen(true)} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-left text-sm text-ink-soft hover:border-brand-500">
          {value ? <Image src={value} alt="" width={28} height={28} className="h-7 w-7 rounded object-cover" unoptimized /> : <ImageIcon size={16} className="text-muted-light" />}
          <span className="min-w-0 flex-1 truncate">{value || "选择图片"}</span>
        </button>
        {value && <button type="button" onClick={() => onChange("")} className="grid h-10 w-10 place-items-center rounded-lg border border-line text-muted hover:border-red-300 hover:text-red-600" aria-label="清除图片"><X size={15} /></button>}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-base font-black text-ink">选择图片</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface"><X size={18} /></button>
            </div>

            <div className="flex gap-1 border-b border-line px-4 pt-3">
              {([["library", "媒体库"], ["upload", "上传"], ["url", "URL"]] as const).map(([key, text]) => (
                <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-t-lg px-4 py-2 text-sm font-bold ${tab === key ? "bg-brand-50 text-brand-700" : "text-muted hover:text-ink"}`}>{text}</button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}

              {tab === "library" && (
                <div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索文件名…" className="h-9 w-56 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" />
                    <select value={source} onChange={event => setSource(event.target.value)} className="h-9 rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500">
                      <option value="">全部来源</option>
                      <option value="images">项目图片</option>
                      <option value="uploads">已上传</option>
                    </select>
                    <button type="button" onClick={() => void load()} className="h-9 rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft hover:border-brand-500">刷新</button>
                    <span className="self-center text-xs text-muted">{loading ? "加载中…" : `${items.length} 张`}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {items.map(item => (
                      <button key={item.url} type="button" onClick={() => { onChange(item.url); setOpen(false); }} className="group overflow-hidden rounded-xl border border-line bg-white text-left transition-colors hover:border-brand-500">
                        <span className="relative block aspect-square bg-surface">
                          <Image src={item.url} alt={item.name} fill sizes="160px" className="object-contain p-2" unoptimized />
                        </span>
                        <span className="block truncate border-t border-line-soft px-2 py-1.5 text-[11px] text-muted">{item.name}</span>
                      </button>
                    ))}
                  </div>
                  {!loading && items.length === 0 && <p className="py-12 text-center text-sm text-muted">没有找到图片。</p>}
                </div>
              )}

              {tab === "upload" && (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface px-6 py-16 text-center hover:border-brand-500">
                  <Upload size={28} className="text-brand-500" />
                  <span className="mt-3 text-sm font-bold text-ink">点击选择图片上传</span>
                  <span className="mt-1 text-xs text-muted">JPG / PNG / WebP / GIF，最大 5 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
                </label>
              )}

              {tab === "url" && (
                <div className="space-y-3">
                  <input value={value ?? ""} onChange={event => onChange(event.target.value)} placeholder="/images/products/xxx.webp" className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-brand-500" />
                  <p className="text-xs text-muted">只支持站内路径（以 / 开头）。</p>
                  <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-lg bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-700">使用此路径</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
