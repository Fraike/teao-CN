import { notFound, permanentRedirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

/** 旧的 DB 详情页只做 308 跳转，正式 URL 始终以 product.path 为准。 */
export default async function LegacyProductRedirect({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const [product] = await db.select({ path: products.path }).from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) notFound();
  permanentRedirect(encodeURI(product.path));
}
