// 从 chinateao-export 导入真实新闻:正文块 + 图片,输出 news.generated.json。
// 运行: node scripts/generate-news-content.mjs
// 依赖: chinateao-export/data/all_content.json 与 chinateao-export/images/news/

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const exportRoot = resolve(root, "chinateao-export");
const sourceJson = resolve(exportRoot, "data/all_content.json");
const sourceImages = resolve(exportRoot, "images/news");
const outputJson = resolve(root, "src/content/live-site/news.generated.json");
const publicNews = resolve(root, "public/images/news");

const hasMagick = (() => {
  try {
    execFileSync("magick", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
function decode(text) {
  return String(text)
    .replace(/&([a-zA-Z#0-9]+);/g, (match, key) => entities[key] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(html) {
  return decode(String(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function flattenSrc(src) {
  return String(src)
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^\/+/, "")
    .replace(/[^A-Za-z0-9._-]/g, "_");
}

function isUsable(src) {
  return Boolean(src) && !/spacer\.gif$/i.test(src) && !/^data:image\//i.test(src);
}

/** 把 UEditor 富文本解析成受控块。 */
function parseBlocks(html) {
  const cleaned = String(html).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  const blocks = [];
  const pattern = /<(h2|h3|h4|p|div|blockquote|ul)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = pattern.exec(cleaned)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];

    if (tag === "ul") {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map(item => stripTags(item[1]))
        .filter(Boolean);
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    const images = [...inner.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
      .map(m => m[1])
      .filter(isUsable);
    for (const src of images) blocks.push({ type: "img", src });

    const text = stripTags(inner.replace(/<img[^>]*>/gi, " "));
    if (!text) continue;
    if (tag === "h2" || tag === "h4") blocks.push({ type: "h2", text });
    else if (tag === "h3") blocks.push({ type: "h3", text });
    else if (tag === "blockquote") blocks.push({ type: "quote", text });
    else blocks.push({ type: "p", text });
  }

  // 合并相邻的重复图片
  const deduped = [];
  for (const block of blocks) {
    const prev = deduped[deduped.length - 1];
    if (block.type === "img" && prev?.type === "img" && prev.src === block.src) continue;
    deduped.push(block);
  }
  return deduped;
}

function categorize(title) {
  if (/IATF|质量|检测|全检|审核|品控|PPM|测试报告|测试数据/i.test(title)) {
    return { category: "quality", categoryLabel: "质量" };
  }
  if (/发布|产品|阻尼|选型|原理|结构|焊接|注塑|生产线|产能|研发/i.test(title)) {
    return { category: "engineering", categoryLabel: "工程" };
  }
  return { category: "company", categoryLabel: "公司动态" };
}

function slugFromFrontUrl(frontUrl) {
  return String(frontUrl).replace(/^\/?news\//, "").replace(/\.html$/i, "");
}

function convertImage(src, destination) {
  const flat = flattenSrc(src);
  const sourceFile = resolve(sourceImages, flat);
  if (!existsSync(sourceFile)) return null;

  mkdirSync(resolve(destination, ".."), { recursive: true });
  const target = destination + ".webp";
  if (hasMagick) {
    try {
      execFileSync("magick", [sourceFile, "-auto-orient", "-resize", "1280x1280>", "-quality", "82", target], { stdio: "ignore" });
      const [width, height] = execFileSync("magick", ["identify", "-format", "%w %h", target], { encoding: "utf8" })
        .trim().split(" ").map(Number);
      return { file: target, width, height };
    } catch {
      /* fall through */
    }
  }
  const extension = sourceFile.slice(sourceFile.lastIndexOf("."));
  copyFileSync(sourceFile, destination + extension);
  return { file: destination + extension, width: 1280, height: 720 };
}

const data = JSON.parse(readFileSync(sourceJson, "utf8"));
const articles = [];
const failures = [];

for (const item of data.news ?? []) {
  const html = item.rich?.["info[content]"] ?? "";
  if (!html) {
    failures.push(`${item.id} ${item.title}: 无正文`);
    continue;
  }

  const slug = slugFromFrontUrl(item.front_url);
  const folderName = String(item.id);
  const blocks = parseBlocks(html);

  // 图片落盘:cover + 正文图
  const imageIndex = new Map();
  let cursor = 0;
  const localize = (src, name) => {
    if (imageIndex.has(src)) return imageIndex.get(src);
    const converted = convertImage(src, resolve(publicNews, folderName, name));
    const value = converted
      ? {
          src: "/" + converted.file.slice(root.length + 1).replace(/^public\//, ""),
          width: converted.width,
          height: converted.height,
        }
      : { src: "/images/og/default.jpg", width: 1200, height: 630 };
    imageIndex.set(src, value);
    return value;
  };

  const coverSource = item.thumb || blocks.find(b => b.type === "img")?.src;
  const cover = coverSource ? localize(coverSource, "cover").src : "/images/og/default.jpg";

  const localizedBlocks = [];
  let coverConsumed = false;
  for (const block of blocks) {
    if (block.type === "img") {
      if (!coverConsumed && block.src === coverSource) {
        coverConsumed = true;
        continue;
      }
      const local = localize(block.src, `img-${String(++cursor).padStart(2, "0")}`);
      localizedBlocks.push({ type: "img", src: local.src, width: local.width, height: local.height, alt: item.title });
    } else {
      localizedBlocks.push(block);
    }
  }

  const firstParagraph = localizedBlocks.find(b => b.type === "p")?.text ?? item.title;
  const summary = firstParagraph.length > 90 ? firstParagraph.slice(0, 90) + "…" : firstParagraph;
  const { category, categoryLabel } = categorize(item.title);

  articles.push({
    id: item.id,
    slug,
    category,
    categoryLabel,
    title: item.title,
    summary,
    cover,
    publishedAt: String(item.pubtime ?? "").slice(0, 10),
    blocks: localizedBlocks,
  });
}

articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : b.id - a.id));

writeFileSync(outputJson, JSON.stringify(articles, null, 2) + "\n");

const withImages = articles.filter(a => a.blocks.some(b => b.type === "img")).length;
console.log(`articles: ${articles.length} | with inline images: ${withImages} | failures: ${failures.length}`);
if (failures.length) console.log(failures.join("\n"));
