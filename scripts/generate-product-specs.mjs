// 从英文站导出数据生成中文产品的扭矩/力值/规格叠加层。
// 运行: node scripts/generate-product-specs.mjs
// 输出: src/content/live-site/product-specs.json(提交到仓库,构建期不依赖英文站)

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const enPath = resolve(root, "../teao-website/data/products-export.json");
const cnPath = resolve(root, "src/content/live-site/categories.json");
const outPath = resolve(root, "src/content/live-site/product-specs.json");

const en = JSON.parse(readFileSync(enPath, "utf8"));
const cn = JSON.parse(readFileSync(cnPath, "utf8"));

/** "RD-T069 / RD-V069" -> ["RDT069","RDV069"] */
function modelKeys(value) {
  return (String(value ?? "").toUpperCase().replace(/\s+/g, "").match(/RD-?[A-Z0-9]+/g) ?? [])
    .map(token => token.replace(/-/g, ""));
}

// 同一产品的左右/方向变体归并到主型号;不做 RD-T038A -> RD-T038 这类跨型号猜测。
const ALIASES = new Map([
  ["RD10L", "RD10"],
  ["RD10R", "RD10"],
]);

function canonicalKeys(value) {
  return modelKeys(value).map(key => ALIASES.get(key) ?? key);
}

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

function normalizeUnit(unit) {
  const text = String(unit ?? "").toLowerCase();
  if (text.includes("n") && !text.includes("gf") && !text.includes("cm")) return "N";
  return "gf·cm";
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
        if (match.扭矩?.min != null && match.扭矩?.max != null) {
          const unit = normalizeUnit(match.扭矩.unit);
          if (unit === "N") force = { min: Number(match.扭矩.min), max: Number(match.扭矩.max), unit };
          else torque = { min: Number(match.扭矩.min), max: Number(match.扭矩.max), unit };
        }
        mounting = toMounting(match.安装方式);
        if (!force) force = parseForce(match.规格?.["操作力"]) ?? parseForce(match.力值范围);
        if (!force && match.声音类型 && category.id === "latch") {
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
