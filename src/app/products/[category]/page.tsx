import { notFound, permanentRedirect } from "next/navigation";
import { developmentCategoryPath } from "@/lib/live-site";

/** Compatibility for bookmarks made before the original-site routes were connected. */
export default async function DevelopmentCategory({ params }: { params: Promise<{ category: string }> }) {
  const path = developmentCategoryPath((await params).category);
  if (!path) notFound();
  permanentRedirect(encodeURI(path));
}
