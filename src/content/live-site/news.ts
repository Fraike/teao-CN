// TEAO 中文站 — 新闻类型与分类定义。
// 实际内容来自数据库(src/lib/news-store.ts),数据库不可用时回退到 news.generated.json。

export type NewsCategory = "company" | "quality" | "engineering";

export const newsCategories: { key: NewsCategory | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "company", label: "公司动态" },
  { key: "quality", label: "质量" },
  { key: "engineering", label: "工程" },
];
