import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import NewsTable, { type NewsRow } from "@/components/admin/news-table";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  let rows: NewsRow[] = [];
  try {
    const data = await db
      .select({
        id: news.id,
        slug: news.slug,
        title: news.title,
        categoryLabel: news.categoryLabel,
        publishedAt: news.publishedAt,
        isPublished: news.isPublished,
      })
      .from(news)
      .orderBy(desc(news.publishedAt));
    rows = data.map(row => ({ ...row, isPublished: Boolean(row.isPublished) }));
  } catch (error) {
    console.error("加载新闻失败:", error);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-ink">新闻管理</h1>
          <p className="mt-1 text-sm text-muted">新建、编辑与发布新闻文章。</p>
        </div>
        <Link href="/admin/news/new" className="inline-flex h-10 items-center rounded-full bg-brand-500 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700">
          新建文章
        </Link>
      </div>
      <NewsTable rows={rows} />
    </div>
  );
}
