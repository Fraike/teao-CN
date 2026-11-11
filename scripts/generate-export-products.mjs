// 用 chinateao-export 补全英文站缺失的型号,生成产品详情内容与规格叠加。
// 运行: node scripts/generate-export-products.mjs

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalKeys } from "./lib/model-keys.mjs";

const root = resolve(import.meta.dirname, "..");
const exportRoot = resolve(root, "chinateao-export");
const catalog = JSON.parse(readFileSync(resolve(root, "src/content/live-site/categories.json"), "utf8"));
const productsPath = resolve(root, "src/content/live-site/products.json");
const pathsPath = resolve(root, "src/content/live-site/product-paths.json");
const specsPath = resolve(root, "src/content/live-site/product-specs.json");
const content = JSON.parse(readFileSync(resolve(exportRoot, "data/all_content.json"), "utf8"));

const products = JSON.parse(readFileSync(productsPath, "utf8"));
const paths = JSON.parse(readFileSync(pathsPath, "utf8"));
const specs = JSON.parse(readFileSync(specsPath, "utf8"));
// 英文站已有(已提交)的记录不动;只重新生成本脚本产出的补全记录
const committed = new Set(Object.keys(JSON.parse(
  execFileSync("git", ["show", "HEAD:src/content/live-site/products.json"], { cwd: root, encoding: "utf8" })
)));

const flat = value => String(value)
  .replace(/^https?:\/\/[^/]+\//, "")
  .replace(/^\/+/, "")
  .replace(/[^A-Za-z0-9._-]/g, "_");

const exportIndex = new Map();
// 同一型号可能有多个变体页(如 RD-V088 铜轴心/无铜轴心),优先用前台路径精确匹配
const byPath = new Map();
for (const product of content.products ?? []) {
  const frontPath = String(product.front_url ?? "").replace(/^\/+/, "").trim();
  if (frontPath && !byPath.has(frontPath)) byPath.set(frontPath, product);
  for (const key of canonicalKeys(product.title).concat(canonicalKeys(product.front_url))) {
    if (key && !exportIndex.has(key)) exportIndex.set(key, product);
  }
}

function parseSpec(raw) {
  const text = String(raw ?? "").trim();
  const match = text.match(/^([^:：]+)[:：]\s*(.+)$/);
  return match ? { label: match[1].trim(), value: match[2].trim() } : null;
}

function baseSlug(model) {
  const token = (String(model).toUpperCase().match(/RD-?[A-Z0-9]+/) ?? ["product"])[0];
  return token.toLowerCase().replace(/^rd-?/, "rd-").replace(/-+/g, "-");
}

const usedSlugs = new Set(Object.values(products).map(record => record.slug));

function uniqueSlug(model) {
  const base = baseSlug(model);
  if (!usedSlugs.has(base)) { usedSlugs.add(base); return base; }
  let index = 2;
  while (usedSlugs.has(`${base}-${index}`)) index += 1;
  const slug = `${base}-${index}`;
  usedSlugs.add(slug);
  return slug;
}

function parseTorque(product) {
  const fields = product.fields ?? {};
  const min = Number(fields["info[torque]"]);
  const max = Number(fields["info[torques]"]);
  const rawUnit = String(fields["info[danwei]"] ?? "").toLowerCase();
  if (!Number.isFinite(min) || !Number.isFinite(max) || (!min && !max)) return null;
  if (rawUnit.includes("kgf")) return { min: min * 1000, max: max * 1000, unit: "gf·cm" };
  if (rawUnit.includes("gf")) return { min, max, unit: "gf·cm" };
  if (rawUnit === "n" || rawUnit.includes("n.m")) return null;
  return { min, max, unit: "gf·cm" };
}

function parseCharacteristics(product) {
  const text = String(product.rich?.["info[spec_description]"] ?? "").replace(/<[^>]+>/g, " ");
  const section = text.split(/特性/)[1] ?? "";
  const line = section.split(/应用领域|Applications/)[0].trim();
  return line
    .split(/[，,、;；]/)
    .map(item => item.trim())
    .filter(item => item && item.length <= 12)
    .slice(0, 4);
}

function pickImage(product) {
  const html = String(product.rich?.["info[content]"] ?? "");
  const images = [...html.matchAll(/<img[^>]+src=["']([^"']+)/g)].map(m => m[1]).filter(src => !/spacer\.gif$/i.test(src));
  const clean = images.find(src => src.includes("data/upload")) ?? (String(product.thumb).includes("data/upload") ? product.thumb : null);
  if (clean) return clean;
  return images[0] ?? (product.thumb || null);
}

let added = 0;

for (const category of catalog) {
  for (const page of category.pages) {
    for (const product of page.products) {
      const existing = products[product.path];
      if (existing && committed.has(product.path)) continue;

      const pagePath = String(product.path).replace(/^\/+/, "");
      const source = byPath.get(pagePath)
        ?? canonicalKeys(product.model).map(key => exportIndex.get(key)).find(Boolean);
      if (!source) continue;

      const slug = existing?.slug ?? uniqueSlug(product.model);
      const imageSrc = pickImage(source);
      const images = [];
      if (imageSrc) {
        const sourceFile = resolve(exportRoot, "images/product", flat(imageSrc));
        const targetDir = resolve(root, "public/images/products", slug);
        const targetFile = resolve(targetDir, "main.webp");
        if (existsSync(sourceFile)) {
          mkdirSync(targetDir, { recursive: true });
          try {
            execFileSync("magick", [sourceFile, "-auto-orient", "-resize", "1000x1000>", "-quality", "84", targetFile], { stdio: "ignore" });
            images.push({
              url: `/images/products/${slug}/main.webp`,
              alt: String(product.title ?? "").trim() || product.model,
            });
          } catch {
            /* skip */
          }
        }
      }

      const torque = parseTorque(source);
      const chips = (product.specifications ?? []).map(parseSpec).filter(Boolean);
      const summary = torque ? `扭矩 ${torque.min === torque.max ? torque.min : `${torque.min} – ${torque.max}`} ${torque.unit}` : "扭矩可定制,支持按应用调校";

      products[product.path] = {
        path: product.path,
        slug,
        categoryId: category.id,
        model: product.model,
        name: String(product.title ?? "").trim() || `${product.model} ${category.label}`,
        summary,
        images,
        characteristics: parseCharacteristics(source),
        torque,
        force: null,
        hardTorque: null,
        hardForce: null,
        soundType: null,
        bufferDirection: null,
        assemblyMethod: null,
        durability: null,
        specifications: chips,
        materials: [],
        applications: [],
        applicationScenarios: [],
        dimensionDrawing: null,
        performanceCharts: null,
        variants: null,
      };

      if (!paths.includes(product.path)) paths.push(product.path);
      specs[product.path] = {
        model: product.model,
        torque,
        force: null,
        mounting: null,
        specs: chips,
      };
      added += 1;
    }
  }
}

const uniquePaths = [...new Set(paths)];

writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n");
writeFileSync(pathsPath, JSON.stringify(uniquePaths, null, 2) + "\n");
writeFileSync(specsPath, JSON.stringify(specs, null, 2) + "\n");

console.log(`added: ${added} | total products: ${Object.keys(products).length} | paths: ${uniquePaths.length}`);
