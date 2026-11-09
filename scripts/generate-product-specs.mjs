// 从英文站导出数据生成中文产品的扭矩/力值/规格叠加层。
// 运行: node scripts/generate-product-specs.mjs
// 输出: src/content/live-site/product-specs.json(提交到仓库,构建期不依赖英文站)

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalKeys } from "./lib/model-keys.mjs";

const root = resolve(import.meta.dirname, "..");
const enPath = resolve(root, "../teao-website/data/products-export.json");
const cnPath = resolve(root, "src/content/live-site/categories.json");
const outPath = resolve(root, "src/content/live-site/product-specs.json");

const en = JSON.parse(readFileSync(enPath, "utf8"));
const cn = JSON.parse(readFileSync(cnPath, "utf8"));

const enIndex = new Map();
for (const product of en) {
  for (const key of canonicalKeys(product.model).concat(canonicalKeys(product.name))) {
    if (key && !enIndex.has(key)) enIndex.set(key, product);
  }
}

const MOUNTING = [
  [/screw/i, "螺钉"],
  [/snap/i, "卡扣"],
  [/bolt/i, "螺栓"],
  [/press|insert/i, "压入"],
  [/clip/i, "夹持"],
];

const SPEC_LABELS = new Map([
  ["尺寸", "尺寸"],
  ["size", "尺寸"],
  ["Teeth", "齿数"],
  ["Module", "模数"],
  ["Component module", "模数"],
  ["Pressure Angle", "压力角"],
  ["Outer Diameter", "外径"],
  ["Total Height", "高度"],
  ["Total Length", "长度"],
  ["Total Width", "宽度"],
  ["Stroke", "有效行程"],
  ["行程", "有效行程"],
  ["Force", "操作力"],
  ["操作力", "操作力"],
]);

function toMounting(value) {
  if (!value) return null;
  for (const [pattern, label] of MOUNTING) if (pattern.test(value)) return label;
  return null;
}

/** "尺寸:Φ10.4" / "Size：Φ16" -> { label, value } */
function parseSpec(raw) {
  const text = String(raw ?? "").trim();
  const match = text.match(/^([^:：]+)[:：]\s*(.+)$/);
  if (!match) return null;
  return { label: match[1].trim(), value: match[2].trim() };
}

function parseForce(value) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)\s*(?:[~～-]\s*(\d+(?:\.\d+)?))?\s*N/i);
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2] ?? match[1]);
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max, unit: "N" } : null;
}

/** 把英文单位统一成中文展示口径;kgf·cm 必须 ×1000 才能换算成 gf·cm。 */
function normalizeTorque(torque) {
  if (torque?.min == null || torque?.max == null) return { torque: null, force: null };
  const unit = String(torque.unit ?? "").toLowerCase().replace(/\s+/g, "");
  const min = Number(torque.min);
  const max = Number(torque.max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { torque: null, force: null };

  if (unit === "n") return { torque: null, force: { min, max, unit: "N" } };
  if (unit === "kgf.cm" || unit === "kgf·cm") {
    return { torque: { min: min * 1000, max: max * 1000, unit: "gf·cm" }, force: null };
  }
  return { torque: { min, max, unit: "gf·cm" }, force: null };
}

const output = {};
let torqueCount = 0;
let forceCount = 0;
let unmatched = [];

for (const category of cn) {
  for (const page of category.pages) {
    for (const product of page.products) {
      const match = canonicalKeys(product.model).map(key => enIndex.get(key)).find(Boolean);

      const chips = [];
      const seen = new Set();
      const pushChip = chip => {
        if (!chip || seen.has(chip.label)) return;
        seen.add(chip.label);
        chips.push(chip);
      };

      for (const spec of product.specifications ?? []) pushChip(parseSpec(spec));

      let torque = null;
      let force = null;
      let mounting = null;

      if (match) {
        const normalized = normalizeTorque(match.扭矩);
        torque = normalized.torque;
        force = normalized.force;
        mounting = toMounting(match.安装方式);
        if (!force) {
          force = parseForce(match.规格?.["操作力"])
            ?? parseForce(match.规格?.Force)
            ?? parseForce(match.硬力值)
            ?? parseForce(match.力值范围);
        }
        if (match.声音类型 && category.id === "latch") {
          pushChip({ label: "声音", value: match.声音类型 === "silent" ? "静音" : "有声" });
        }

        for (const [rawLabel, rawValue] of Object.entries(match.规格 ?? {})) {
          const label = SPEC_LABELS.get(rawLabel) ?? SPEC_LABELS.get(rawLabel.toLowerCase());
          if (label && rawValue && !seen.has(label)) pushChip({ label, value: String(rawValue) });
        }
      }

      pushChip(mounting ? { label: "安装方式", value: mounting } : null);

      if (!match) unmatched.push(product.model);
      if (torque) torqueCount++;
      if (force) forceCount++;

      output[product.path] = { model: product.model, torque, force, mounting, specs: chips };
    }
  }
}

writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");

const total = Object.keys(output).length;
console.log(`products: ${total} | torque: ${torqueCount} | force: ${forceCount} | no data: ${total - torqueCount - forceCount}`);
console.log(`unmatched (${unmatched.length}): ${unmatched.join(" | ")}`);
