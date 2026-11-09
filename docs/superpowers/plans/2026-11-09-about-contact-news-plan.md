# 子项目 C：关于/联系 URL 对齐 + 新闻栏目 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `/about-us/`、`/contacts/`、`/news/` + 3 篇新闻详情本地承接，旧 `/about`、`/contact` 301 到原站 URL，并把新闻加进导航。

**Architecture:** 沿用 catch-all 承接模式——`src/lib/live-site.ts` 增加路径常量与 `getPilotPage` 分支，`src/app/[...legacyPath]/page.tsx` 增加 4 个渲染分支与 metadata；新闻内容集中在 `src/content/live-site/news.ts`，由两个纯展示组件消费；旧的关于/联系页从 `src/app/` 移到 `src/components/live-site/` 供 catch-all 复用，`next.config.ts` 用 `statusCode: 301` 处理旧 URL。

**Tech Stack:** Next.js App Router(异步 params)、React 函数组件、Tailwind v4、lucide-react、`next/image`。

**Spec:** [docs/superpowers/specs/2026-11-09-about-contact-news-design.md](../specs/2026-11-09-about-contact-news-design.md)

## Global Constraints

- URL 原样保留：`/about-us/`、`/contacts/`、`/news/`、`/news/{slug}.html`，大小写与 `.html` 后缀不变。
- 关于/联系与新闻列表/详情均为**可索引页**：`robots: { index: true, follow: true }`，canonical 指向 `https://www.chinateao.com` + 原路径。
- 旧 `/about`、`/contact` 用 **301**（`statusCode: 301`，不是 `permanentRedirect`/`redirect`）。
- 新闻内容 1:1 翻译英文站 `teao-website/src/db/seed.ts` 的 3 篇 seed；图片用英文站同名 placeholder 图。
- 下载栏目不承接；原站 8 篇中文新闻不承接（404）。
- 新闻 JSON-LD 的 author/publisher = 公司名「东莞市特澳电子科技有限公司」（Organization），不虚构个人署名。
- 复用 `container`、`SectionHead`、`Reveal`、`Button`、design tokens。

## Review Focus

1. **`/news/` 与 `/news` 都要解析为列表页**：`getPilotPage(["news"])` 必须返回 `"news"`，不能落到 `null` 导致 404。
2. **未知新闻 slug 不能渲染**：`/news/unknown.html`、`/news/index_2.html` 必须返回 `null`（→ 404），不能误判为 `"news-article"`。
3. **旧内部链接不能残留 `/contact`、`/about`**：全站任何指向 `/contact` 的链接都会多一跳 301；完成后 grep 必须为零。
4. **导航不漏项**：Header 7 项、footer「关于」组含新闻；关于/联系指向原站 URL。
5. **sitemap 不含 `/contact`**：否则会向搜索引擎提交一个 301 URL，抵消本次可索引目标。

---

### Task 1: 新闻数据 + 路由（TDD）

**Files:**
- Create: `src/content/live-site/news.ts`
- Modify: `src/lib/live-site.ts`
- Test: `src/lib/live-site.test.ts`

**Interfaces:**
- Produces: `NewsArticle` 接口、`newsArticles: NewsArticle[]`（3 篇）、`NEWS_ARTICLE_SLUGS`、`ABOUT_PATH`/`CONTACTS_PATH`/`NEWS_PATH`、`getNewsSlug(segments): string | null`、扩展后的 `getPilotPage` 返回类型（`"about" | "contacts" | "news" | "news-article"`）。Task 4/5/6 消费。

- [ ] **Step 1: 写失败测试**

在 `src/lib/live-site.test.ts` 末尾追加：

```ts
import { getNewsSlug, ABOUT_PATH, CONTACTS_PATH, NEWS_PATH } from "./live-site";

test("about, contacts and news resolve locally with and without trailing slash", () => {
  assert.equal(getPilotPage(["about-us"]), "about");
  assert.equal(getPilotPage(["contacts"]), "contacts");
  assert.equal(getPilotPage(["news"]), "news");
  assert.equal(liveHref("/about-us/"), "/about-us/");
  assert.equal(liveHref("/contacts/"), "/contacts/");
  assert.equal(liveHref("/news/"), "/news/");
  assert.equal(ABOUT_PATH, "/about-us/");
  assert.equal(CONTACTS_PATH, "/contacts/");
  assert.equal(NEWS_PATH, "/news/");
});

test("known news articles resolve, unknown slugs and pagination do not", () => {
  assert.equal(getPilotPage(["news", "teao-expands-capacity.html"]), "news-article");
  assert.equal(getPilotPage(["news", "torque-requirements-guide.html"]), "news-article");
  assert.equal(getNewsSlug(["news", "teao-expands-capacity.html"]), "teao-expands-capacity");
  assert.equal(getPilotPage(["news", "unknown-article.html"]), null);
  assert.equal(getPilotPage(["news", "index_2.html"]), null);
  assert.equal(getPilotPage(["news", "teao-expands-capacity"]), null);
  assert.equal(getNewsSlug(["news", "index_2.html"]), null);
  assert.equal(liveHref("/news/teao-expands-capacity.html"), "/news/teao-expands-capacity.html");
  assert.equal(liveHref("/news/unknown-article.html"), LIVE_ORIGIN + "/news/unknown-article.html");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: FAIL —— `getPilotPage(["about-us"])` 返回 `null`；`getNewsSlug` 未导出（undefined）。

- [ ] **Step 3: 创建 `src/content/live-site/news.ts`**

导出 `NewsArticle` 接口与 `newsArticles`（3 篇，字段 `slug`、`category`、`categoryLabel`、`title`、`summary`、`content: string[]`、`image`、`publishedAt`）。内容为英文站 seed 的中文翻译，图片路径 `/images/news/placeholder-{1,2,3}.webp`：

| slug | category / categoryLabel | publishedAt | image |
|---|---|---|---|
| `teao-expands-capacity` | `company` / 公司动态 | 2026-03-15 | placeholder-1.webp |
| `automotive-quality-systems` | `quality` / 质量 | 2026-02-20 | placeholder-2.webp |
| `torque-requirements-guide` | `engineering` / 工程 | 2026-01-10 | placeholder-3.webp |

翻译文案（原样使用）：

1. title「特澳扩建自动化阻尼器装配产能」；summary「自动化水平提升，支撑稳定品质与大批量交付。」；content 两段：①「特澳已完成东莞工厂自动化阻尼器装配线的大幅扩建。新设备将年产能提升至 8000 万件，同时保持汽车客户所要求的一致扭矩性能与质量标准。」②「本次投资在每条装配线上集成了自动化扭矩检测工位，实现 100% 全检能力。」
2. title「阻尼器生产的汽车级质量体系」；summary「以 IATF 为导向的过程控制，确保扭矩性能可重复。」；content 两段：①「特澳的质量管理体系围绕 IATF 16949 原则构建，聚焦过程控制、测量系统分析与生产追溯。」②「每一款阻尼器设计都要在规定的温度范围内完成验证测试，生产批次从原材料到终检全程可追溯。这套系统化方法满足全球主机厂与一级供应商的质量要求。」
3. title「如何定义软性运动所需的扭矩要求」；summary「掌握关键参数，加快阻尼器选型与技术报价。」；content 三段：①「明确定义扭矩要求，是为应用选择或设计合适阻尼器的第一步。」②「关键参数包括：目标扭矩值与公差、阻尼方向（顺时针、逆时针或双向）、工作温度范围、空间包络限制、安装结构、循环寿命要求，以及任何特殊环境条件。」③「在询盘时提供这些参数，特澳工程团队即可推荐最合适的标准平台，或提出定制设计方案。」

- [ ] **Step 4: 实现路由**

在 `src/lib/live-site.ts` 顶部导入 `newsArticles`，常量区追加：

```ts
export const ABOUT_PATH = "/about-us/";
export const CONTACTS_PATH = "/contacts/";
export const NEWS_PATH = "/news/";
export const NEWS_ARTICLE_SLUGS = newsArticles.map(article => article.slug);
```

新增（放在 `getPilotPage` 之前）：

```ts
export function getNewsSlug(segments: readonly string[]): string | null {
  const path = legacyPathFromSegments(segments);
  if (!path.startsWith("/news/") || !path.endsWith(".html")) return null;
  const slug = path.slice("/news/".length, -".html".length);
  return NEWS_ARTICLE_SLUGS.includes(slug) ? slug : null;
}
```

`getPilotPage` 返回类型追加 `"about" | "contacts" | "news" | "news-article"`，并在 applications 分支之后追加：

```ts
  if (path + "/" === ABOUT_PATH) return "about";
  if (path + "/" === CONTACTS_PATH) return "contacts";
  if (path + "/" === NEWS_PATH) return "news";
  if (getNewsSlug(segments)) return "news-article";
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: PASS —— 16 条测试全过（原 12 + 新 4）。

- [ ] **Step 6: 提交**

```bash
git add src/content/live-site/news.ts src/lib/live-site.ts src/lib/live-site.test.ts
git commit -m "feat: route about, contacts and news through the legacy catch-all"
```

---

### Task 2: 新闻图片拷贝

**Files:**
- Copy: `teao-website/public/images/news/placeholder-{1,2,3}.webp` → `teao-CN/public/images/news/`

**Interfaces:**
- Produces: `/images/news/placeholder-1.webp`、`-2`、`-3`（供 Task 1 的数据与 Task 4 的组件引用）。

- [ ] **Step 1: 拷贝**

```bash
mkdir -p public/images/news
cp ../teao-website/public/images/news/placeholder-1.webp public/images/news/
cp ../teao-website/public/images/news/placeholder-2.webp public/images/news/
cp ../teao-website/public/images/news/placeholder-3.webp public/images/news/
```

- [ ] **Step 2: 验证**

Run: `ls -la public/images/news/`
Expected: 3 个 webp，大小与英文站一致（2796 / 6024 / 8150 字节左右）。

- [ ] **Step 3: 提交**

```bash
git add public/images/news/
git commit -m "chore: copy news placeholder images from English site"
```

---

### Task 3: 抽出关于/联系页组件

**Files:**
- Move: `src/app/about/page.tsx` → `src/components/live-site/about-page.tsx`
- Move: `src/app/contact/page.tsx` → `src/components/live-site/contact-page.tsx`

**Interfaces:**
- Produces: 两个默认导出组件 `AboutPage`、`ContactPage`（无 props），供 Task 5 的 catch-all 渲染。
- 注意：移动到本任务完成后，`/about`、`/contact` 在构建中不再有页面（Task 6 才补 301）。Task 3–5 之间这两个旧 URL 返回 404 属预期，最终由 Task 6 收口。

- [ ] **Step 1: 移动文件**

```bash
git mv src/app/about/page.tsx src/components/live-site/about-page.tsx
git mv src/app/contact/page.tsx src/components/live-site/contact-page.tsx
```

- [ ] **Step 2: 清理 `about-page.tsx`**

删除 `import type { Metadata } from "next";` 与 `export const metadata: Metadata = {...}` 整块（约 13–38 行）。其余 10 个 about 子组件的导入与 `export default function AboutPage()` 组合保持不变。

- [ ] **Step 3: 清理 `contact-page.tsx`**

删除 `import type { Metadata } from "next";` 与 `export const metadata: Metadata = {...}` 整块（约 5–9 行）。其余内容（`productTypes`、`contactItems`、`ContactPage`、`ContactCard`）保持不变。

- [ ] **Step 4: 验证类型**

Run: `npx tsc --noEmit`
Expected: TSC 无错误（此时 `/about`、`/contact` 路由已不存在，但尚无页面引用这两个组件，故不影响编译）。

- [ ] **Step 5: 提交**

```bash
git add -A src/app src/components/live-site
git commit -m "refactor: move about and contact pages into live-site components"
```

---

### Task 4: 新闻组件（列表 + 详情）

**Files:**
- Create: `src/components/live-site/news-page.tsx`
- Create: `src/components/live-site/news-article-page.tsx`

**Interfaces:**
- Consumes: `newsArticles`、`NewsArticle`（Task 1）。
- Produces: `NewsPage`（无 props）、`NewsArticlePage({ article }: { article: NewsArticle })`，供 Task 5 渲染。

- [ ] **Step 1: 写 `news-page.tsx`**

默认导出 `NewsPage`：`<h1 className="sr-only">新闻 | 特澳 TEAO</h1>` + `SectionHead`（eyebrow「新闻」，title「公司动态与工程进展」，description「特澳最新动态、阻尼器工程进展、质量管理与技术资源。」）+ `grid sm:grid-cols-2 lg:grid-cols-3 gap-5` 卡片列表。每张卡片是 `<Link href={`/news/${article.slug}.html`}>`，内含：`aspect-[16/10]` 的 `next/image` 图（`object-contain p-4`）、`categoryLabel`（`text-brand-700 text-[10px] font-bold uppercase tracking-[0.12em]`）、`title`（`text-lg font-extrabold line-clamp-2`）、`summary`（`line-clamp-2 text-sm text-muted`）、底部 `publishedAt` 与「阅读全文 →」。卡片外层 `Reveal`，`delay` 取 `(Math.min(i, 2) + 1) as 1 | 2 | 3`。外层容器 `${container} py-14`。

- [ ] **Step 2: 写 `news-article-page.tsx`**

默认导出 `NewsArticlePage({ article })`：`${container}` 内 `max-w-3xl mx-auto py-14`。结构：面包屑（首页 / 新闻 / 当前标题，用 `Link` 与 `/news/`）→ 元信息行（`categoryLabel` + `publishedAt`，胶囊样式）→ `<h1>` 标题 → 摘要段落 → `aspect-[16/10]` 新闻图 → `article.content.map` 渲染段落（`leading-8 text-muted`）→ 底部「← 返回新闻列表」`Link href="/news/"`。

- [ ] **Step 3: 验证类型**

Run: `npx tsc --noEmit`
Expected: TSC 无错误。

- [ ] **Step 4: 提交**

```bash
git add src/components/live-site/news-page.tsx src/components/live-site/news-article-page.tsx
git commit -m "feat: add news list and article components"
```

---

### Task 5: 接入 catch-all（metadata + JSON-LD + 4 分支）

**Files:**
- Modify: `src/app/[...legacyPath]/page.tsx`

**Interfaces:**
- Consumes: Task 1 的常量与 `getNewsSlug`、Task 3 的 `AboutPage`/`ContactPage`、Task 4 的 `NewsPage`/`NewsArticlePage`、Task 1 的 `newsArticles`。

- [ ] **Step 1: 增加 import**

```ts
import AboutPage from "@/components/live-site/about-page";
import ContactPage from "@/components/live-site/contact-page";
import NewsPage from "@/components/live-site/news-page";
import NewsArticlePage from "@/components/live-site/news-article-page";
import { getNewsSlug, ABOUT_PATH, CONTACTS_PATH, NEWS_PATH } from "@/lib/live-site";
import { newsArticles } from "@/content/live-site/news";
```

（并入已有的 `@/lib/live-site` 导入，不要重复 import 语句。）

- [ ] **Step 2: 增加 metadata 常量**

追加 3 个静态 META 与 1 个动态函数（放在 `INDUSTRIAL_APPLICATION_META` 之后）：

```ts
const ABOUT_META: Metadata = {
  title: { absolute: "关于特澳 | 20+年阻尼器定制厂家" },
  description: "特澳 TEAO 成立于 2001 年，专注阻尼器与锁扣机构研发制造 20 余年。IATF 16949 认证，8000 万件年产能，模具·注塑·装配·检测一体化源头工厂。",
  alternates: canon(ABOUT_PATH), robots: { index: true, follow: true },
};
const CONTACTS_META: Metadata = {
  title: { absolute: "联系我们" },
  description: "联系特澳 TEAO 销售工程团队 — 提供图纸、样品或应用场景描述，工程师将在 2 小时内响应，为您提供选型建议与报价方案。",
  alternates: canon(CONTACTS_PATH), robots: { index: true, follow: true },
};
const NEWS_META: Metadata = {
  title: { absolute: "新闻 | 特澳 TEAO" },
  description: "特澳最新动态、阻尼器工程进展、质量管理与技术资源。",
  alternates: canon(NEWS_PATH), robots: { index: true, follow: true },
};
function newsArticleMeta(slug: string): Metadata {
  const article = newsArticles.find(item => item.slug === slug)!;
  return {
    title: { absolute: `${article.title} | 特澳 TEAO` },
    description: article.summary,
    alternates: canon(`/news/${article.slug}.html`),
    robots: { index: true, follow: true },
    openGraph: { title: article.title, description: article.summary, type: "article", publishedTime: article.publishedAt },
  };
}
```

- [ ] **Step 3: `generateMetadata` 增加分支**

在 applications 的 7 个分支之后追加：

```ts
  if (type === "about") return ABOUT_META;
  if (type === "contacts") return CONTACTS_META;
  if (type === "news") return NEWS_META;
  const newsSlug = getNewsSlug(segments);
  if (type === "news-article" && newsSlug) return newsArticleMeta(newsSlug);
```

- [ ] **Step 4: 页面渲染增加分支**

在 `LegacyPage` 的 applications 分支之后追加：

```tsx
  if (type === "about") return <AboutPage />;
  if (type === "contacts") return <ContactPage />;
  if (type === "news") return <NewsPage />;
  const newsSlug = getNewsSlug(segments);
  if (type === "news-article" && newsSlug) {
    const article = newsArticles.find(item => item.slug === newsSlug)!;
    return <NewsArticlePage article={article} />;
  }
```

- [ ] **Step 5: 加 JSON-LD**

在 `news-page.tsx` 顶部定义 `CollectionPage` JSON-LD（`url: "https://www.chinateao.com/news/"`，`itemListElement` 来自 `newsArticles`，`url` 为 `https://www.chinateao.com/news/{slug}.html`），并在返回的 `<section>` 前用 `<>` 包裹内联 `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />`。

在 `news-article-page.tsx` 顶部定义 `NewsArticle` JSON-LD：`headline`/`description`/`datePublished`/`image`（绝对 URL）、`author` 与 `publisher` 为 `{ "@type": "Organization", name: "东莞市特澳电子科技有限公司" }`、`mainEntityOfPage` 为 canonical URL。同样内联 `<script>`。

- [ ] **Step 6: 验证类型与构建**

Run: `npx tsc --noEmit && npm run build`
Expected: TSC 无错误；build 成功。

- [ ] **Step 7: 提交**

```bash
git add 'src/app/[...legacyPath]/page.tsx' src/components/live-site/news-page.tsx src/components/live-site/news-article-page.tsx
git commit -m "feat: render about, contacts and news with metadata and JSON-LD"
```

---

### Task 6: 导航、301 重定向、内部链接

**Files:**
- Modify: `next.config.ts`
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/app/products/[category]/[slug]/page.tsx:206`
- Modify: `src/components/home/product-grid.tsx:47`
- Modify: `src/components/home/application-section.tsx:104`
- Modify: `src/components/about/about-cta.tsx:45`
- Modify: `src/components/about/about-hero.tsx:93`
- Modify: `src/components/live-site/simple-application-page.tsx:22`

**Interfaces:**
- Consumes: Task 3 已把关于/联系内容移出 `src/app/`。

- [ ] **Step 1: 加 301 重定向**

在 `next.config.ts` 的 `nextConfig` 对象中追加：

```ts
async redirects() {
  return [
    { source: "/about", destination: "/about-us/", statusCode: 301 },
    { source: "/contact", destination: "/contacts/", statusCode: 301 },
  ];
},
```

- [ ] **Step 2: 更新 Header**

`navItems` 改为 7 项，并插入「新闻」：

```ts
const navItems = [
  { label: "首页", href: "/" },
  { label: "产品中心", href: "/products/", mega: true },
  { label: "应用领域", href: liveHref("/applications/") },
  { label: "质量认证", href: "/quality-control/" },
  { label: "新闻", href: "/news/" },
  { label: "关于我们", href: "/about-us/" },
  { label: "联系我们", href: "/contacts/" },
];
```

同时把 Header 两处 CTA 的 `href="/contact"` 改为 `href="/contacts/"`（桌面 CTA 与移动端菜单 CTA）。

- [ ] **Step 3: 更新 Footer**

「关于」组改为 4 条：`关于我们 → /about-us/`、`应用领域 → liveHref("/applications/")`、`质量认证 → /quality-control/`、`新闻 → /news/`。
「联系」组两处 `/contact` 改为 `/contacts/`。

- [ ] **Step 4: 清理其余内部 `/contact` 链接**

把以下位置的 `href="/contact"` 改为 `href="/contacts/"`：

- `src/app/products/[category]/[slug]/page.tsx:206`
- `src/components/home/product-grid.tsx:47`
- `src/components/home/application-section.tsx:104`
- `src/components/about/about-cta.tsx:45`
- `src/components/about/about-hero.tsx:93`
- `src/components/live-site/simple-application-page.tsx:22`

- [ ] **Step 5: 验证无残留**

Run: `grep -rn 'href="/about"\|href="/contact"\|"/contact"' src/ || echo "CLEAN"`
Expected: `CLEAN`（无输出）。

- [ ] **Step 6: 验证构建**

Run: `npx tsc --noEmit && npm run build`
Expected: 均通过；build 输出无 `src/app/about`、`src/app/contact` 路由。

- [ ] **Step 7: 提交**

```bash
git add next.config.ts src/components src/app
git commit -m "feat: add news nav entry, 301 old about/contact URLs, update internal links"
```

---

### Task 7: 更新 sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `newsArticles`（Task 1）。

- [ ] **Step 1: 改 base 与静态页**

`baseUrl` 改为 `"https://www.chinateao.com"`。`staticPages` 改为：`/`（priority 1）、`/products`（0.9）、`/applications/`（0.7）、`/quality-control/`（0.6）、`/about-us/`（0.6）、`/contacts/`（0.7）、`/news/`（0.6）。**移除 `/contact`**。

- [ ] **Step 2: 增加新闻详情页**

```ts
const newsPages: MetadataRoute.Sitemap = newsArticles.map(article => ({
  url: `${baseUrl}/news/${article.slug}.html`,
  lastModified: new Date(article.publishedAt),
  changeFrequency: "monthly" as const,
  priority: 0.5,
}));
```

返回改为 `[...staticPages, ...newsPages, ...productPages]`（db 动态产品部分保持不变）。

- [ ] **Step 3: 验证**

Run: `npx tsc --noEmit`
Expected: TSC 无错误。

- [ ] **Step 4: 提交**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add about, contacts and news to sitemap with www origin"
```

---

### Task 8: 全站验证

**Files:** 无。

- [ ] **Step 1: 测试 + 类型 + lint + 构建**

Run:
```bash
npx tsx --test src/lib/live-site.test.ts
npx tsc --noEmit
npm run lint
npm run build
```
Expected: 16 条测试全过；TSC 0 error；lint 0 error（允许 `partner-section.tsx` 的既有 `<img>` warning）；build 成功。

- [ ] **Step 2: 起服务验证页面**

先释放 3000 端口再启动（`lsof -ti :3000 | xargs kill`），然后：

```bash
for p in "/about-us/" "/contacts/" "/news/" "/news/teao-expands-capacity.html" "/news/automotive-quality-systems.html" "/news/torque-requirements-guide.html"; do
  printf "%-45s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000$p")"
done
```
Expected: 6 个 URL 均 200。

- [ ] **Step 3: 验证 301 与 404**

```bash
curl -s -o /dev/null -w "/about  %{http_code} -> %{redirect_url}\n" http://localhost:3000/about
curl -s -o /dev/null -w "/contact %{http_code} -> %{redirect_url}\n" http://localhost:3000/contact
curl -s -o /dev/null -w "/news/unknown.html %{http_code}\n" http://localhost:3000/news/unknown.html
```
Expected: `/about` → `301` 且 `redirect_url` 为 `/about-us/`；`/contact` → `301` 且 `/contacts/`；未知 slug → `404`。

- [ ] **Step 4: 验证内容、SEO 与导航**

```bash
curl -s http://localhost:3000/about-us/ | grep -oE '关于特澳|index, follow' | sort -u
curl -s http://localhost:3000/contacts/ | grep -oE '联系我们|index, follow' | sort -u
curl -s http://localhost:3000/news/ | grep -oE '公司动态|质量|工程|CollectionPage' | sort -u
curl -s http://localhost:3000/news/teao-expands-capacity.html | grep -oE 'NewsArticle|东莞市特澳电子科技有限公司|2026-03-15' | sort -u
curl -s http://localhost:3000/ | grep -oE 'href="[^"]*"[^>]*>(新闻|关于我们|联系我们|获取报价)' | sort -u
curl -s http://localhost:3000/sitemap.xml | grep -oE 'loc>[^<]+' | sort -u
```
Expected:
- 关于/联系页含 `index, follow`（非 noindex）。
- 新闻列表含 3 个分类标签与 `CollectionPage`；详情含 `NewsArticle`、公司名、日期。
- Header 7 项且关于/联系指向 `/about-us/`、`/contacts/`，新闻指向 `/news/`。
- sitemap 含 `www` 前缀、`/about-us/`、`/contacts/`、`/news/`、3 篇详情，且**不含 `/contact`**。

- [ ] **Step 5: 浏览器抽查**

桌面 1440 + 移动 390：7 项导航可点、移动端菜单含新闻与 3 个分类子项；新闻列表 3 张卡片、详情正文可读、图片正常；关于/联系页版式与改动前一致。

---

## Self-Review 备注

- **Spec 覆盖**：§2 范围 → Task 1/5/6/7；§3 内容口径 → Task 3/4；§4 新闻来源 → Task 1；§5 路由 → Task 1；§6 组件与数据 → Task 1/3/4；§7 SEO → Task 5/7；§8 图片 → Task 2；§9 测试 → Task 1/8；§10 验收 → Task 8。
- **Ruling（作者决定）**：`content` 用 `string[]`（段落数组）而非英文站的 HTML 字符串——3 篇 seed 正文均为纯文本，数组更易渲染且无需 `dangerouslySetInnerHTML`。cost if wrong：未来接入富文本新闻时需扩展该字段。
- **Ruling（作者决定）**：新闻 `categoryLabel` 存进数据文件（公司动态/质量/工程），而不是在组件里做映射——单一数据源，组件不重复业务映射。cost if wrong：无。
- **Ruling（作者决定）**：全站 `/contact` 链接一并改 `/contacts/`，虽超出 spec 字面（spec 只点名 Header/Footer），但残留链接每次点击多一跳 301，属于本次 URL 对齐的应有之义。cost if wrong：改动面稍大，均由 grep 与 build 覆盖。
