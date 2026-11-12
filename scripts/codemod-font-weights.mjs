// 重排全站字重层级。
// 运行: node scripts/codemod-font-weights.mjs          → 预览
//       node scripts/codemod-font-weights.mjs --write  → 写入
//
// 规则:
//   大写小标签（eyebrow / chip label）→ font-medium (500)
//   其余重字重                     → font-semibold (600)
// 之后由人工把关键数字（统计、扭矩）恢复为 font-bold (700)。

import { globSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const write = process.argv.includes("--write");
const root = resolve(import.meta.dirname, "..");
const HEAVY = /font-(black|extrabold|bold)/g;

const files = globSync("src/**/*.tsx", { cwd: root }).filter(
  file => !file.startsWith("src/components/admin/") && !file.startsWith("src/app/admin/"),
);

let changed = 0;
let hits = 0;

for (const file of files) {
  const path = resolve(root, file);
  const original = readFileSync(path, "utf8");
  let count = 0;
  const next = original
    .split("\n")
    .map(line => {
      const replacement = line.includes("uppercase") ? "font-medium" : "font-semibold";
      return line.replace(HEAVY, () => {
        count += 1;
        return replacement;
      });
    })
    .join("\n");

  if (!count) continue;
  changed += 1;
  hits += count;
  console.log(`${write ? "改写" : "预览"} ${file}: ${count}`);
  if (write) writeFileSync(path, next);
}

console.log(`\n${write ? "已改写" : "预计改写"} ${changed} 个文件，共 ${hits} 处`);
if (!write) console.log("加上 --write 才会写入");
