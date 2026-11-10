import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { validateNewsPayload, type NewsPayload } from "@/lib/news-admin";


export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as Partial<NewsPayload>;
  const error = validateNewsPayload(payload);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const slug = payload.slug!.trim();
  const existing = await db.select({ id: news.id }).from(news).where(eq(news.slug, slug)).limit(1);
  if (existing.length) {
    return NextResponse.json({ error: "该 slug 已存在" }, { status: 409 });
  }

  const [created] = await db
    .insert(news)
    .values({
      slug,
      locale: "zh",
      translationKey: slug,
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
    })
    .returning({ id: news.id });

  revalidatePath("/news");
  revalidatePath(`/news/${slug}.html`);
  revalidatePath("/");
  revalidatePath("/sitemap/");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true, id: created.id }, { status: 201 });
}
