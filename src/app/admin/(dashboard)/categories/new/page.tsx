import Link from "next/link";
import CategoryForm from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/categories" className="text-xs font-semibold text-muted hover:text-brand-700">← 返回分类列表</Link>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">新增分类</h1>
        <p className="mt-1 text-sm text-muted">分类路径请使用 /xxx/ 格式，并避免与系统页面冲突。</p>
      </div>
      <CategoryForm isNew />
    </div>
  );
}
