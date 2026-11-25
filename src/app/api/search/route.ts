import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { parseJson } from "@/lib/catalog-store";
import { getPublishedNews } from "@/lib/news-store";

const LIMIT = 6;

export const dynamic = "force-dynamic";

function plain(html: string) {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(value: string, max = 120) {
  const text = plain(value);
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ products: [], news: [], total: 0 });
  }

  const needle = q.toLowerCase();
  const rows = await db.select().from(products).where(eq(products.isActive, 1));

  const productResults = rows
    .filter(row => {
      const haystack = [
        row.model,
        row.name,
        row.listingTitle,
        row.summary,
        row.description,
        ...parseJson<{ label: string; value: string }[]>(row.specifications, []).map(spec => `${spec.label}:${spec.value}`),
        ...parseJson<string[]>(row.tags, []),
      ].join(" ").toLowerCase();
      return haystack.includes(needle);
    })
    .slice(0, LIMIT)
    .map(row => {
      const specs = parseJson<{ label: string; value: string }[]>(row.specifications, [])
        .slice(0, 2)
        .map(spec => `${spec.label}:${spec.value}`)
        .join(" · ");
      return {
        type: "product" as const,
        title: row.listingTitle || row.name,
        label: row.model,
        excerpt: [row.summary, specs].filter(Boolean).join(" · "),
        image: row.image,
        url: row.path,
      };
    });

  const allNews = await getPublishedNews();
  const news = allNews
    .filter(article =>
      [article.title, article.summary, plain(article.content)].join(" ").toLowerCase().includes(needle)
    )
    .slice(0, LIMIT)
    .map(article => ({
      type: "news" as const,
      title: article.title,
      label: article.categoryLabel,
      excerpt: excerpt(article.summary || article.content),
      image: article.cover,
      url: `/news/${article.slug}.html`,
      publishedAt: article.publishedAt,
    }));

  return NextResponse.json({
    products: productResults,
    news,
    total: productResults.length + news.length,
  });
}
