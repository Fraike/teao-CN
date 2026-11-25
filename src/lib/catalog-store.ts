// 商品/分类的唯一 DB 数据层。前台和后台共用，仅服务端使用。
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { compareModel } from "./product-sort";
import { getPilotPage, legacyPathFromSegments } from "./live-site";
import categoryRoutes from "@/content/live-site/category-routes.json";

export interface ProductImage { url: string; alt?: string }
export interface SpecChip { label: string; value: string }
export interface TorqueRange { min: number; max: number; unit: string }
export interface MaterialItem { part: string; material: string }
export interface Variants {
  variants: string[];
  rows: { param: string; values: string[] }[];
}

export interface ProductContent {
  path: string;
  slug: string;
  categoryId: string;
  model: string;
  name: string;
  summary: string;
  images: ProductImage[];
  characteristics: string[];
  torque: TorqueRange | null;
  force: TorqueRange | null;
  hardTorque: string | null;
  hardForce: string | null;
  soundType: string | null;
  bufferDirection: string | null;
  assemblyMethod: string | null;
  durability: { cycles?: number; temperature?: string; test_method?: string } | null;
  specifications: SpecChip[];
  materials: MaterialItem[];
  applications: string[];
  applicationScenarios: { image: string; label: string }[];
  dimensionDrawing: string | null;
  performanceCharts: { rotation: string | null; temperature: string | null } | null;
  variants: Variants | null;
}

export interface CatalogProduct {
  path: string;
  title: string;
  model: string;
  image: string;
  specifications: string[];
  torque?: TorqueRange | null;
  force?: TorqueRange | null;
}

export interface CatalogPage {
  number: number;
  path: string;
  products: CatalogProduct[];
}

export interface CatalogCategory {
  id: string;
  label: string;
  path: string;
  description: string;
  image: string;
  pages: CatalogPage[];
}

export interface CategoryPublic {
  id: string;
  slug: string;
  name: string;
  path: string;
  description: string;
  image: string;
  pageSize: number;
  sortOrder: number;
  updatedAt: Date | null;
}

type CategoryRow = typeof categories.$inferSelect;
type ProductRow = typeof products.$inferSelect;

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export function normalizeModel(model: string): string {
  return String(model ?? "").toUpperCase().replace(/\s+/g, "").split("/")[0];
}

export function rowToProductContent(row: ProductRow): ProductContent {
  return {
    path: row.path,
    slug: row.slug,
    categoryId: row.category,
    model: row.model,
    name: row.name,
    summary: row.summary,
    images: parseJson<ProductImage[]>(row.images, []),
    characteristics: parseJson<string[]>(row.characteristics, []),
    torque: parseJson<TorqueRange | null>(row.torque, null),
    force: parseJson<TorqueRange | null>(row.force, null),
    hardTorque: row.hardTorque,
    hardForce: row.hardForce,
    soundType: row.soundType,
    bufferDirection: row.bufferDirection,
    assemblyMethod: row.assemblyMethod,
    durability: parseJson<{ cycles?: number; temperature?: string; test_method?: string } | null>(row.durability, null),
    specifications: parseJson<SpecChip[]>(row.specifications, []),
    materials: parseJson<MaterialItem[]>(row.materials, []),
    applications: parseJson<string[]>(row.applications, []),
    applicationScenarios: parseJson<{ image: string; label: string }[]>(row.applicationScenarios, []),
    dimensionDrawing: row.dimensionDrawing,
    performanceCharts: parseJson<{ rotation: string | null; temperature: string | null } | null>(row.performanceCharts, null),
    variants: parseJson<Variants | null>(row.variants, null),
  };
}

function rowToCatalogProduct(row: ProductRow): CatalogProduct {
  const specs = parseJson<SpecChip[]>(row.specifications, []);
  return {
    path: row.path,
    title: row.listingTitle || row.name,
    model: row.model,
    image: row.image,
    specifications: specs.map(spec => `${spec.label}:${spec.value}`),
    torque: parseJson<TorqueRange | null>(row.torque, null),
    force: parseJson<TorqueRange | null>(row.force, null),
  };
}

/** 商品按型号自然排序，再按 sortOrder/id 稳定收尾，保持现有分页组成。 */
export function buildCatalogPages(
  category: { path: string; pageSize: number },
  rows: ProductRow[],
): CatalogPage[] {
  const sorted = [...rows].sort((left, right) =>
    compareModel(left.model, right.model)
    || left.sortOrder - right.sortOrder
    || left.id - right.id
  );
  const pageSize = Math.max(1, category.pageSize || 12);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  return Array.from({ length: pageCount }, (_, index) => {
    const number = index + 1;
    return {
      number,
      path: number === 1 ? category.path : `${category.path}index_${number}.html`,
      products: sorted.slice(index * pageSize, (index + 1) * pageSize).map(rowToCatalogProduct),
    };
  });
}

const publicData = cache(async () => {
  const categoryRows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
  const productRows = await db.select().from(products)
    .where(eq(products.isActive, 1))
    .orderBy(asc(products.sortOrder), asc(products.id));

  const byCategory = new Map<string, ProductRow[]>();
  for (const row of productRows) {
    const list = byCategory.get(row.category) ?? [];
    list.push(row);
    byCategory.set(row.category, list);
  }

  const catalog: CatalogCategory[] = categoryRows.map(row => ({
    id: row.slug,
    label: row.name,
    path: row.path,
    description: row.description,
    image: row.image,
    pages: buildCatalogPages(row, byCategory.get(row.slug) ?? []),
  }));

  const productByPath = new Map<string, ProductContent>();
  const productByPathLower = new Map<string, ProductContent>();
  const productByModel = new Map<string, ProductContent>();
  for (const row of productRows) {
    const content = rowToProductContent(row);
    productByPath.set(row.path, content);
    productByPathLower.set(row.path.toLowerCase(), content);
    const key = normalizeModel(row.model);
    if (!productByModel.has(key)) productByModel.set(key, content);
  }

  const categoryBySlug = new Map<string, CategoryRow>();
  const categoryByPath = new Map<string, CategoryRow>();
  for (const row of categoryRows) {
    categoryBySlug.set(row.slug, row);
    categoryByPath.set(row.path, row);
    categoryByPath.set(row.path.replace(/\/$/, ""), row);
  }

  return { categoryRows, productRows, catalog, productByPath, productByPathLower, productByModel, categoryBySlug, categoryByPath };
});

export async function getPublicCategories(): Promise<CategoryPublic[]> {
  const { categoryRows } = await publicData();
  return categoryRows.map(row => ({
    id: row.slug,
    slug: row.slug,
    name: row.name,
    path: row.path,
    description: row.description,
    image: row.image,
    pageSize: row.pageSize,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt,
  }));
}

export async function getCatalog(): Promise<CatalogCategory[]> {
  return (await publicData()).catalog;
}

/** 导航兜底：DB 不可用时仍保留 5 个分类入口。 */
export function fallbackNavCategories(): CategoryPublic[] {
  return categoryRoutes.map((category, index) => ({
    id: category.id,
    slug: category.id,
    name: category.label,
    path: category.path,
    description: "",
    image: "",
    pageSize: 12,
    sortOrder: index + 1,
    updatedAt: null,
  }));
}

export async function getNavCategories(): Promise<CategoryPublic[]> {
  try {
    const categories = await getPublicCategories();
    return categories.length ? categories : fallbackNavCategories();
  } catch {
    return fallbackNavCategories();
  }
}

export async function getCategoryRouteByPath(path: string) {
  const { catalog, categoryByPath } = await publicData();
  const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
  const direct = categoryByPath.get(path) ?? categoryByPath.get(normalized) ?? categoryByPath.get(`${normalized}/`);
  if (direct) {
    const category = catalog.find(item => item.id === direct.slug);
    return category ? { category, page: category.pages[0] } : null;
  }

  for (const category of catalog) {
    const base = category.path.endsWith("/") ? category.path : `${category.path}/`;
    const bare = base.slice(0, -1);
    if (normalized !== bare && !path.startsWith(base)) continue;
    const rest = path.slice(base.length);
    const match = rest.match(/^index_(\d+)\.html$/);
    if (!match) continue;
    const number = Number(match[1]);
    if (number < 2) return null;
    const page = category.pages.find(item => item.number === number);
    if (page) return { category, page };
  }

  return null;
}

export async function getProductContentByPath(path: string): Promise<ProductContent | null> {
  const data = await publicData();
  return data.productByPath.get(path) ?? data.productByPathLower.get(path.toLowerCase()) ?? null;
}

export async function getProductContentByModel(model: string): Promise<ProductContent | null> {
  return (await publicData()).productByModel.get(normalizeModel(model)) ?? null;
}

export async function getProductContentByModelMap(): Promise<Map<string, ProductContent>> {
  return (await publicData()).productByModel;
}

export async function getRelatedProducts(
  categoryId: string,
  excludePath: string,
  limit = 4,
  excludeModel?: string,
): Promise<CatalogProduct[]> {
  const category = (await getCatalog()).find(item => item.id === categoryId);
  if (!category) return [];
  const blocked = excludeModel ? normalizeModel(excludeModel) : null;
  return category.pages
    .flatMap(page => page.products)
    .filter(product => product.path !== excludePath)
    .filter(product => !blocked || normalizeModel(product.model) !== blocked)
    .slice(0, limit);
}

export async function getActiveProductPaths(): Promise<string[]> {
  return (await publicData()).productRows.map(row => row.path);
}

export async function getSitemapProducts(): Promise<{ path: string; updatedAt: Date | null }[]> {
  return (await publicData()).productRows.map(row => ({ path: row.path, updatedAt: row.updatedAt }));
}

export async function resolveLegacyPath(segments: readonly string[]) {
  const path = legacyPathFromSegments(segments);
  const staticType = getPilotPage(segments);
  if (staticType && staticType !== "category" && staticType !== "product") {
    return { kind: "static" as const, type: staticType };
  }

  const categoryRoute = await getCategoryRouteByPath(path);
  if (categoryRoute) return { kind: "category" as const, ...categoryRoute };

  const content = await getProductContentByPath(path);
  if (content) {
    const category = (await getCatalog()).find(item => item.id === content.categoryId);
    if (category) return { kind: "product" as const, content, category };
  }

  return null;
}
