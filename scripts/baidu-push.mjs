// 百度主动推送批量脚本。
// 默认 dry-run；确认后加 --apply。
// 运行: node --env-file=.env.local scripts/baidu-push.mjs --apply --limit 10

const SITE_URL = "https://www.chinateao.com";
// 百度 API 的 site 参数要求不带协议；带 https:// 会返回 site init fail。
const SITE_PARAM = "www.chinateao.com";
const ENDPOINT = "http://data.zz.baidu.com/urls";
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const token = (process.env.BAIDU_PUSH_TOKEN || "").trim();
const limitArg = args.find(arg => arg.startsWith("--limit="));
const limit = limitArg ? Math.max(0, Number(limitArg.split("=")[1])) : 5;
const sitemapArg = args.find(arg => arg.startsWith("--sitemap="));
const sitemapUrl = sitemapArg?.slice("--sitemap=".length) || `${SITE_URL}/sitemap.xml`;

if (!token) {
  console.error("缺少 BAIDU_PUSH_TOKEN。请用 node --env-file=.env.local 运行，或在环境变量中设置。");
  process.exit(1);
}

const xml = await (await fetch(sitemapUrl)).text();
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]))];
const selected = limit > 0 ? urls.slice(0, limit) : urls;

console.log(`sitemap: ${urls.length} 条，本次选择 ${selected.length} 条`);
console.log(selected.join("\n"));
if (!apply) {
  console.log("\ndry-run: 未提交。确认后加 --apply。");
  process.exit(0);
}

const response = await fetch(
  `${ENDPOINT}?site=${encodeURIComponent(SITE_PARAM)}&token=${encodeURIComponent(token)}`,
  {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: selected.join("\n"),
  },
);
const text = await response.text();
console.log(`HTTP ${response.status}`);
console.log(text);
process.exit(response.ok ? 0 : 1);
