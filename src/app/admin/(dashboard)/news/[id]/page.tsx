import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import NewsForm from "@/components/admin/news-form";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db
    .select()
    .from(news)
    .where(eq(news.id, Number(id)))
    .limit(1)
    .then(rows => rows[0]);

  if (!article) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/news" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回新闻列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">编辑文章</h1>
        <p className="mt-1 text-xs text-muted-light">最后更新:{article.updatedAt ? new Date(article.updatedAt).toLocaleString("zh-CN") : "—"}</p>
      </div>
      <NewsForm
        initial={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          content: article.content,
          cover: article.cover,
          category: article.category,
          categoryLabel: article.categoryLabel,
          publishedAt: article.publishedAt,
          isPublished: Boolean(article.isPublished),
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
          keywords: article.keywords ?? "",
        }}
      />
    </div>
  );
}
