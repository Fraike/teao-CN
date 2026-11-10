"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import RichTextEditor from "./rich-text-editor";

export interface NewsFormValue {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
}

const categories = [
  { value: "company", label: "公司动态" },
  { value: "quality", label: "质量" },
  { value: "engineering", label: "工程" },
];

const field = "h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition-all placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10";

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function NewsForm({ initial }: { initial?: NewsFormValue }) {
  const router = useRouter();
  const coverRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<NewsFormValue>(
    initial ?? {
      slug: "",
      title: "",
      summary: "",
      content: "",
      cover: "",
      category: "company",
      categoryLabel: "公司动态",
      publishedAt: new Date().toISOString().slice(0, 10),
      isPublished: true,
      seoTitle: "",
      seoDescription: "",
      keywords: "",
    }
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  const set = <K extends keyof NewsFormValue>(key: K, value: NewsFormValue[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const url = initial?.id ? `/api/admin/news/${initial.id}` : "/api/admin/news";
      const response = await fetch(url, {
        method: initial?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "保存失败");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  async function remove() {
    if (!initial?.id || !window.confirm("确定删除这篇新闻吗?此操作不可撤销。")) return;
    const response = await fetch(`/api/admin/news/${initial.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      setStatus("error");
      setMessage("删除失败");
    }
  }

  async function uploadCover(file: File) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "封面上传失败");
      return;
    }
    set("cover", data.url);
  }

  return (
    <form onSubmit={save} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-white p-6">
          <label className="block text-[13px] font-bold text-ink" htmlFor="title">标题 *</label>
          <input
            id="title"
            className={`${field} mt-1.5`}
            value={form.title}
            onChange={event => {
              const title = event.target.value;
              set("title", title);
              if (!slugTouched) set("slug", slugify(title));
            }}
            required
          />

          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="slug">URL slug *</label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 text-xs text-muted-light">/news/</span>
            <input
              id="slug"
              className={field}
              value={form.slug}
              onChange={event => {
                setSlugTouched(true);
                set("slug", event.target.value);
              }}
              required
            />
            <span className="shrink-0 text-xs text-muted-light">.html</span>
          </div>

          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="summary">摘要</label>
          <textarea
            id="summary"
            rows={2}
            className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-muted-light focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
            value={form.summary}
            onChange={event => set("summary", event.target.value)}
            placeholder="用于列表卡片与分享摘要"
          />
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-3 text-sm font-black text-ink">正文 *</h2>
          <RichTextEditor value={form.content} onChange={html => set("content", html)} />
        </div>

        <details className="rounded-2xl border border-line bg-white p-6">
          <summary className="cursor-pointer text-sm font-black text-ink">SEO 设置(可选)</summary>
          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="seoTitle">SEO 标题</label>
          <input id="seoTitle" className={`${field} mt-1.5`} value={form.seoTitle} onChange={event => set("seoTitle", event.target.value)} />
          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="seoDescription">SEO 描述</label>
          <textarea id="seoDescription" rows={2} className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-500" value={form.seoDescription} onChange={event => set("seoDescription", event.target.value)} />
          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="keywords">关键词(逗号分隔)</label>
          <input id="keywords" className={`${field} mt-1.5`} value={form.keywords} onChange={event => set("keywords", event.target.value)} />
        </details>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-20">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm font-black text-ink">发布</h2>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isPublished} onChange={event => set("isPublished", event.target.checked)} className="h-4 w-4 rounded border-line text-brand-500" />
            立即发布
          </label>
          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="publishedAt">发布日期</label>
          <input id="publishedAt" type="date" className={`${field} mt-1.5`} value={form.publishedAt} onChange={event => set("publishedAt", event.target.value)} required />

          <label className="mt-4 block text-[13px] font-bold text-ink" htmlFor="category">分类</label>
          <select
            id="category"
            className={`${field} mt-1.5`}
            value={form.category}
            onChange={event => {
              const value = event.target.value;
              set("category", value);
              set("categoryLabel", categories.find(item => item.value === value)?.label ?? "公司动态");
            }}
          >
            {categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>

          <button type="submit" disabled={status === "saving"} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50">
            {status === "saving" ? "保存中…" : initial?.id ? "保存修改" : "发布文章"}
          </button>
          <Link href="/admin/news" className="mt-3 block text-center text-xs font-semibold text-muted hover:text-brand-700">取消</Link>
          {initial?.id && (
            <button type="button" onClick={remove} className="mt-3 block w-full text-center text-xs font-semibold text-red-600 hover:underline">删除这篇文章</button>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm font-black text-ink">封面图</h2>
          <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-xl border border-line-soft bg-surface">
            {form.cover ? (
              <Image src={form.cover} alt="封面预览" fill sizes="300px" className="object-cover" />
            ) : (
              <button type="button" onClick={() => coverRef.current?.click()} className="h-full w-full text-xs font-semibold text-muted">点击上传封面</button>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => coverRef.current?.click()} className="text-xs font-bold text-brand-700 hover:underline">上传 / 更换</button>
            {form.cover && <button type="button" onClick={() => set("cover", "")} className="text-xs font-semibold text-muted hover:text-red-600">移除</button>}
          </div>
          <input
            ref={coverRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void uploadCover(file);
              event.target.value = "";
            }}
          />
        </div>

        {message && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{message}</p>}
      </aside>
    </form>
  );
}
