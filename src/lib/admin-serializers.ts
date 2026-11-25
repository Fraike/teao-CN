import { parseJson } from "./catalog-store";
import { categories, products } from "@/db/schema";

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

const JSON_FIELDS = new Set([
  "images",
  "specifications",
  "torque",
  "force",
  "durability",
  "materials",
  "characteristics",
  "performanceCharts",
  "variants",
  "applications",
  "applicationScenarios",
  "tags",
  "features",
]);

export function adminProduct(row: ProductRow) {
  return {
    ...row,
    images: parseJson(row.images, []),
    specifications: parseJson(row.specifications, []),
    torque: parseJson(row.torque, null),
    force: parseJson(row.force, null),
    durability: parseJson(row.durability, null),
    materials: parseJson(row.materials, []),
    characteristics: parseJson(row.characteristics, []),
    performanceCharts: parseJson(row.performanceCharts, null),
    variants: parseJson(row.variants, null),
    applications: parseJson(row.applications, []),
    applicationScenarios: parseJson(row.applicationScenarios, []),
    tags: parseJson(row.tags, []),
    features: parseJson(row.features, []),
  };
}

export function adminCategory(row: CategoryRow) {
  return { ...row };
}

/** 把校验后的 patch 转成 DB 字符串字段。 */
export function dbProductData(patch: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    data[key] = JSON_FIELDS.has(key) && value !== null && typeof value !== "string"
      ? JSON.stringify(value)
      : value;
  }
  return data;
}
