import { legacyPathFromSegments } from "./live-site";
import catalog from "@/content/live-site/categories.json";

export const liveCatalog = catalog;
export type CatalogCategory = (typeof catalog)[number];
export type CatalogPage = CatalogCategory["pages"][number];
export type CatalogProduct = CatalogPage["products"][number];

export function getCategoryRoute(segments: readonly string[]) {
  const path = legacyPathFromSegments(segments);
  for (const category of catalog) {
    const page = category.pages.find(item => item.path === path || item.path === path + "/");
    if (page) return { category, page };
  }
  return null;
}
