import { NextResponse } from "next/server";
import { liveCatalog } from "@/lib/live-catalog";
import { liveHref } from "@/lib/live-site";
import { getPublishedNews } from "@/lib/news-store";
import { getProductContent } from "@/lib/product-content";

const LIMIT = 6;

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

  const products = liveCatalog
    .flatMap(category => category.pages.flatMap(page => page.products))
    .filter(product => {
      const haystack = [product.model, product.title, ...(product.specifications ?? [])].join(" ").toLowerCase();
      return haystack.includes(needle);
    })
    .slice(0, LIMIT)
    .map(product => {
      const content = getProductContent(product.path);
      const specs = (product.specifications ?? []).slice(0, 2).join(" · ");
      return {
        type: "product" as const,
        title: product.title,
        label: product.model,
        excerpt: [content?.summary, specs].filter(Boolean).join(" · "),
        image: content?.images?.[0]?.url ?? product.image,
        url: liveHref(product.path),
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
    products,
    news,
    total: products.length + news.length,
  });
}
