import Link from "next/link";
import NewsForm from "@/components/admin/news-form";

export default function NewNewsPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/news" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回新闻列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">新建文章</h1>
      </div>
      <NewsForm />
    </div>
  );
}
