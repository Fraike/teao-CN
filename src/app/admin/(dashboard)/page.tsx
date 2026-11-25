import Link from "next/link";
import { desc } from "drizzle-orm";
import {
  ArrowUpRight,
  ExternalLink,
  FolderTree,
  Images,
  Newspaper,
  Package,
  Plus,
  Upload,
} from "lucide-react";
import { db } from "@/db";
import { categories, news, products } from "@/db/schema";

export const dynamic = "force-dynamic";

const modules = [
  {
    href: "/admin/products",
    title: "商品管理",
    description: "型号、扭矩、规格、图集与上下架。",
    icon: Package,
    count: "products",
  },
  {
    href: "/admin/categories",
    title: "分类管理",
    description: "分类名称、描述、图片与分页设置。",
    icon: FolderTree,
    count: "categories",
  },
  {
    href: "/admin/media",
    title: "媒体库",
    description: "上传、搜索与复用商品图片。",
    icon: Images,
    count: null,
  },
  {
    href: "/admin/news",
    title: "新闻管理",
    description: "公司动态、质量管理与工程文章。",
    icon: Newspaper,
    count: "news",
  },
] as const;

const quickActions = [
  { href: "/admin/products/new", label: "新增商品", description: "录入型号与规格", icon: Plus },
  { href: "/admin/categories/new", label: "新增分类", description: "创建新的产品分类", icon: FolderTree },
  { href: "/admin/media", label: "上传图片", description: "补充商品图库", icon: Upload },
  { href: "/admin/news/new", label: "新建文章", description: "发布公司动态", icon: Newspaper },
] as const;

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(value);
}

export default async function AdminHomePage() {
  const [productRows, categoryRows, newsRows, recentProducts] = await Promise.all([
    db.select({ id: products.id }).from(products),
    db.select({ id: categories.id }).from(categories),
    db.select({ id: news.id }).from(news),
    db.select({
      id: products.id,
      model: products.model,
      name: products.name,
      isActive: products.isActive,
      updatedAt: products.updatedAt,
    }).from(products).orderBy(desc(products.updatedAt), desc(products.id)).limit(5),
  ]);

  const counts: Record<string, number> = {
    products: productRows.length,
    categories: categoryRows.length,
    news: newsRows.length,
  };

  return (
    <div>
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-700">工作台</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-ink">后台首页</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">管理中文站商品、分类和新闻内容。所有修改保存后立即在前台生效。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(232,120,26,0.2)] transition-all hover:-translate-y-0.5 hover:bg-brand-700">
            <Plus size={15} /> 新增商品
          </Link>
          <Link href="/" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700">
            <ExternalLink size={14} /> 查看前台
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map(module => {
          const Icon = module.icon;
          const count = module.count ? counts[module.count] : null;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-[0_18px_50px_rgba(30,30,32,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon size={20} />
                </span>
                {count !== null ? (
                  <span className="text-2xl font-black tabular-nums tracking-[-0.03em] text-ink">{count}</span>
                ) : (
                  <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-muted">上传 / 复用</span>
                )}
              </div>
              <h2 className="mt-5 text-base font-black text-ink transition-colors group-hover:text-brand-700">{module.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{module.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                进入管理 <ArrowUpRight size={13} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="text-base font-black text-ink">最近更新</h2>
              <p className="mt-0.5 text-xs text-muted">按最后修改时间排序的商品。</p>
            </div>
            <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">
              全部商品 <ArrowUpRight size={12} />
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">还没有商品。</p>
          ) : (
            <ul className="divide-y divide-line-soft">
              {recentProducts.map(product => (
                <li key={product.id}>
                  <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-black ${product.isActive ? "bg-brand-50 text-brand-700" : "bg-surface text-muted"}`}>
                      {product.model.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink">{product.model}</span>
                      <span className="block truncate text-xs text-muted">{product.name}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-muted-light sm:block">{formatDate(product.updatedAt)}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${product.isActive ? "bg-green-50 text-green-700" : "bg-surface text-muted"}`}>
                      {product.isActive ? "已上架" : "已下架"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-ink">快捷操作</h2>
              <p className="mt-0.5 text-xs text-muted">常用内容入口。</p>
            </div>
            <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-muted">常用</span>
          </div>
          <div className="mt-4 grid gap-2">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-xl border border-line-soft px-3 py-3 transition-colors hover:border-brand-500/40 hover:bg-surface">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-muted transition-colors group-hover:bg-brand-50 group-hover:text-brand-700">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink">{action.label}</span>
                    <span className="block text-xs text-muted">{action.description}</span>
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-muted-light transition-colors group-hover:text-brand-700" />
                </Link>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
            <p className="text-xs font-bold text-brand-700">发布提示</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-700/80">已有商品的旧 URL 已锁定；新建商品会自动生成分类下的路径。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
