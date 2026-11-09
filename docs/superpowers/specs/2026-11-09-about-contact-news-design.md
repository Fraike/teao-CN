# 子项目 C：关于/联系 URL 对齐 + 新闻栏目承接

日期：2026-11-09。目标：补全原站「关于我们 / 联系我们 / 新闻」三个栏目，让原站 URL 不再 404、不再跳线上，与已承接的栏目形成完整结构。

## 1. 目标与背景

原站 `https://www.chinateao.com/` 的栏目级 URL 中，还有三块未本地承接：

| 原站 URL | 现状 | 目标 |
|---|---|---|
| `/about-us/` | 200，正文可抓 | 本地承接（渲染中文站已有关于页内容） |
| `/contacts/` | 403，正文抓不到 | 本地承接（渲染中文站已有联系页内容） |
| `/news/` + 8 篇详情 | 全 403，正文抓不到 | 本地承接（翻译英文站 3 篇新闻） |

中文站 phase1 已开发 `/about`、`/contact` 两个开发路由，内容完整。子项目 C 将「关于/联系」统一到原站 URL，并承接「新闻」。

## 2. 范围

**In scope**

- **关于/联系 URL 对齐**（已与用户确认「统一到原站 URL」）：
  - `/about-us/`、`/contacts/` 成为正式 URL（catch-all 承接，渲染本地内容）。
  - 旧的 `/about`、`/contact` 开发路由改为 301 重定向到 `/about-us/`、`/contacts/`。
  - Header/footer 中「关于我们」「联系我们」改指 `/about-us/`、`/contacts/`。
- **新闻栏目**（已与用户确认「翻译英文站内容、图片一致」）：
  - `/news/` 列表页 + `/news/[slug].html` 详情页（3 篇）。
  - 内容 1:1 翻译英文站 `src/db/seed.ts` 的 3 篇 seed 新闻，图片用英文站 `/images/news/placeholder-*.webp`。
- **新闻导航入口**（已与用户确认「Header + footer 都加」）：Header 增加「新闻」项（变为 7 项），footer 增加「新闻」链接。
- **sitemap.ts 更新**：静态页去掉即将 301 的 `/contact`，加入 `/about-us/`、`/contacts/`、`/news/` 与 3 篇新闻详情，base 统一为 `https://www.chinateao.com`（对齐根 layout 的 metadataBase）。db 动态产品部分保持现状不动。

**Out of scope**

- 下载栏目：`/brochures/`、`/gear-damper-china/` 等 6 个旧分类下载页 —— **不承接，保持现状**（继续走 `liveHref` 跳线上原站）。
- 原站 8 篇中文新闻（正文 403 抓不到、与英文站 3 篇不对应）—— **不承接**（已与用户确认），这些 URL 本地返回 404。中文站新闻以英文站 3 篇为准。
- 原站 `/torque/`、`/convert/` 扭矩换算工具。
- 原站 PHP 旧路径 `/index.php/...` 与深链文章 `/internal/`、`/external/`、`/home-life/`。
- 产品详情页批量承接（独立子项目）。
- 3 个缺失分类（air-dampers / liner-dampers / synchronizers，独立子项目）。

## 3. 内容口径（已与用户确认）

1. **关于/联系**：复用中文站 `/about`、`/contact` 已有内容，只做 URL 对齐，不改文案。
2. **新闻**：翻译英文站 3 篇 seed 新闻（title / summary / content），图片用英文站 placeholder 图（1:1 拷贝），保持与英文站一致。
3. **下载**：关掉 —— 不承接、不做任何跳转处理。

## 4. 新闻内容来源（英文站 seed，3 篇）

| slug | category | publishedAt | 图片 |
|---|---|---|---|
| `teao-expands-capacity` | company | 2026-03-15 | placeholder-1.webp |
| `automotive-quality-systems` | quality | 2026-02-20 | placeholder-2.webp |
| `torque-requirements-guide` | engineering | 2026-01-10 | placeholder-3.webp |

每篇含 `title`、`summary`、`content`（纯文本段落）。category 中文化：company→公司动态、quality→质量、engineering→工程（builder 的 call，非用户指定）。

## 5. URL 与路由设计

扩展 [src/lib/live-site.ts](../..//src/lib/live-site.ts)：

```ts
export const ABOUT_PATH = "/about-us/";
export const CONTACTS_PATH = "/contacts/";
export const NEWS_PATH = "/news/";
```

`getPilotPage` 新增返回类型：`"about" | "contacts" | "news" | "news-article"`。

匹配规则：
- `path + "/" === ABOUT_PATH` → `"about"`
- `path + "/" === CONTACTS_PATH` → `"contacts"`
- `path + "/" === NEWS_PATH` → `"news"`
- `path` 匹配 `/news/{slug}.html`（slug 在 3 篇新闻中）→ `"news-article"`

[src/app/[...legacyPath]/page.tsx](../..//src/app/[...legacyPath]/page.tsx) 增加 4 个分支渲染 + 各自 metadata。

旧路由重定向：
- `src/app/about/page.tsx` → `redirect("/about-us/")`
- `src/app/contact/page.tsx` → `redirect("/contacts/")`

## 6. 组件与数据

- 新建 `src/components/live-site/about-page.tsx`：把 `src/app/about/page.tsx` 的 AboutPage 组合逻辑（10 个 about 子组件）抽出为 `AboutPage` 组件，供 catch-all 复用。
- 新建 `src/components/live-site/contact-page.tsx`：把 `src/app/contact/page.tsx` 的 ContactPage 抽出。
- 新建 `src/content/live-site/news.ts`：3 篇新闻数据（slug / category / title / summary / content / image / publishedAt）。
- 新建 `src/components/live-site/news-page.tsx`：新闻列表页（SectionHead + 3 张卡片）。
- 新建 `src/components/live-site/news-article-page.tsx`：新闻详情页（props 接收一篇新闻；标题 + 摘要 + 正文 + 日期/分类）。

## 7. SEO

- 关于/联系：metadata 复用原 `/about`、`/contact` 的 title/description，canonical 改为原站 URL（`https://www.chinateao.com/about-us/`、`/contacts/`），`robots: { index: true, follow: true }`（这两个是正式对客页，不 noindex）。
- 新闻：列表页 title `新闻 | 特澳 TEAO`；详情页 title 用新闻标题。canonical 指向 `https://www.chinateao.com` + 原路径。`robots: { index: true, follow: true }`。
- JSON-LD：新闻列表页用 `CollectionPage`（itemListElement 3 篇）；新闻详情页用 `NewsArticle`（headline/datePublished/image/author/publisher）。author 与 publisher 用公司名「东莞市特澳电子科技有限公司」（`Organization` 类型），不虚构个人署名。

## 8. 图片拷贝清单（从 teao-website → teao-CN `public/images/news/`）

| 文件 | 用途 |
|---|---|
| `placeholder-1.webp` | 新闻 1（产能扩充） |
| `placeholder-2.webp` | 新闻 2（质量体系） |
| `placeholder-3.webp` | 新闻 3（扭矩需求指南） |

## 9. 测试与验证

- 扩展 [src/lib/live-site.test.ts](../..//src/lib/live-site.test.ts)：`/about-us/`、`/contacts/`、`/news/`、`/news/{slug}.html` 解析正确；未知 slug 仍跳线上；`/about`、`/contact` 重定向生效。
- `npx tsx --test`、`npx tsc --noEmit`、`npm run build`、`npm run lint` 全绿。
- 本地浏览器：`/about-us/`、`/contacts/`、`/news/`、3 个详情页均 200；`/about`、`/contact` 301 到原站 URL；Header/footer 关于/联系指向原站 URL。

## 10. 验收标准

- [ ] `/about-us/`、`/contacts/` 本地渲染，`/about`、`/contact` 301 重定向。
- [ ] Header/footer「关于我们」「联系我们」指向 `/about-us/`、`/contacts/`。
- [ ] `/news/` 列表 + 3 篇详情本地渲染，内容为英文站中文翻译，图片与英文站一致。
- [ ] 下载栏目不承接，`/brochures/` 等仍跳线上（无回归）。
- [ ] 回归测试、类型检查、构建、lint 全绿。
