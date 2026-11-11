// 把散落的任意字号统一到 5 档 token。
// 运行: node scripts/codemod-font-sizes.mjs            → 只预览
//       node scripts/codemod-font-sizes.mjs --write    → 实际改写

import { globSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const write = process.argv.includes("--write");
const root = resolve(import.meta.dirname, "..");

// 详情页与列表卡片手工精修，跳过程序化替换
const SKIP = [
  "src/components/live-site/product-detail.tsx",
  "src/components/live-site/product-card.tsx",
  "src/components/admin/",
  "src/app/admin/",
];

const RULES = [
  [/text-\[(?:9|9\.5|10|10\.5|11|11\.5)px\]/g, "text-micro"],
  [/text-\[(?:12|12\.5|13|13\.5)px\]/g, "text-caption"],
  [/text-\[(?:14|14\.5)px\]/g, "text-body"],
  [/\btext-sm\b/g, "text-body"],
  [/text-\[(?:15|15\.5|16)px\]/g, "text-body-lg"],
  [/\btext-base\b/g, "text-body-lg"],
];

const files = globSync("src/**/*.{ts,tsx}", { cwd: root }).filter(
  file => !SKIP.some(skip => file === skip || file.startsWith(skip)),
);

let changedFiles = 0;
let totalHits = 0;

for (const file of files) {
  const path = resolve(root, file);
  const original = readFileSync(path, "utf8");
  let next = original;
  let hits = 0;

  for (const [pattern, replacement] of RULES) {
    next = next.replace(pattern, () => {
      hits += 1;
      return replacement;
    });
  }

  if (hits === 0) continue;
  changedFiles += 1;
  totalHits += hits;
  console.log(`${write ? "改写" : "预览"} ${file}: ${hits}`);
  if (write) writeFileSync(path, next);
}

console.log(`\n${write ? "已改写" : "预计改写"} ${changedFiles} 个文件，共 ${totalHits} 处`);
if (!write) console.log("加上 --write 才会写入");
