// 把 src/content/live-site 的商品 JSON 一次性迁入 DB。
// 默认只预览；确认后加 --force 才会重建 products/categories（news/admins 不动）。
// 运行: npm run db:seed:products -- --force

import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { db } from "../src/db";
import { categories, products } from "../src/db/schema";

const root = resolve(import.meta.dirname, "..");
const content = (name: string) => JSON.parse(readFileSync(resolve(root, "src/content/live-site", name), "utf8"));

const categoriesJson = content("categories.json") as CategoryJson[];
const productsJson = content("products.json") as Record<string, ProductJson>;
const productPaths = content("product-paths.json") as string[];
const productSpecs = content("product-specs.json") as Record<string, SpecOverlay>;

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

interface ListingProduct {
  path: string;
  title: string;
  model: string;
  imageSource?: string;
  image: string;
  specifications?: string[];
}
interface CategoryJson {
  id: string;
  label: string;
  path: string;
  description: string;
  image: string;
  pages: { number: number; path: string; products: ListingProduct[] }[];
}
interface ProductJson {
  path: string;
  slug: string;
  categoryId: string;
  model: string;
  name: string;
  summary: string;
  images: { url: string; alt?: string }[];
  characteristics: string[];
  torque: { min: number; max: number; unit: string } | null;
  force: { min: number; max: number; unit: string } | null;
  hardTorque: string | null;
  hardForce: string | null;
  soundType: string | null;
  bufferDirection: string | null;
  assemblyMethod: string | null;
  durability: { cycles?: number; temperature?: string; test_method?: string } | null;
  specifications: { label: string; value: string }[];
  materials: { part: string; material: string }[];
  applications: string[];
  applicationScenarios: { image: string; label: string }[];
  dimensionDrawing: string | null;
  performanceCharts: { rotation: string | null; temperature: string | null } | null;
  variants: { variants: string[]; rows: { param: string; values: string[] }[] } | null;
}
interface SpecOverlay {
  model: string;
  torque: { min: number; max: number; unit: string } | null;
  force: { min: number; max: number; unit: string } | null;
  mounting: string | null;
  specs: { label: string; value: string }[];
}

function slugFromModel(model: string): string {
  return String(model || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "product";
}

function parseSpecStrings(values: string[] | undefined) {
  return (values ?? []).flatMap(raw => {
    const index = raw.indexOf(":");
    if (index <= 0) return [];
    const label = raw.slice(0, index).trim();
    const value = raw.slice(index + 1).trim();
    return label && value ? [{ label, value }] : [];
  });
}

function localImage(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/")) return null;
  return url.split(/[?#]/)[0];
}

function imageExists(url: string | null): boolean {
  if (!url) return true;
  return existsSync(join(root, "public", decodeURIComponent(url)));
}

const listingByPath = new Map<string, { listing: ListingProduct; category: CategoryJson; sortOrder: number }>();
for (const category of categoriesJson) {
  let order = 0;
  for (const page of category.pages) {
    for (const listing of page.products) {
      listingByPath.set(listing.path, { listing, category, sortOrder: order++ });
    }
  }
}

const sortedPaths = Object.keys(productsJson).sort((a, b) => {
  const left = productsJson[a];
  const right = productsJson[b];
  if (left.slug !== right.slug) return left.slug.localeCompare(right.slug);
  const leftExact = slugFromModel(left.model) === left.slug ? 0 : 1;
  const rightExact = slugFromModel(right.model) === right.slug ? 0 : 1;
  if (leftExact !== rightExact) return leftExact - rightExact;
  return a.localeCompare(b);
});
const pathSet = new Set(productPaths);
const missingPaths = sortedPaths.filter(path => !pathSet.has(path));
const extraPaths = productPaths.filter(path => !productsJson[path]);
if (missingPaths.length || extraPaths.length) {
  console.error("商品 JSON 与 product-paths.json 不一致", { missingPaths, extraPaths });
  process.exit(1);
}

const categoryRows = categoriesJson.map((category, index) => ({
  slug: category.id,
  path: category.path,
  name: category.label,
  description: category.description,
  image: category.image,
  pageSize: Math.max(...category.pages.map(page => page.products.length)),
  sortOrder: index + 1,
}));

const categorySlugs = new Set(categoryRows.map(category => category.slug));
const usedSlugs = new Set<string>();
const duplicateSlugs: { path: string; from: string; to: string }[] = [];
const migratedAt = new Date("2026-11-14T00:00:00+08:00");
const missingImages: { path: string; image: string }[] = [];

const productRows = sortedPaths.map(path => {
  const detail = productsJson[path];
  const entry = listingByPath.get(path);
  const overlay = productSpecs[path];
  if (!detail || !entry) {
    console.error(`缺少详情或列表记录: ${path}`);
    process.exit(1);
  }
  if (!categorySlugs.has(detail.categoryId)) {
    console.error(`商品分类不存在: ${path} -> ${detail.categoryId}`);
    process.exit(1);
  }

  let slug = detail.slug || slugFromModel(detail.model);
  if (usedSlugs.has(slug)) {
    const derived = slugFromModel(detail.model);
    slug = derived && !usedSlugs.has(derived) ? derived : `${slug}-2`;
    let suffix = 2;
    while (usedSlugs.has(slug)) slug = `${derived || detail.slug}-${++suffix}`;
  }
  usedSlugs.add(slug);
  if (slug !== detail.slug) duplicateSlugs.push({ path, from: detail.slug, to: slug });

  const listingSpecs = parseSpecStrings(entry.listing.specifications);
  const specs = [...(detail.specifications ?? [])];
  const labels = new Set(specs.map(spec => spec.label));
  for (const spec of listingSpecs) {
    if (!labels.has(spec.label)) {
      specs.push(spec);
      labels.add(spec.label);
    }
  }
  if (specs.length === 0 && overlay?.specs) specs.push(...overlay.specs);

  const image = localImage(entry.listing.image) ?? localImage(detail.images?.[0]?.url) ?? "";
  const images = detail.images ?? [];
  const torque = detail.torque ?? overlay?.torque ?? null;
  const force = detail.force ?? overlay?.force ?? null;
  const allImages = [
    image,
    ...images.map(item => localImage(item.url)),
    localImage(detail.dimensionDrawing),
    localImage(detail.performanceCharts?.rotation),
    localImage(detail.performanceCharts?.temperature),
    ...(detail.applicationScenarios ?? []).map(item => localImage(item.image)),
  ].filter((item): item is string => Boolean(item));
  for (const url of allImages) {
    if (!imageExists(url)) missingImages.push({ path, image: url });
  }

  return {
    slug,
    path,
    model: detail.model,
    name: detail.name,
    listingTitle: entry.listing.title || detail.name,
    category: detail.categoryId,
    summary: detail.summary ?? "",
    description: detail.summary ?? "",
    features: "[]",
    image,
    images: JSON.stringify(images),
    specifications: JSON.stringify(specs),
    torque: torque ? JSON.stringify(torque) : null,
    force: force ? JSON.stringify(force) : null,
    hardTorque: detail.hardTorque ?? null,
    hardForce: detail.hardForce ?? null,
    soundType: detail.soundType ?? null,
    durability: detail.durability ? JSON.stringify(detail.durability) : null,
    materials: JSON.stringify(detail.materials ?? []),
    characteristics: JSON.stringify(detail.characteristics ?? []),
    dimensionDrawing: detail.dimensionDrawing ?? null,
    performanceCharts: detail.performanceCharts ? JSON.stringify(detail.performanceCharts) : null,
    variants: detail.variants ? JSON.stringify(detail.variants) : null,
    bufferDirection: detail.bufferDirection ?? null,
    assemblyMethod: detail.assemblyMethod ?? overlay?.mounting ?? null,
    applications: JSON.stringify(detail.applications ?? []),
    applicationScenarios: JSON.stringify(detail.applicationScenarios ?? []),
    seoTitle: null,
    seoDescription: null,
    tags: "[]",
    status: "active",
    isActive: 1,
    sortOrder: entry.sortOrder,
    createdAt: migratedAt,
    updatedAt: migratedAt,
  };
});

const counts = categoryRows.map(category => {
  const total = productRows.filter(product => product.category === category.slug).length;
  return { slug: category.slug, total, pages: Math.ceil(total / category.pageSize) };
});
const expectedCounts = [27, 20, 15, 8, 7];
const expectedPages = [3, 2, 2, 1, 1];
counts.forEach((item, index) => {
  if (item.total !== expectedCounts[index] || item.pages !== expectedPages[index]) {
    console.error("分类数量/页数与预期不一致", item, { expectedCount: expectedCounts[index], expectedPages: expectedPages[index] });
    process.exit(1);
  }
});
if (categoryRows.length !== 5 || productRows.length !== 77) {
  console.error(`数量断言失败: categories=${categoryRows.length}, products=${productRows.length}`);
  process.exit(1);
}
if (new Set(productRows.map(row => row.path)).size !== 77 || new Set(productRows.map(row => row.slug)).size !== 77) {
  console.error("path 或 slug 存在重复");
  process.exit(1);
}
if (missingImages.length) {
  console.error("以下图片不存在:", missingImages.slice(0, 20));
  if (missingImages.length > 20) console.error(`...共 ${missingImages.length} 条`);
  process.exit(1);
}

console.log("迁移预览:", counts);
if (duplicateSlugs.length) console.log("重复 slug 处理:", duplicateSlugs);

if (dryRun) {
  console.log("dry-run: 未写入数据库");
  process.exit(0);
}

async function applySeed() {
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0 && !force) {
    console.error("products 表已有数据。确认重建请加 --force。");
    process.exit(1);
  }

  await db.transaction(async tx => {
    await tx.delete(products);
    await tx.delete(categories);
    await tx.insert(categories).values(categoryRows);
    await tx.insert(products).values(productRows);
  });

  console.log(`完成: ${categoryRows.length} 个分类, ${productRows.length} 个商品`);
}

applySeed().catch(error => {
  console.error(error);
  process.exit(1);
});
