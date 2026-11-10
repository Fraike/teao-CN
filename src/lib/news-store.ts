import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import generated from "@/content/live-site/news.generated.json";

export interface PublicNews {
  id: number;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  summary: string;
  cover: string;
  publishedAt: string;
  content: string;
}

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; src: string; alt?: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

const escapeHtml = (text: string) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 兼容旧数据:把生成的块结构转成 HTML(Tiptap 保存的也是 HTML)。 */
export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map(block => {
      if (block.type === "h2") return `<h2>${escapeHtml(block.text)}</h2>`;
      if (block.type === "h3") return `<h3>${escapeHtml(block.text)}</h3>`;
      if (block.type === "img") return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? "")}" />`;
      if (block.type === "ul") return `<ul>${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
      return `<p>${escapeHtml(block.text)}</p>`;
    })
    .join("\n");
}

const fallback: PublicNews[] = (generated as { id: number; slug: string; category: string; categoryLabel: string; title: string; summary: string; cover: string; publishedAt: string; blocks: Block[] }[]).map(
  article => ({
    id: article.id,
    slug: article.slug,
    category: article.category,
    categoryLabel: article.categoryLabel,
    title: article.title,
    summary: article.summary,
    cover: article.cover,
    publishedAt: article.publishedAt,
    content: blocksToHtml(article.blocks),
  })
);

function toPublic(row: typeof news.$inferSelect): PublicNews {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    categoryLabel: row.categoryLabel,
    title: row.title,
    summary: row.summary,
    cover: row.cover,
    publishedAt: row.publishedAt,
    content: row.content,
  };
}

/** 已发布的中文新闻;数据库不可用时回退到生成的 JSON。 */
export async function getPublishedNews(): Promise<PublicNews[]> {
  try {
    const rows = await db
      .select()
      .from(news)
      .where(and(eq(news.locale, "zh"), eq(news.isPublished, 1)))
      .orderBy(desc(news.publishedAt));
    if (rows.length > 0) return rows.map(toPublic);
  } catch (error) {
    console.error("新闻数据库读取失败,回退到静态数据:", error);
  }
  return fallback;
}

export async function getNewsBySlug(slug: string): Promise<PublicNews | null> {
  try {
    const row = await db
      .select()
      .from(news)
      .where(and(eq(news.slug, slug), eq(news.locale, "zh")))
      .limit(1)
      .then(rows => rows[0]);
    if (row) return row.isPublished ? toPublic(row) : null;
  } catch (error) {
    console.error("新闻详情读取失败,回退到静态数据:", error);
  }
  return fallback.find(item => item.slug === slug) ?? null;
}

export async function getNewsSlugs(): Promise<string[]> {
  const articles = await getPublishedNews();
  return articles.map(article => article.slug);
}
