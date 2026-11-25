import { legacyPathFromSegments } from "./live-site";
import { getCategoryRouteByPath, type CatalogCategory, type CatalogPage, type CatalogProduct } from "./catalog-store";

export type { CatalogCategory, CatalogPage, CatalogProduct };
export { getCatalog, getCategoryRouteByPath } from "./catalog-store";

export async function getCategoryRoute(segments: readonly string[]) {
  return getCategoryRouteByPath(legacyPathFromSegments(segments));
}

/** 兼容旧类型导出的别名。 */
export type LiveCatalogCategory = CatalogCategory;
export type LiveCatalogPage = CatalogPage;
export type LiveCatalogProduct = CatalogProduct;
