import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { validateNewsPayload, type NewsPayload } from "@/lib/news-admin";

async function guard() {
  return (await getSession()) ? null : NextResponse.json({ error: "未登录" }, { status: 401 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const newsId = Number(id);
  const payload = (await request.json().catch(() => ({}))) as Partial<NewsPayload>;
  const error = validateNewsPayload(payload);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const slug = payload.slug!.trim();
  const conflict = await db
    .select({ id: news.id })
    .from(news)
    .where(and(eq(news.slug, slug), ne(news.id, newsId)))
    .limit(1);
  if (conflict.length) return NextResponse.json({ error: "该 slug 已存在" }, { status: 409 });

  await db
    .update(news)
    .set({
      slug,
      title: payload.title!.trim(),
      summary: payload.summary ?? "",
      content: sanitizeHtml(payload.content!),
      cover: payload.cover ?? "",
      category: payload.category ?? "company",
      categoryLabel: payload.categoryLabel ?? "公司动态",
      isPublished: payload.isPublished ? 1 : 0,
      publishedAt: payload.publishedAt!,
      seoTitle: payload.seoTitle ?? null,
      seoDescription: payload.seoDescription ?? null,
      keywords: payload.keywords ?? null,
      updatedAt: new Date(),
    })
    .where(eq(news.id, newsId));

  revalidatePath("/news");
  revalidatePath(`/news/${slug}.html`);
  revalidatePath("/");
  revalidatePath("/sitemap/");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  await db.delete(news).where(eq(news.id, Number(id)));

  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/sitemap/");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}
