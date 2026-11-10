// 用 chinateao-export 里更高分辨率的产品图替换站内 main.webp。
// 运行: node scripts/upgrade-product-images.mjs
// 规则:候选图宽度 ≥ 600 且面积 > 当前 2 倍;旧图备份到 trash_review/product-images-old/。

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalKeys } from "./lib/model-keys.mjs";

const root = resolve(import.meta.dirname, "..");
const exportRoot = resolve(root, "chinateao-export");
const content = JSON.parse(readFileSync(resolve(exportRoot, "data/all_content.json"), "utf8"));
const catalog = JSON.parse(readFileSync(resolve(root, "src/content/live-site/categories.json"), "utf8"));
const generated = JSON.parse(readFileSync(resolve(root, "src/content/live-site/products.json"), "utf8"));
const backupDir = resolve(root, "trash_review/product-images-old");

function dimension(file) {
  try {
    return execFileSync("magick", ["identify", "-format", "%w %h", file], { encoding: "utf8" })
      .trim().split(" ").map(Number);
  } catch {
    return [0, 0];
  }
}

const flat = value => String(value)
  .replace(/^https?:\/\/[^/]+\//, "")
  .replace(/^\/+/, "")
  .replace(/[^A-Za-z0-9._-]/g, "_");

const exportIndex = new Map();
for (const product of content.products ?? []) {
  for (const key of canonicalKeys(product.title).concat(canonicalKeys(product.front_url))) {
    if (key && !exportIndex.has(key)) exportIndex.set(key, product);
  }
}

const upgraded = [];
const skipped = [];

for (const category of catalog) {
  for (const page of category.pages) {
    for (const product of page.products) {
      const record = generated[product.path];
      if (!record) continue;
      const target = resolve(root, "public/images/products", record.slug, "main.webp");
      if (!existsSync(target)) continue;

      const source = canonicalKeys(product.model).map(key => exportIndex.get(key)).find(Boolean);
      if (!source) continue;

      const candidates = [
        source.thumb,
        ...String(source.rich?.["info[content]"] ?? "").matchAll(/<img[^>]+src=["']([^"']+)/g),
      ]
        .map(item => (typeof item === "string" ? item : item[1]))
        .filter(item => item && !/spacer\.gif$/i.test(item))
        .map(item => resolve(exportRoot, "images/product", flat(item)))
        .filter(file => existsSync(file));

      // 只用无水印原图;watermark 图宁可跳过,也不放进站内。
      let best = null;
      for (const file of candidates) {
        if (file.includes("/images/product/data_watermark_")) continue;
        const [width, height] = dimension(file);
        if (!width || !height) continue;
        const area = width * height;
        if (!best || area > best.area) best = { file, width, height, area };
      }

      const [currentWidth, currentHeight] = dimension(target);
      if (!best || best.width < 600 || best.area <= currentWidth * currentHeight * 2) {
        skipped.push(`${product.model} (${currentWidth}x${currentHeight} 保持)`);
        continue;
      }

      const backup = resolve(backupDir, record.slug);
      mkdirSync(backup, { recursive: true });
      const backupFile = resolve(backup, "main.webp");
      if (!existsSync(backupFile)) copyFileSync(target, backupFile);

      execFileSync("magick", [best.file, "-auto-orient", "-resize", "1000x1000>", "-quality", "84", target], { stdio: "ignore" });
      upgraded.push(`${product.model} ${currentWidth}x${currentHeight} → ${best.width}x${best.height}`);
      writeFileSync(resolve(root, "trash_review/product-images-old", "upgrade-log.txt"), upgraded.join("\n") + "\n");
    }
  }
}

console.log(`upgraded: ${upgraded.length}`);
console.log(upgraded.join("\n"));
console.log(`skipped: ${skipped.length}`);
