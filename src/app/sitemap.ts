import type { MetadataRoute } from "next";
import { newsArticles } from "@/content/live-site/news";

const BASE = "https://www.chinateao.com";
// 固定发布日期:避免每次请求 lastModified 都变化。
const LAST_MODIFIED = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: LAST_MODIFIED, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/applications/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/applications/automotive-interior/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/applications/automotive-interior/internal/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/applications/automotive-interior/external/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/applications/home-life/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/applications/office-equipment/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/applications/industrial-application/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/quality-control/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/faq/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/news/`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/convert/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/about-us/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contacts/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/sitemap/`, lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.3 },
  ];

  const newsPages: MetadataRoute.Sitemap = newsArticles.map(article => ({
    url: `${BASE}/news/${article.slug}.html`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...newsPages];
}
