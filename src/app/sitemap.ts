import type { MetadataRoute } from "next";
import { getPublicCategories, getSitemapProducts } from "@/lib/catalog-store";
import { getPublishedNews } from "@/lib/news-store";

const BASE = "https://www.chinateao.com";
const LAST_MODIFIED = new Date("2026-11-10");
const url = (path: string) => BASE + encodeURI(path);

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: LAST_MODIFIED, changeFrequency: "daily", priority: 1 },
    { url: url("/products/"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/applications/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/applications/automotive-interior/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/applications/automotive-interior/internal/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/applications/automotive-interior/external/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/applications/home-life/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/applications/office-equipment/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/applications/industrial-application/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/quality-control/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/faq/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/news/"), lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/convert/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/about-us/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contacts/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/privacy/"), lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/sitemap/"), lastModified: LAST_MODIFIED, changeFrequency: "monthly", priority: 0.3 },
  ];

  // 分类页第 1 页(分页页不单独提交,避免重复内容)
  const categories = await getPublicCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: url(category.path),
    lastModified: category.updatedAt ?? LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const products = await getSitemapProducts();
  const productPages: MetadataRoute.Sitemap = products.map(product => ({
    url: url(product.path),
    lastModified: product.updatedAt ?? LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsArticles = await getPublishedNews();
  const newsPages: MetadataRoute.Sitemap = newsArticles.map(article => ({
    url: url(`/news/${article.slug}.html`),
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...newsPages];
}
