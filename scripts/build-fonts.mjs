// 生成站点用的 MiSans VF 子集字体（woff2 分片 + CSS）。
// 运行: node scripts/build-fonts.mjs [--dry-run]
//
// 产物:
//   public/fonts/misans/core/*.woff2  全站共用字（导航、页面文案、产品数据）
//   public/fonts/misans/news/*.woff2  仅新闻正文出现的生僻字
//   src/app/fonts.css                 合并后的 @font-face 声明
//
// 为什么要拆成两组:
//   @font-face 的 unicode-range 决定浏览器下载哪一片。若把新闻用字和公共用字
//   混在一起切分，普通页面也会命中大半分片，单页从 ~330KB 涨到 ~690KB。

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { resolve } from "node:path";
import { fontSplit } from "cn-font-split";
import subsetFont from "subset-font";

const dryRun = process.argv.includes("--dry-run");
const root = resolve(import.meta.dirname, "..");
const sourceFont = resolve(root, "node_modules/@fontpkg/mi-sans-vf/MiSans VF.ttf");
const outRoot = resolve(root, "public/fonts/misans");
const cssTarget = resolve(root, "src/app/fonts.css");

const NOTICE = `MiSans
Copyright © 2020-2023 Beijing Xiaomi Mobile Software Co., Ltd. All Rights Reserved.

MiSans 由小米发布，允许免费商业使用。字体源文件经场景子集化后随本站分发，
仅包含站点实际使用的字符。

原始字体: MiSans VF v4.003 (Hanyi Fonts / Xiaomi)
源文件来源: npm 包 @fontpkg/mi-sans-vf
生成脚本: scripts/build-fonts.mjs
`;

const BASE_TEXT =
  " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
  "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" +
  "·—…“”‘’《》〈〉「」『』【】（），。、；：？！％℃Φμ×÷±≤≥→←↑↓•※";

if (!existsSync(sourceFont)) {
  console.error(`缺少源字体: ${sourceFont}\n请先运行 npm i -D @fontpkg/mi-sans-vf`);
  process.exit(1);
}

/* ── 1. 收集字符集 ─────────────────────────────── */

const NEWS_FILE = "src/content/live-site/news.generated.json";

const readFiles = patterns => {
  const files = globSync(patterns, { cwd: root })
    .filter(file => !file.includes("/admin/") && file !== NEWS_FILE);
  return files.map(file => readFileSync(resolve(root, file), "utf8")).join("");
};

const coreText = BASE_TEXT + readFiles([
  "src/components/**/*.tsx",
  "src/app/**/*.tsx",
  "src/lib/**/*.ts",
  "src/content/live-site/*.json",
]);

const newsText = readFileSync(resolve(root, NEWS_FILE), "utf8");

const isFontChar = char => char.codePointAt(0) > 32;
const coreChars = new Set([...coreText].filter(isFontChar));
const newsChars = new Set([...newsText].filter(char => isFontChar(char) && !coreChars.has(char)));

const coreList = [...coreChars];
const newsList = [...newsChars];

console.log(`核心字: ${coreList.length} | 新闻独有字: ${newsList.length}`);

if (dryRun) {
  console.log("dry-run：未写入任何文件");
  process.exit(0);
}

/* ── 2. 生成分片 ───────────────────────────────── */

/**
 * 先用 subset-font 做字符集子集，再交给 cn-font-split 切片。
 * 直接给 cn-font-split 传 subsets 时会连整包剩余字符一起输出。
 */
async function buildGroup(name, chars) {
  const outDir = resolve(outRoot, name);
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const text = chars.join("");
  const master = await subsetFont(readFileSync(sourceFont), text, { targetFormat: "woff2" });

  await fontSplit({
    input: new Uint8Array(master),
    outDir,
    chunkSize: 120 * 1024,
    css: { fontFamily: "MiSans VF", fontDisplay: "swap", compress: true, commentUnicodes: false },
    testHtml: false,
    reporter: false,
    silent: true,
    renameOutputFont: "[hash:6].[ext]", // 内容哈希命名，配合 immutable 长缓存
  });

  const cssFile = readdirSync(outDir).find(item => item.endsWith(".css"));
  if (!cssFile) throw new Error(`${name}: 未生成 CSS`);
  const css = readFileSync(resolve(outDir, cssFile), "utf8").replace(
    /url\(["']?\.?\/?([^)"']+\.woff2)["']?\)/g,
    `url("/fonts/misans/${name}/$1")`,
  );

  const files = readdirSync(outDir).filter(item => item.endsWith(".woff2"));
  return { css, files: files.length, bytes: files.reduce((sum, file) => sum + readFileSync(resolve(outDir, file)).length, 0) };
}

const groups = [
  ["core", coreList],
  ["news", newsList],
];

if (existsSync(outRoot)) rmSync(outRoot, { recursive: true, force: true });

const parts = [];
for (const [name, chars] of groups) {
  if (!chars.length) continue;
  const result = await buildGroup(name, chars);
  parts.push(result.css);
  console.log(`${name}: ${result.files} 片 / ${(result.bytes / 1024).toFixed(0)}KB`);
}

writeFileSync(cssTarget, `/* 由 scripts/build-fonts.mjs 生成，请勿手改 */\n${parts.join("\n")}\n`);
writeFileSync(resolve(outRoot, "NOTICE.txt"), NOTICE);
console.log(`已写入 ${cssTarget}`);

// cn-font-split 的 Rust FFI 线程会阻止进程退出
process.exit(0);
