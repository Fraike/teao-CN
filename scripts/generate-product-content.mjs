// 从英文站数据库生成中文产品详情内容。
// 运行: node scripts/generate-product-content.mjs
// 输出: src/content/live-site/products.json 与 product-paths.json(提交到仓库)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import { canonicalKeys } from "./lib/model-keys.mjs";
import {
  translateApplication,
  translateAssembly,
  translateCharacteristic,
  translateDirection,
  translateMaterial,
  translatePart,
  translateSound,
  translateVariantParam,
} from "./lib/product-i18n.mjs";

const root = resolve(import.meta.dirname, "..");
const catalogPath = resolve(root, "src/content/live-site/categories.json");
const overlayPath = resolve(root, "src/content/live-site/product-specs.json");
const outPath = resolve(root, "src/content/live-site/products.json");
const pathsPath = resolve(root, "src/content/live-site/product-paths.json");
const dbPath = resolve(root, "../teao-website/data/teao.db");
const englishPublic = resolve(root, "../teao-website/public");

/** 只保留英文站 public 下真实存在的文件,避免渲染 404 图片。 */
function existingImage(url) {
  if (!url || !url.startsWith("/")) return null;
  return existsSync(resolve(englishPublic, url.slice(1))) ? url : null;
}

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const overlay = JSON.parse(readFileSync(overlayPath, "utf8"));

function parseJson(value) {
  if (value == null || value === "") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function formatRange(min, max, unit) {
  return min === max ? `${min} ${unit}` : `${min} – ${max} ${unit}`;
}

const db = createClient({ url: `file:${dbPath}` });
const result = await db.execute("select * from products");
db.close();

const englishByKey = new Map();
for (const row of result.rows) {
  for (const key of canonicalKeys(row.model).concat(canonicalKeys(row.name))) {
    if (key && !englishByKey.has(key)) englishByKey.set(key, row);
  }
}

const products = {};
const paths = [];

for (const category of catalog) {
  for (const page of category.pages) {
    for (const product of page.products) {
      const english = canonicalKeys(product.model).map(key => englishByKey.get(key)).find(Boolean);
      const spec = overlay[product.path];
      if (!english) continue;

      const torque = spec?.torque ?? null;
      const force = spec?.force ?? null;
      const summary = torque
        ? `扭矩 ${formatRange(torque.min, torque.max, torque.unit)}`
        : force
          ? `操作力 ${formatRange(force.min, force.max, force.unit)}`
          : "扭矩可定制,支持按应用调校";

      const images = (parseJson(english.images) ?? [])
        .map(item => (typeof item === "string" ? { url: item } : item))
        .map(item => (item?.url ? { url: existingImage(item.url), alt: item.alt ?? product.model } : null))
        .filter(item => item?.url)
        .map(item => ({ url: item.url, alt: item.alt }));

      const heroImage = existingImage(english.image);
      if (images.length === 0) {
        images.push({ url: heroImage ?? product.image, alt: product.model });
      }

      const materials = (parseJson(english.materials) ?? [])
        .map(item => ({
          part: translatePart(item.part ?? ""),
          material: translateMaterial(item.material ?? ""),
        }))
        .filter(item => item.part && item.material);

      const applications = [...new Set((parseJson(english.applications) ?? []).map(translateApplication))];

      const durability = parseJson(english.durability);

      const rawCharts = parseJson(english.performance_charts) ?? {};
      const performanceCharts = {
        rotation: rawCharts.rotation_curve ?? null,
        temperature: rawCharts.temperature_curve ?? null,
      };

      const rawVariants = parseJson(english.variants);
      const variants = rawVariants?.variants?.length
        ? {
            variants: rawVariants.variants,
            rows: (rawVariants.rows ?? []).map(row => ({
              param: translateVariantParam(row.param),
              values: row.values,
            })),
          }
        : null;

      products[product.path] = {
        slug: english.slug,
        categoryId: category.id,
        model: product.model,
        name: `${product.model} ${category.label}`,
        summary,
        images,
        characteristics: (parseJson(english.characteristics) ?? []).map(translateCharacteristic),
        torque,
        force,
        hardTorque: english.hard_torque || null,
        hardForce: english.hard_force || null,
        soundType: translateSound(english.sound_type),
        bufferDirection: translateDirection(english.buffer_direction),
        assemblyMethod: spec?.mounting ?? translateAssembly(english.assembly_method),
        durability: durability?.cycles ? { cycles: Number(durability.cycles) } : null,
        specifications: spec?.specs ?? [],
        materials,
        applications,
        dimensionDrawing: existingImage(english.dimension_drawing),
        performanceCharts:
          existingImage(performanceCharts.rotation) || existingImage(performanceCharts.temperature)
            ? { rotation: existingImage(performanceCharts.rotation), temperature: existingImage(performanceCharts.temperature) }
            : null,
        variants,
      };
      paths.push(product.path);
    }
  }
}

writeFileSync(outPath, JSON.stringify(products, null, 2) + "\n");
writeFileSync(pathsPath, JSON.stringify(paths, null, 2) + "\n");

const withDrawing = Object.values(products).filter(item => item.dimensionDrawing).length;
const withCharts = Object.values(products).filter(item => item.performanceCharts).length;
const withMaterials = Object.values(products).filter(item => item.materials.length > 0).length;
console.log(
  `products: ${paths.length} | drawings: ${withDrawing} | charts: ${withCharts} | materials: ${withMaterials}`
);
const missing = catalog.flatMap(category =>
  category.pages.flatMap(page => page.products.filter(product => !products[product.path]).map(product => product.model))
);
console.log(`unmatched (${missing.length}): ${missing.join(" | ")}`);
