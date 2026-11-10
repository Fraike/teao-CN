export interface NewsPayload {
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
}

export function validateNewsPayload(payload: Partial<NewsPayload>): string | null {
  if (!payload.title?.trim()) return "请填写标题";
  if (!payload.slug?.trim()) return "请填写 slug";
  if (!payload.publishedAt) return "请选择发布日期";
  if (!payload.content?.trim()) return "请填写正文";
  return null;
}
