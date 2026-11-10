// TEAO 中文站 — 新闻数据
// 由 scripts/generate-news-content.mjs 从 chinateao-export 生成,保留原站 URL 与正文。
import generated from "./news.generated.json";

export type NewsCategory = "company" | "quality" | "engineering";

export type NewsBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; src: string; width: number; height: number; alt: string; caption?: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface NewsArticle {
  id: number;
  slug: string;
  category: NewsCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  cover: string;
  publishedAt: string;
  blocks: NewsBlock[];
}

export const newsArticles = generated as NewsArticle[];

export const newsCategories: { key: NewsCategory | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "company", label: "公司动态" },
  { key: "quality", label: "质量" },
  { key: "engineering", label: "工程" },
];
