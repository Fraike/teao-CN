// 请求全部旧商品 URL 和分类分页 URL，断言 200 与型号文本。
// 运行: node scripts/verify-legacy-urls.mjs http://localhost:3000

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const root = resolve(import.meta.dirname, "..");
const categories = JSON.parse(readFileSync(resolve(root, "src/content/live-site/categories.json"), "utf8"));
const products = JSON.parse(readFileSync(resolve(root, "src/content/live-site/products.json"), "utf8"));

const targets = [];
for (const category of categories) {
  for (const page of category.pages) {
    targets.push({ url: page.path, label: `${category.id} page ${page.number}`, mustContain: category.label });
    for (const product of page.products) {
      const detail = products[product.path];
      targets.push({ url: product.path, label: product.model, mustContain: (detail?.model || product.model).split("/")[0].trim() });
    }
  }
}

let failed = 0;
for (const target of targets) {
  const url = base + encodeURI(target.url);
  try {
    const response = await fetch(url, { redirect: "manual" });
    const text = response.status === 200 ? await response.text() : "";
    const ok = response.status === 200 && (!target.mustContain || text.includes(target.mustContain));
    if (!ok) {
      failed += 1;
      console.error(`FAIL ${response.status} ${target.label} ${target.url}`);
    } else {
      console.log(`OK   ${target.label} ${target.url}`);
    }
  } catch (error) {
    failed += 1;
    console.error(`ERROR ${target.label} ${target.url}`, error.message);
  }
}

console.log(`\n${targets.length - failed}/${targets.length} 通过`);
process.exit(failed ? 1 : 0);
