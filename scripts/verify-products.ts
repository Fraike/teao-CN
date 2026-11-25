// 校验 DB 中的商品/分类是否完整、旧路径与图片是否齐全。
// 运行: npm run db:verify:products

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { db } from "../src/db";
import { categories, products } from "../src/db/schema";

const root = resolve(import.meta.dirname, "..");
const productPaths = JSON.parse(readFileSync(resolve(root, "src/content/live-site/product-paths.json"), "utf8")) as string[];

async function main() {
const categoryRows = await db.select().from(categories).orderBy(categories.sortOrder);
const productRows = await db.select().from(products);
const errors: string[] = [];

if (categoryRows.length !== 5) errors.push(`分类数量 ${categoryRows.length} != 5`);
if (productRows.length !== 77) errors.push(`商品数量 ${productRows.length} != 77`);

const paths = new Set(productRows.map(product => product.path));
const slugs = new Set(productRows.map(product => product.slug));
if (paths.size !== productRows.length) errors.push("商品 path 存在重复");
if (slugs.size !== productRows.length) errors.push("商品 slug 存在重复");
for (const path of productPaths) if (!paths.has(path)) errors.push(`缺少旧路径: ${path}`);
for (const path of paths) if (!productPaths.includes(path)) errors.push(`多出非旧路径: ${path}`);

const expectedCounts: Record<string, number> = {
  "gear-damper": 27,
  "axial-damper": 20,
  "glove-box-damper": 15,
  latch: 8,
  other: 7,
};
const expectedPages: Record<string, number> = {
  "gear-damper": 3,
  "axial-damper": 2,
  "glove-box-damper": 2,
  latch: 1,
  other: 1,
};
for (const category of categoryRows) {
  const count = productRows.filter(product => product.category === category.slug).length;
  const pages = Math.ceil(count / category.pageSize);
  if (count !== expectedCounts[category.slug]) errors.push(`${category.slug} 商品数 ${count} != ${expectedCounts[category.slug]}`);
  if (pages !== expectedPages[category.slug]) errors.push(`${category.slug} 页数 ${pages} != ${expectedPages[category.slug]}`);
  if (!category.path.startsWith("/") || !category.path.endsWith("/")) errors.push(`${category.slug} path 格式不合法: ${category.path}`);
}

const categorySlugs = new Set(categoryRows.map(category => category.slug));
let imageCount = 0;
for (const product of productRows) {
  if (!categorySlugs.has(product.category)) errors.push(`${product.path} 分类不存在: ${product.category}`);
  const urls: string[] = [product.image];
  for (const field of [product.images, product.applicationScenarios]) {
    try {
      const list = JSON.parse(field || "[]") as { url?: string; image?: string }[];
      for (const item of list) urls.push(item.url ?? item.image ?? "");
    } catch { errors.push(`${product.path} JSON 解析失败: ${field}`); }
  }
  urls.push(product.dimensionDrawing ?? "");
  try {
    const charts = JSON.parse(product.performanceCharts || "null") as { rotation?: string; temperature?: string } | null;
    urls.push(charts?.rotation ?? "", charts?.temperature ?? "");
  } catch { errors.push(`${product.path} performanceCharts 解析失败`); }
  for (const url of urls.filter(Boolean)) {
    if (!url.startsWith("/")) continue;
    imageCount += 1;
    if (!existsSync(join(root, "public", decodeURIComponent(url)))) errors.push(`${product.path} 图片不存在: ${url}`);
  }
}

if (errors.length) {
  console.error(`校验失败 (${errors.length}):`);
  for (const error of errors.slice(0, 50)) console.error("-", error);
  if (errors.length > 50) console.error(`...共 ${errors.length} 条`);
  process.exit(1);
}

console.log(`校验通过: ${categoryRows.length} 个分类, ${productRows.length} 个商品, ${paths.size} 个唯一路径, ${imageCount} 个图片引用`);
for (const category of categoryRows) {
  const count = productRows.filter(product => product.category === category.slug).length;
  console.log(`- ${category.slug}: ${count} 个商品, ${Math.ceil(count / category.pageSize)} 页, pageSize=${category.pageSize}`);
}
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
