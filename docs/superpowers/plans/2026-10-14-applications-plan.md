# 子项目 B：应用案例（Applications）栏目承接 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把线上 `/applications/` 栏目 7 个叶子页本地承接,Header「应用领域」随之自动跳本地(不再跳 chinateao.com)。

**Architecture:** 复用子项目 A 的 catch-all 承接模式——扩展 `src/lib/live-site.ts` 的路径常量与 `getPilotPage` 返回类型,在 `src/app/[...legacyPath]/page.tsx` 增加 7 个渲染分支 + 各自 metadata;内容集中在单一数据文件 `src/content/live-site/applications.ts`,由 4 个纯展示组件消费。

**Tech Stack:** Next.js App Router(异步 params)、React 函数组件、Tailwind v4、lucide-react、`next/image`(gif 加 `unoptimized`)。

**Spec:** [docs/superpowers/specs/2026-10-14-applications-design.md](../specs/2026-10-14-applications-design.md)

## Global Constraints

- URL 结构原样保留(大小写、空格、中文、尾斜杠、.html),7 个叶子 URL 与线上一致。
- 内容口径(与用户确认):家居/办公/工业三页 = 中文标题 + 一句简介 + 一张静态图 + CTA;汽车内外饰 = 简化卡片列表(无热点地图);场景动效用 gif;素材复用英文站。
- 所有页面 metadata `robots: { index: false, follow: true }`(noindex,与现有样板一致),canonical 指向 `https://www.chinateao.com` + 原路径。
- 产品组不展示产品小图,组内型号仅文字;产品组标题链接到分类页(用 `liveHref`)。
- gif 必须 `unoptimized`,否则动效丢失。
- 复用 `container`、`SectionHead`、`Reveal`、`Button` 组件;沿用子项目 A 视觉风格(design tokens)。

## Review Focus

1. **尾斜杠不一致**:访问 `/applications/automotive-interior`(无尾斜杠)应解析为 `automotive-interior`,与 `/applications/automotive-interior/` 一致——`getPilotPage` 用 `path + "/"` 匹配天然满足,但需测试钉住。
2. **嵌套路径误判**:`/applications/automotive-interior/internal/` 与 `/applications/automotive-interior/` 是不同页面,`getPilotPage` 不能把 `internal` 段吞掉——按完整 `path + "/"` 精确匹配,测试钉住 `/applications/automotive-interior/internal` 不等于 `automotive-interior`。
3. **分页/深链仍跳线上**:`/applications/index_2.html`、`/applications/automotive-interior/index_2.html`、`/internal/*.html` 不承接,`liveHref` 必须返回线上原址——测试钉住。
4. **gif 动效丢失**:`next/image` 默认优化会破坏 gif 动画,场景卡必须 `unoptimized`——build 后 curl 验证 `unoptimized` 属性/`src` 指向原 gif。
5. **Header 应用领域跳本地**:Task 1 完成后 `liveHref("/applications/")` 应返回本地 `/applications/`,Header(无需改代码)自动生效——验证时 curl 首页确认 href 不再指向 chinateao.com。

---

### Task 1: 路由与路径常量（TDD）

**Files:**
- Modify: `src/lib/live-site.ts`
- Test: `src/lib/live-site.test.ts`

**Interfaces:**
- Consumes: 现有 `getPilotPage`/`liveHref`/`legacyPathFromSegments`。
- Produces: 7 个路径常量(`APPLICATIONS_PATH` 等)、类型 `ApplicationPageType`、扩展后的 `getPilotPage` 返回类型(供 Task 5 的 `page.tsx` 消费)。

- [ ] **Step 1: 写失败测试**

在 `src/lib/live-site.test.ts` 末尾追加:

```ts
import { getPilotPage, liveHref, LIVE_ORIGIN, APPLICATIONS_PATH, AUTOMOTIVE_INTERIOR_PATH, INTERIOR_PATH, EXTERIOR_PATH, HOME_LIFE_PATH, OFFICE_EQUIPMENT_PATH, INDUSTRIAL_APPLICATION_PATH } from "./live-site";

test("applications leaves resolve locally with and without trailing slash", () => {
  assert.equal(getPilotPage(["applications"]), "applications");
  assert.equal(getPilotPage(["applications", "automotive-interior"]), "automotive-interior");
  assert.equal(getPilotPage(["applications", "automotive-interior", "internal"]), "interior");
  assert.equal(getPilotPage(["applications", "automotive-interior", "external"]), "exterior");
  assert.equal(getPilotPage(["applications", "home-life"]), "home-life");
  assert.equal(getPilotPage(["applications", "office-equipment"]), "office-equipment");
  assert.equal(getPilotPage(["applications", "industrial-application"]), "industrial-application");
  assert.equal(liveHref("/applications/"), "/applications/");
  assert.equal(liveHref("/applications/automotive-interior/internal/"), "/applications/automotive-interior/internal/");
});

test("applications near-miss, pagination and deep links still go live", () => {
  assert.equal(getPilotPage(["application"]), null);
  assert.equal(getPilotPage(["applications", "automotive-interior", "internal", "article.html"]), null);
  assert.equal(liveHref("/applications/index_2.html"), LIVE_ORIGIN + "/applications/index_2.html");
  assert.equal(liveHref("/applications/automotive-interior/index_2.html"), LIVE_ORIGIN + "/applications/automotive-interior/index_2.html");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: FAIL —— `getPilotPage(["applications"])` 返回 `null`(期望 `"applications"`),且新增 import 的 7 个常量 `undefined`。

- [ ] **Step 3: 实现路径常量与匹配**

在 `src/lib/live-site.ts` 的常量区追加:

```ts
export const APPLICATIONS_PATH = "/applications/";
export const AUTOMOTIVE_INTERIOR_PATH = "/applications/automotive-interior/";
export const INTERIOR_PATH = "/applications/automotive-interior/internal/";
export const EXTERIOR_PATH = "/applications/automotive-interior/external/";
export const HOME_LIFE_PATH = "/applications/home-life/";
export const OFFICE_EQUIPMENT_PATH = "/applications/office-equipment/";
export const INDUSTRIAL_APPLICATION_PATH = "/applications/industrial-application/";

export type ApplicationPageType =
  | "applications"
  | "automotive-interior"
  | "interior"
  | "exterior"
  | "home-life"
  | "office-equipment"
  | "industrial-application";

const APPLICATION_PAGE_PATHS: Record<string, ApplicationPageType> = {
  [APPLICATIONS_PATH]: "applications",
  [AUTOMOTIVE_INTERIOR_PATH]: "automotive-interior",
  [INTERIOR_PATH]: "interior",
  [EXTERIOR_PATH]: "exterior",
  [HOME_LIFE_PATH]: "home-life",
  [OFFICE_EQUIPMENT_PATH]: "office-equipment",
  [INDUSTRIAL_APPLICATION_PATH]: "industrial-application",
};
```

把 `getPilotPage` 返回类型改为 `"category" | "product" | "quality" | "faq" | ApplicationPageType | null`,并在 `FAQ_PATH` 判断之后追加:

```ts
  const applicationPage = APPLICATION_PAGE_PATHS[path + "/"];
  if (applicationPage) return applicationPage;
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: PASS —— 全量测试通过(原有 10 条 + 新增 2 条)。

- [ ] **Step 5: 提交**

```bash
git add src/lib/live-site.ts src/lib/live-site.test.ts
git commit -m "feat: route applications leaves through the legacy catch-all"
```

---

### Task 2: 图片资产拷贝

**Files:**
- Copy(from teao-website → teao-CN `public/images/applications/`):4 张 webp + 6 张 gif。

**Interfaces:**
- Consumes: 英文站 `public/images/applications/`。
- Produces: teao-CN `public/images/applications/*.webp` 与 `public/images/applications/applications-gif/*.gif`(供 Task 3/4 引用)。

- [ ] **Step 1: 创建目录并拷贝静态图**

```bash
mkdir -p public/images/applications/applications-gif
cp ../teao-website/public/images/applications/automotive.webp public/images/applications/
cp ../teao-website/public/images/applications/bathroom.webp public/images/applications/
cp ../teao-website/public/images/applications/office.webp public/images/applications/
cp ../teao-website/public/images/applications/home-appliances.webp public/images/applications/
```

- [ ] **Step 2: 拷贝 6 张 gif(保留含空格的原文件名)**

```bash
cp ../teao-website/public/images/applications/applications-gif/Center\ console\ lid.gif public/images/applications/applications-gif/
cp ../teao-website/public/images/applications/applications-gif/Glove\ box.gif public/images/applications/applications-gif/
cp ../teao-website/public/images/applications/applications-gif/Door\ handle.gif public/images/applications/applications-gif/
cp ../teao-website/public/images/applications/applications-gif/safty\ handle.gif public/images/applications/applications-gif/
cp ../teao-website/public/images/applications/applications-gif/glasses\ box.gif public/images/applications/applications-gif/
cp ../teao-website/public/images/applications/applications-gif/outlet\ cover.gif public/images/applications/applications-gif/
```

- [ ] **Step 3: 验证**

Run: `ls -la public/images/applications/ public/images/applications/applications-gif/`
Expected: 4 个 webp + 6 个 gif,文件名与 spec §9 拷贝清单一致(含空格)。

- [ ] **Step 4: 提交**

```bash
git add public/images/applications/
git commit -m "chore: copy applications images and gifs from English site"
```

---

### Task 3: 应用数据文件 `applications.ts`

**Files:**
- Create: `src/content/live-site/applications.ts`

**Interfaces:**
- Consumes: 无。
- Produces: `applicationCards`(4)、`automotiveInteriorScenes`(6)、`automotiveExteriorScenes`(2)、`simpleApplications`(3),以及类型 `ApplicationCard`/`SimpleApplication`/`SceneProductGroup`/`ApplicationScene`(供 Task 4/5 消费)。

- [ ] **Step 1: 写数据文件**

创建 `src/content/live-site/applications.ts`:

```ts
// TEAO 中文站 — 应用案例数据
// 基于英文站 src/content/automotive-applications.ts 与 applications 首页本地化

export interface ApplicationCard {
  key: "automotive" | "home" | "office" | "industrial";
  title: string;
  description: string;
  image: string; // /images/applications/*.webp
  href: string;  // 本地叶子 URL
}

export interface SimpleApplication {
  key: "home" | "office" | "industrial";
  title: string;
  description: string;
  image: string; // /images/applications/*.webp
}

export interface SceneProductGroup {
  title: string;        // 组标题(齿轮阻尼器 / 轴向阻尼器 / 手套箱阻尼器 / 同步器),链接分类页
  categoryPath: string; // 组标题链接的分类路径
  models: string[];     // 组内型号文字列表
}

export interface ApplicationScene {
  id: string;
  no: string;
  title: string;
  description: string;
  gif: string; // /images/applications/applications-gif/*.gif
  groups: SceneProductGroup[];
}

const GIF = "/images/applications/applications-gif";

export const applicationCards: ApplicationCard[] = [
  { key: "automotive", title: "汽车内外饰", description: "手套箱、扶手、杯托、充电口盖、车内储物格与拉手。", image: "/images/applications/automotive.webp", href: "/applications/automotive-interior/" },
  { key: "home", title: "家居", description: "马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。", image: "/images/applications/bathroom.webp", href: "/applications/home-life/" },
  { key: "office", title: "办公设备", description: "打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。", image: "/images/applications/office.webp", href: "/applications/office-equipment/" },
  { key: "industrial", title: "工业设备", description: "检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。", image: "/images/applications/home-appliances.webp", href: "/applications/industrial-application/" },
];

export const automotiveInteriorScenes: ApplicationScene[] = [
  {
    id: "center-console-lid", no: "01", title: "中控扶手箱盖",
    description: "中控储物盖的软开、软关与防撞击控制。",
    gif: `${GIF}/Center console lid.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T012C"] }],
  },
  {
    id: "glove-box", no: "02", title: "手套箱 / 杂物箱",
    description: "受控下降,降低乘客车内储物的冲击与噪音。",
    gif: `${GIF}/Glove box.gif`,
    groups: [
      { title: "手套箱阻尼器", categoryPath: "/Glove Box Dampers/", models: ["RD-V109", "RD-V107", "RD-V129"] },
      { title: "同步器", categoryPath: "/qitaqichelingbujian/", models: ["RD-T180"] },
    ],
  },
  {
    id: "inner-door-handle", no: "03", title: "内门把手",
    description: "带回弹阻尼,让内门把手操作更安静、更稳定。",
    gif: `${GIF}/Door handle.gif`,
    groups: [
      { title: "齿轮阻尼器", categoryPath: "/gear-damper/", models: ["RD-T021", "RD-T015", "RD-T029"] },
      { title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["TAD-18", "RD-V109"] },
    ],
  },
  {
    id: "grab-handle", no: "04", title: "顶棚拉手",
    description: "回弹缓冲,消除车顶拉手的回弹撞击噪音。",
    gif: `${GIF}/safty handle.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T012A", "RD-T012C", "RD-T013B"] }],
  },
  {
    id: "overhead-console", no: "05", title: "顶棚控制台 / 眼镜盒",
    description: "顶棚储物格与眼镜盒的软开、软关。",
    gif: `${GIF}/glasses box.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T013C"] }],
  },
  {
    id: "sunshade", no: "06", title: "遮阳板",
    description: "遮阳板与翻转机构的旋转阻尼,动作更顺滑。",
    gif: `${GIF}/glasses box.gif`,
    groups: [{ title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013B", "RD-T013C"] }],
  },
];

export const automotiveExteriorScenes: ApplicationScene[] = [
  {
    id: "exterior-door-handle", no: "01", title: "外门把手",
    description: "平嵌式与常规外门把手的伸出、回位与手感控制。",
    gif: `${GIF}/Door handle.gif`,
    groups: [{ title: "齿轮·定制模块", categoryPath: "/gear-damper/", models: ["RD-T015", "RD-T021"] }],
  },
  {
    id: "charging-port-cover", no: "02", title: "充电口盖",
    description: "新能源汽车充电口盖的软开、软关与防撞击。",
    gif: `${GIF}/outlet cover.gif`,
    groups: [
      { title: "齿轮阻尼器", categoryPath: "/gear-damper/", models: ["RD-T023"] },
      { title: "轴向阻尼器", categoryPath: "/axial-dampers/", models: ["RD-T013C"] },
    ],
  },
];

export const simpleApplications: SimpleApplication[] = [
  { key: "home", title: "家居", description: "马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。", image: "/images/applications/bathroom.webp" },
  { key: "office", title: "办公设备", description: "打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。", image: "/images/applications/office.webp" },
  { key: "industrial", title: "工业设备", description: "检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。", image: "/images/applications/home-appliances.webp" },
];
```

- [ ] **Step 2: 验证内容口径**

Run:
```bash
grep -n 'axial-damper\|gear-damper\|Glove Box\|qitaqichelingbujian' src/content/live-site/applications.ts
npx tsc --noEmit
```
Expected: 产品组 `categoryPath` 映射与 spec §4.4 一致(Gear→`/gear-damper/`、Axial→`/axial-dampers/`、Glove Box→`/Glove Box Dampers/`、Synchronizer→`/qitaqichelingbujian/`);TSC 无错误;gif 路径含空格且为原文件名。

- [ ] **Step 3: 提交**

```bash
git add src/content/live-site/applications.ts
git commit -m "feat: add applications content data (4 cards, 8 scenes, 3 simple pages)"
```

---

### Task 4: 应用组件（4 个）

**Files:**
- Create: `src/components/live-site/applications-page.tsx`
- Create: `src/components/live-site/automotive-overview-page.tsx`
- Create: `src/components/live-site/application-scenes-page.tsx`
- Create: `src/components/live-site/simple-application-page.tsx`

**Interfaces:**
- Consumes: `applicationCards`/`automotiveInteriorScenes`/`automotiveExteriorScenes`/`simpleApplications`(Task 3),`container`(catalog.tsx)、`SectionHead`/`Reveal`/`Button`。
- Produces: 4 个无 props 或 props 明确的组件(供 Task 5 的 `page.tsx` 渲染)。

- [ ] **Step 1: 写 applications-page.tsx(首页)**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Car, Bath, Monitor, Cog } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { applicationCards } from "@/content/live-site/applications";

const cardIcons = [Car, Bath, Monitor, Cog];

export default function ApplicationsPage() {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">应用案例 | 阻尼器应用场景 | 特澳 TEAO</h1>
      <SectionHead
        eyebrow="应用案例"
        title="为每一种应用而设计"
        description="特澳阻尼器服务于汽车、家居、办公设备与工业领域,覆盖开合、缓冲、缓降与回弹控制。"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {applicationCards.map((card, i) => {
          const Icon = cardIcons[i];
          return (
            <Reveal key={card.key} delay={((i % 2) + 1) as 1 | 2}>
              <Link href={card.href} className="group block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.06)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
                </div>
                <div className="p-7">
                  <Icon className="mb-4 h-10 w-10 text-brand-500" />
                  <h2 className="mb-3 text-2xl font-bold">{card.title}</h2>
                  <p className="text-muted leading-relaxed">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-brand-500">
                    查看应用 →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 写 automotive-overview-page.tsx(总览)**

```tsx
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";

const zoneEntries = [
  { title: "汽车内饰", description: "中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的阻尼应用。", href: "/applications/automotive-interior/internal/" },
  { title: "汽车外饰", description: "外门把手与新能源充电口盖的阻尼应用。", href: "/applications/automotive-interior/external/" },
];

export default function AutomotiveOverviewPage() {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">汽车内外饰阻尼器应用 | 特澳 TEAO</h1>
      <SectionHead
        eyebrow="汽车内外饰"
        title="车内车外,静音顺滑"
        description="电动车与高端座舱更安静,开合、回弹的机械声更容易被察觉。选对阻尼器,让每一次动作更精致。"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {zoneEntries.map((entry, i) => (
          <Reveal key={entry.href} delay={((i % 2) + 1) as 1 | 2}>
            <Link href={entry.href} className="group block rounded-2xl border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-[0_12px_32px_rgba(232,120,26,0.06)]">
              <h2 className="mb-3 text-2xl font-bold">{entry.title}</h2>
              <p className="mb-5 text-muted leading-relaxed">{entry.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-500">进入 →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 写 application-scenes-page.tsx(场景列表,internal/external 复用)**

```tsx
import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { container } from "./catalog";
import type { ApplicationScene } from "@/content/live-site/applications";

export default function ApplicationScenesPage({ eyebrow, title, description, scenes }: {
  eyebrow: string;
  title: string;
  description: string;
  scenes: ApplicationScene[];
}) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{title} | 特澳 TEAO</h1>
      <SectionHead eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4">
        {scenes.map((scene, i) => (
          <Reveal key={scene.id} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
            <article className="overflow-hidden rounded-2xl border border-line bg-white p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-3">
                <em className="not-italic text-lg font-black leading-none text-brand-500">{scene.no}</em>
                <h2 className="text-[17px] font-bold leading-tight">{scene.title}</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line-soft bg-surface">
                  <Image src={scene.gif} alt={scene.title} fill unoptimized className="object-contain p-2" sizes="(max-width: 768px) 100vw, 420px" />
                </div>
                <div>
                  <p className="mb-4 text-sm leading-relaxed text-muted">{scene.description}</p>
                  <div className="space-y-2.5">
                    {scene.groups.map((group) => (
                      <div key={group.title} className="overflow-hidden rounded-lg border border-line">
                        <div className="flex items-center justify-between min-h-[36px] px-3 bg-surface text-xs font-bold">
                          <Link href={liveHref(group.categoryPath)} className="text-brand-700 hover:underline">{group.title}</Link>
                        </div>
                        <div className="flex flex-wrap gap-2 px-3 py-2.5">
                          {group.models.map((model) => (
                            <span key={model} className="rounded-md bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft">{model}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 写 simple-application-page.tsx(家居/办公/工业复用)**

```tsx
import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { container } from "./catalog";
import type { SimpleApplication } from "@/content/live-site/applications";

export default function SimpleApplicationPage({ app }: { app: SimpleApplication }) {
  return (
    <section className={`${container} py-14`}>
      <h1 className="sr-only">{app.title}阻尼器应用 | 特澳 TEAO</h1>
      <SectionHead eyebrow="应用案例" title={`${app.title}阻尼器应用`} description={app.description} />
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
            <Image src={app.image} alt={app.title} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mb-4 text-2xl font-bold">{app.title}领域的阻尼应用</h2>
          <p className="mb-7 text-muted leading-relaxed">{app.description}。欢迎提供应用位置、目标扭矩与安装空间,特澳可推荐标准阻尼平台或按结构空间定制方案。</p>
          <Button href="/contact">获取报价 →</Button>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 验证**

Run: `npx tsc --noEmit`
Expected: TSC 无错误。

- [ ] **Step 6: 提交**

```bash
git add src/components/live-site/applications-page.tsx src/components/live-site/automotive-overview-page.tsx src/components/live-site/application-scenes-page.tsx src/components/live-site/simple-application-page.tsx
git commit -m "feat: add applications page components"
```

---

### Task 5: 页面集成 + metadata + JSON-LD

**Files:**
- Modify: `src/app/[...legacyPath]/page.tsx`

**Interfaces:**
- Consumes: 4 个组件(Task 4)、数据(Task 3)、`ApplicationPageType` 常量(Task 1)。
- Produces: 7 个叶子 URL 的本地渲染 + metadata + JSON-LD。

- [ ] **Step 1: 增加 import 与 META 常量**

在 `src/app/[...legacyPath]/page.tsx` 顶部 import:

```ts
import ApplicationsPage from "@/components/live-site/applications-page";
import AutomotiveOverviewPage from "@/components/live-site/automotive-overview-page";
import ApplicationScenesPage from "@/components/live-site/application-scenes-page";
import SimpleApplicationPage from "@/components/live-site/simple-application-page";
import { getPilotPage, LIVE_ORIGIN, PILOT_PRODUCT_PATH, QUALITY_PATH, FAQ_PATH, APPLICATIONS_PATH, AUTOMOTIVE_INTERIOR_PATH, INTERIOR_PATH, EXTERIOR_PATH, HOME_LIFE_PATH, OFFICE_EQUIPMENT_PATH, INDUSTRIAL_APPLICATION_PATH } from "@/lib/live-site";
import { applicationCards, automotiveInteriorScenes, automotiveExteriorScenes, simpleApplications } from "@/content/live-site/applications";
```

在 `FAQ_META` 之后追加 7 个 metadata 常量(noindex + canonical):

```ts
const noindex = { index: false, follow: true } as const;
const canon = (p: string): Metadata["alternates"] => ({ canonical: LIVE_ORIGIN + p });

const APPLICATIONS_META: Metadata = {
  title: { absolute: "应用案例 | 阻尼器应用场景 | 特澳 TEAO" },
  description: "特澳阻尼器应用案例:汽车内外饰、家居、办公设备与工业设备。齿轮阻尼器、轴向阻尼器、锁扣与定制模块的典型应用。",
  alternates: canon(APPLICATIONS_PATH), robots: noindex,
};
const AUTOMOTIVE_INTERIOR_META: Metadata = {
  title: { absolute: "汽车内外饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车内饰与外饰阻尼器应用:中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒、遮阳板、外门把手与充电口盖。",
  alternates: canon(AUTOMOTIVE_INTERIOR_PATH), robots: noindex,
};
const INTERIOR_META: Metadata = {
  title: { absolute: "汽车内饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车内饰阻尼器应用场景:中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的软开、缓降与回弹控制。",
  alternates: canon(INTERIOR_PATH), robots: noindex,
};
const EXTERIOR_META: Metadata = {
  title: { absolute: "汽车外饰阻尼器应用 | 特澳 TEAO" },
  description: "汽车外饰阻尼器应用场景:平嵌式/常规外门把手与新能源汽车充电口盖的软开、软关与防撞击控制。",
  alternates: canon(EXTERIOR_PATH), robots: noindex,
};
const HOME_LIFE_META: Metadata = {
  title: { absolute: "家居阻尼器应用 | 特澳 TEAO" },
  description: "家居阻尼器应用:马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。",
  alternates: canon(HOME_LIFE_PATH), robots: noindex,
};
const OFFICE_EQUIPMENT_META: Metadata = {
  title: { absolute: "办公设备阻尼器应用 | 特澳 TEAO" },
  description: "办公设备阻尼器应用:打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。",
  alternates: canon(OFFICE_EQUIPMENT_PATH), robots: noindex,
};
const INDUSTRIAL_APPLICATION_META: Metadata = {
  title: { absolute: "工业设备阻尼器应用 | 特澳 TEAO" },
  description: "工业设备阻尼器应用:检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。",
  alternates: canon(INDUSTRIAL_APPLICATION_PATH), robots: noindex,
};
```

- [ ] **Step 2: generateMetadata 增加分支**

在 `generateMetadata` 的 `if (type === "faq") return FAQ_META;` 之后追加:

```ts
  if (type === "applications") return APPLICATIONS_META;
  if (type === "automotive-interior") return AUTOMOTIVE_INTERIOR_META;
  if (type === "interior") return INTERIOR_META;
  if (type === "exterior") return EXTERIOR_META;
  if (type === "home-life") return HOME_LIFE_META;
  if (type === "office-equipment") return OFFICE_EQUIPMENT_META;
  if (type === "industrial-application") return INDUSTRIAL_APPLICATION_META;
```

- [ ] **Step 3: 页面渲染增加分支**

在 `LegacyPage` 的 `if (type === "faq") return <FaqPage />;` 之后追加:

```tsx
  if (type === "applications") return <ApplicationsPage />;
  if (type === "automotive-interior") return <AutomotiveOverviewPage />;
  if (type === "interior") return <ApplicationScenesPage eyebrow="汽车内饰" title="汽车内饰阻尼器应用" description="中控扶手箱盖、手套箱、内门把手、顶棚拉手、眼镜盒与遮阳板的阻尼应用场景。" scenes={automotiveInteriorScenes} />;
  if (type === "exterior") return <ApplicationScenesPage eyebrow="汽车外饰" title="汽车外饰阻尼器应用" description="外门把手与新能源汽车充电口盖的阻尼应用场景。" scenes={automotiveExteriorScenes} />;
  if (type === "home-life") return <SimpleApplicationPage app={simpleApplications[0]} />;
  if (type === "office-equipment") return <SimpleApplicationPage app={simpleApplications[1]} />;
  if (type === "industrial-application") return <SimpleApplicationPage app={simpleApplications[2]} />;
```

- [ ] **Step 4: 首页与总览加 JSON-LD(CollectionPage)**

在 `ApplicationsPage`/`AutomotiveOverviewPage` 组件(或 page.tsx 内联)加 `<script type="application/ld+json">`。由于组件为 server component,在各自组件文件内联即可。为保持与 quality-page.tsx 一致,在 `applications-page.tsx` 顶部追加:

```ts
const applicationsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "应用案例",
  description: "特澳阻尼器应用案例:汽车内外饰、家居、办公设备与工业设备。",
  url: "https://www.chinateao.com/applications/",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: applicationCards.map((card, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Thing", name: card.title, url: "https://www.chinateao.com" + card.href },
    })),
  },
};
```

并在 `ApplicationsPage` 的 `<section>` 之前返回 `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationsJsonLd) }} />`(用 `<>...</>` 包裹)。

同样在 `automotive-overview-page.tsx` 加 CollectionPage JSON-LD(name「汽车内外饰」,itemListElement 为内饰/外饰两项)。

- [ ] **Step 5: 验证 build 通过**

Run: `npx tsc --noEmit && npm run build`
Expected: TSC 无错误;build 成功,`/[...legacyPath]` 仍为 ƒ 动态路由。

- [ ] **Step 6: 提交**

```bash
git add src/app/[...legacyPath]/page.tsx src/components/live-site/applications-page.tsx src/components/live-site/automotive-overview-page.tsx
git commit -m "feat: render applications leaves with metadata and JSON-LD"
```

---

### Task 6: 全站验证

**Files:** 无(仅验证)。

- [ ] **Step 1: 测试 + 类型 + lint + build**

Run:
```bash
npx tsx --test src/lib/live-site.test.ts
npx tsc --noEmit
npm run lint
npm run build
```
Expected: 测试全过;TSC 0 error;lint 0 error(允许 1 个既有 warning:partner-section.tsx `<img>`);build 成功。

- [ ] **Step 2: 起服务验证 7 个 URL**

Run:
```bash
npm run start  # 后台;若 3000 被占,先 kill
for p in "/applications/" "/applications/automotive-interior/" "/applications/automotive-interior/internal/" "/applications/automotive-interior/external/" "/applications/home-life/" "/applications/office-equipment/" "/applications/industrial-application/"; do
  echo "== $p =="; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$p"
done
```
Expected: 7 个 URL 均 200。

- [ ] **Step 3: 验证内容、noindex、canonical、gif、JSON-LD、Header**

Run:
```bash
curl -s http://localhost:3000/applications/ | grep -oE '汽车内外饰|家居|办公设备|工业设备' | sort -u
curl -s http://localhost:3000/applications/ | grep -oE 'noindex|chinateao.com/applications/' | sort -u
curl -s http://localhost:3000/applications/automotive-interior/internal/ | grep -oE 'unoptimized|Center console lid.gif|手套箱' | sort -u
curl -s http://localhost:3000/applications/ | grep -oE 'CollectionPage|ItemList' | sort -u
curl -s http://localhost:3000/ | grep -oE 'href="[^"]*applications[^"]*"' | sort -u
```
Expected:
- 首页 4 卡片中文标题齐;noindex + canonical 指向 `chinateao.com/applications/`;JSON-LD 含 CollectionPage/ItemList。
- internal 页含 gif `unoptimized`、`Center console lid.gif`、场景标题「手套箱」。
- **Header 应用领域 href 变为本地 `/applications/`(不再 `https://www.chinateao.com/applications/`)**。

- [ ] **Step 4: 浏览器抽查(桌面 1440 + 移动 390)**

确认:7 个 URL 无横向溢出;gif 正常播放;产品组标题链接可点、跳分类页;Header「应用领域」点击进入本地首页。

- [ ] **Step 5: 提交(如验证中发现内容/样式修正)**

```bash
git add -A
git commit -m "fix: applications verification fixes"
```

---

## Self-Review 备注

- **Spec 覆盖**:§5 路由(Task 1)、§6 数据(Task 3)、§7 组件(Task 4)、§8 SEO(Task 5)、§9 图片(Task 2)、§10 测试(Task 1/6)、§11 验收(Task 6)。
- **Ruling(术语)**:产品组标题采用 spec §6 注释的中文术语「轴向阻尼器 / 同步器」,链接到分类路径 `/axial-dampers/`(中文站分类名「圆筒阻尼器」,同一产品线)、`/qitaqichelingbujian/`(中文站分类名「其他零部件」,同步器归入)—— spec §6 注释即以此命名,§4.4 映射表给出路径;两者并无可执行冲突,沿用 spec 术语。cost if wrong:产品组标题与分类页标题措辞不完全一致(轴向阻尼器 vs 圆筒阻尼器),但不影响跳转正确性。
- **Ruling(Header)**:Header 无需改动——`liveHref("/applications/")` 在 Task 1 后自动返回本地,Task 6 Step 3 验证钉住。
