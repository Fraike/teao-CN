import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    return { title: "产品未找到" };
  }

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} | 特澳 TEAO`,
      description: product.summary,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    notFound();
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  // Parse JSON fields
  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(product.specifications);
  } catch {
    specs = {};
  }

  let features: string[] = [];
  try {
    features = JSON.parse(product.features);
  } catch {
    features = [];
  }

  let applications: string[] = [];
  try {
    applications = JSON.parse(product.applications);
  } catch {
    applications = [];
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-surface border-b border-line-soft">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brand-700 transition-colors">
              首页
            </Link>
            <span className="text-muted-light">/</span>
            <Link href="/products" className="hover:text-brand-700 transition-colors">
              产品中心
            </Link>
            {category && (
              <>
                <span className="text-muted-light">/</span>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hover:text-brand-700 transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span className="text-muted-light">/</span>
            <span className="text-ink font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="bg-white py-16">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Product Image */}
            <div className="grid place-items-center aspect-[1/0.85] bg-[#FAF8F5] rounded-2xl border border-line p-10 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={510}
                className="w-full max-w-[500px] object-contain"
                priority
              />
            </div>

            {/* Right: Product Info */}
            <div>
              {/* Model badge */}
              <span className="inline-block rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 mb-4">
                {product.model}
              </span>

              <h1 className="text-[32px] leading-tight font-bold text-ink tracking-tight">
                {product.name}
              </h1>

              <p className="mt-4 text-muted leading-relaxed">
                {product.description}
              </p>

              {/* Specifications Table */}
              {Object.keys(specs).length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-ink mb-4">技术参数</h2>
                  <div className="rounded-xl border border-line overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(specs).map(([key, value], i) => (
                          <tr
                            key={key}
                            className={
                              i % 2 === 0 ? "bg-white" : "bg-surface"
                            }
                          >
                            <td className="px-5 py-3 font-medium text-ink-soft w-[40%] border-r border-line-soft">
                              {key}
                            </td>
                            <td className="px-5 py-3 text-muted">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Features List */}
              {features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-ink mb-3">产品特点</h2>
                  <ul className="space-y-2">
                    {features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-ink-soft"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Applications List */}
              {applications.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-ink mb-3">应用场景</h2>
                  <div className="flex flex-wrap gap-2">
                    {applications.map((app) => (
                      <span
                        key={app}
                        className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/contacts/">发送图纸获取报价</Button>
                <Button href="tel:021-57684226" variant="outline">
                  电话咨询
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
