import { notFound, permanentRedirect } from "next/navigation";
import { getPublicCategories } from "@/lib/catalog-store";

/** Compatibility for bookmarks made before the original-site routes were connected. */
export default async function DevelopmentCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const match = (await getPublicCategories()).find(item => item.slug === category);
  if (!match) notFound();
  permanentRedirect(encodeURI(match.path));
}
