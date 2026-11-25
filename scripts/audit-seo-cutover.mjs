// 对比老站 sitemap 与新站 sitemap/重定向覆盖情况。
// 运行: node scripts/audit-seo-cutover.mjs [new-base] [--old-sitemap=/path/to/old-sitemap.xml]
// 默认 new-base=http://localhost:3000，老 sitemap 从 https://www.chinateao.com/sitemap.xml 读取。

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const newBase = (args.find(arg => !arg.startsWith("--")) || "http://localhost:3000").replace(/\/$/, "");
const oldSitemapArg = args.find(arg => arg.startsWith("--old-sitemap="));
const oldSitemapUrl = "https://www.chinateao.com/sitemap.xml";

const locs = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const pathOf = raw => decodeURIComponent(new URL(raw).pathname);

const oldXml = oldSitemapArg
  ? readFileSync(oldSitemapArg.slice("--old-sitemap=".length), "utf8")
  : await (await fetch(oldSitemapUrl)).text();
const newXml = await (await fetch(`${newBase}/sitemap.xml`)).text();
const oldUrls = [...new Set(locs(oldXml))];
const newPaths = new Set(locs(newXml).map(pathOf));

console.log(`老站 sitemap: ${oldUrls.length} 条`);
console.log(`新站 sitemap: ${newPaths.size} 条`);
console.log(`新站 /products/ 在 sitemap: ${newPaths.has("/products/") ? "是" : "否"}`);
console.log("");

const productsHtml = await (await fetch(`${newBase}/products/`)).text();
if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(productsHtml)) {
  console.log("⚠️ /products/ 仍包含 noindex");
} else {
  console.log("✓ /products/ 未设置 noindex");
}

const redirectStatuses = new Set([301, 307, 308]);
const rows = [];
for (const raw of oldUrls) {
  const path = pathOf(raw);
  let status = "ERR";
  let location = "";
  let targetStatus = "";
  try {
    const response = await fetch(newBase + encodeURI(path), { redirect: "manual" });
    status = response.status;
    location = response.headers.get("location") ?? "";
    if (redirectStatuses.has(Number(status)) && location) {
      const destination = location.startsWith("http") ? location : newBase + location;
      const target = await fetch(destination, { redirect: "manual" });
      targetStatus = target.status;
    }
  } catch (error) {
    location = error.message;
  }
  rows.push({ path, status, location, targetStatus, inSitemap: newPaths.has(path) });
}

const count = status => rows.filter(row => String(row.status) === String(status)).length;
const redirects = rows.filter(row => redirectStatuses.has(Number(row.status)));
console.log(`状态分布: 200=${count(200)} 301/308=${redirects.length} 404=${count(404)} 其他=${rows.length - count(200) - redirects.length - count(404)}`);
console.log("");
console.log("状态   目标   新sitemap  老路径  ->  新位置");
for (const row of rows) {
  console.log(`${row.status}\t${row.targetStatus || "-"}\t${row.inSitemap ? "是" : "否"}\t${row.path}\t-> ${row.location}`);
}

const problems = rows.filter(row => String(row.status) === "404" || String(row.status) === "ERR" || String(row.targetStatus) === "404" || String(row.targetStatus) === "ERR");
if (!newPaths.has("/products/")) problems.push({ path: "/products/", status: "SITEMAP_MISSING", location: "" });
if (problems.length) {
  console.log(`\n❌ 仍有 ${problems.length} 个问题，上线前需要处理。`);
  process.exit(1);
}
console.log("\n✅ 老 sitemap URL 已全部覆盖，/products/ 已开放收录。");
