import { liveCatalog } from "@/lib/live-catalog";
import productPaths from "@/content/live-site/product-paths.json";
import { getPublishedNews } from "@/lib/news-store";
import { contact } from "@/content/live-site/contact";

const BASE = "https://www.chinateao.com";

export const dynamic = "force-dynamic";

export async function GET() {
  const news = await getPublishedNews();

  const lines: string[] = [
    "# 特澳 TEAO",
    "",
    "> 东莞市特澳电子科技有限公司,阻尼器与锁扣机构定制源头厂家。IATF 16949 认证,8000 万件年产能,支持扭矩、方向与安装结构按图定制。",
    "",
    "适用范围:汽车内外饰、家居、办公设备、工业设备。常用扭矩单位:gf·cm、N·m、kgf·cm。",
    "",
    `联系:${contact.primaryName} ${contact.primaryMobile} / 微信 ${contact.wechat} / ${contact.email}`,
    `地址:${contact.address}`,
    "",
    "## 核心页面",
    `- [首页](${BASE}/):产品、应用、工厂与质量概览`,
    `- [产品中心](${BASE}/products/):全部产品型号`,
    `- [应用案例](${BASE}/applications/):汽车内外饰、家居、办公设备、工业设备`,
    `- [质量控制](${BASE}/quality-control/):IATF 16949、100% 扭矩与外观检测`,
    `- [常见问题](${BASE}/faq/):定制、选型、打样、交期与质量问答`,
    `- [新闻](${BASE}/news/):公司动态与工程进展`,
    `- [扭矩换算](${BASE}/convert/):九种扭矩单位在线换算`,
    `- [关于我们](${BASE}/about-us/)`,
    `- [联系我们](${BASE}/contacts/)`,
    "",
    "## 产品分类与型号",
  ];

  for (const category of liveCatalog) {
    lines.push("", `### ${category.label}`, category.description, "");
    const products = category.pages
      .flatMap(page => page.products)
      .filter(product => productPaths.includes(product.path));
    for (const product of products) {
      lines.push(`- ${product.model}: ${product.title.slice(0, 60)} — ${BASE}${encodeURI(product.path)}`);
    }
  }

  lines.push("", "## 新闻", "");
  for (const article of news) {
    lines.push(`- ${article.publishedAt} ${article.title} — ${BASE}/news/${encodeURI(article.slug)}.html`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
