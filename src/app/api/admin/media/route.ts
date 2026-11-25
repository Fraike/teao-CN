import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join, relative, resolve } from "node:path";
import { db } from "@/db";
import { categories, news, products } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_DIR = resolve(process.cwd(), "public");
const UPLOAD_DIR = resolve(PUBLIC_DIR, "uploads/media");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_SIZE = 5 * 1024 * 1024;

interface MediaItem { name: string; url: string; size: number; modified: string; source: "images" | "uploads" }

async function walk(dir: string, source: MediaItem["source"], items: MediaItem[]) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, source, items);
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase();
      if (!EXTENSIONS.has(ext)) continue;
      const stat = await fs.stat(full);
      items.push({
        name: entry.name,
        url: "/" + relative(PUBLIC_DIR, full).split("\\").join("/"),
        size: stat.size,
        modified: stat.mtime.toISOString(),
        source,
      });
    }
  }
}

export async function GET(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const query = new URL(request.url).searchParams;
  const q = (query.get("q") ?? "").toLowerCase();
  const source = query.get("source") ?? "";
  const items: MediaItem[] = [];
  if (source !== "uploads") await walk(resolve(PUBLIC_DIR, "images"), "images", items);
  if (source !== "images") await walk(resolve(PUBLIC_DIR, "uploads"), "uploads", items);
  const filtered = items
    .filter(item => !q || item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q))
    .sort((a, b) => b.modified.localeCompare(a.modified));
  return NextResponse.json({ items: filtered, total: filtered.length });
}

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "请选择文件" }, { status: 400 });
  const ext = MIME_EXT[file.type];
  if (!ext) return NextResponse.json({ error: "仅支持 JPG / PNG / WebP / GIF" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "单个文件不得超过 5 MB" }, { status: 400 });

  const now = new Date();
  const dir = join(UPLOAD_DIR, String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  await fs.writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));
  const url = "/" + relative(PUBLIC_DIR, join(dir, filename)).split("\\").join("/");
  return NextResponse.json({ url, name: filename }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const query = new URL(request.url).searchParams;
  const body = await request.json().catch(() => ({})) as { url?: string };
  const url = query.get("url") ?? body.url ?? "";
  if (!url.startsWith("/uploads/media/")) {
    return NextResponse.json({ error: "只能删除媒体库上传的文件" }, { status: 400 });
  }
  const full = resolve(PUBLIC_DIR, decodeURIComponent(url.slice(1)));
  if (!full.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ error: "非法路径" }, { status: 400 });
  }

  const productRows = await db.select().from(products);
  const categoryRows = await db.select().from(categories);
  const newsRows = await db.select().from(news);
  const referenced = JSON.stringify(productRows).includes(url)
    || JSON.stringify(categoryRows).includes(url)
    || JSON.stringify(newsRows).includes(url);
  if (referenced) {
    return NextResponse.json({ error: "该图片仍被商品、分类或新闻引用，不能删除" }, { status: 409 });
  }

  try {
    await fs.unlink(full);
  } catch {
    return NextResponse.json({ error: "文件不存在" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
