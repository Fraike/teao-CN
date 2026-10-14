# 质量控制 + FAQ 栏目承接 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 本地承接线上 `/quality-control/` 与 `/faq/` 两个栏目,URL 原样、内容中文、图片复用英文站。

**Architecture:** 沿用已跑通的分类承接模式——内容数据文件(`src/content/live-site/*.ts`) + 展示组件(`src/components/live-site/*.tsx`) + catch-all 路由白名单([...legacyPath]/page.tsx)。图标用已安装的 lucide-react,复用 `ui/section-head`、`ui/reveal` 与 `catalog.tsx` 导出的 `container`。

**Tech Stack:** Next.js(App Router,async params)、React、TypeScript、Tailwind CSS(设计令牌)、lucide-react、node:test(tsx --test)。

**Spec:** [docs/superpowers/plans/2026-09-10-quality-faq-sections.md](./2026-09-10-quality-faq-sections.md)

## Global Constraints

- URL 原样保留:`/quality-control/`、`/faq/`(带尾斜杠)。
- 两页 `robots: { index: false, follow: true }`(noindex,与现有样板一致)。
- canonical 指向线上原址 `https://www.chinateao.com` + 原路径。
- 质量页**不出现**寿命数字(如 `100,000`、`30,000`)与认证年份(`since 2016`)。
- FAQ **不含**海外销售条款(MOQ、支付方式、货币、国际物流 FOB/CIF)。
- 素材复用英文站:`/images/company/visual-inspection.webp`、`visual-inspection-2.webp` 已在中文站就位。
- 遵循现有 `[...legacyPath]/page.tsx` 的 async params + `generateMetadata` 写法,不用旧版同步 params。

## Review Focus

1. `/quality-control`(无尾斜杠)与 `/faq` 也要正确解析 → Task 1 测试覆盖。
2. 未知路径仍跳线上原址、本地锚点不跳走(liveHref 不回归)→ Task 1 测试覆盖。
3. `faq.ts` 不得残留海外销售词汇(MOQ/T/T/FOB/USD 等)→ Task 3 加 grep 检查。
4. `quality.ts` 不得出现寿命数字(100,000 / 30,000)→ Task 2 加 grep 检查。
5. 手套箱空格的现有编码回归不受影响 → Task 4 全量测试覆盖(现有测试保留)。

---

### Task 1: 路由层扩展

**Files:**
- Modify: `src/lib/live-site.ts`
- Test: `src/lib/live-site.test.ts`

**Interfaces:**
- Produces: `QUALITY_PATH = "/quality-control/"`、`FAQ_PATH = "/faq/"`;`getPilotPage` 新增返回 `"quality" | "faq"`。

- [ ] **Step 1: 写失败测试**

在 `src/lib/live-site.test.ts` 末尾追加:

```ts
import { getPilotPage, developmentCategoryPath, liveCategories, liveHref, LIVE_ORIGIN, PILOT_PRODUCT_PATH, QUALITY_PATH, FAQ_PATH } from "./live-site";

test("quality and faq sections resolve locally, with and without trailing slash", () => {
  assert.equal(getPilotPage(["quality-control"]), "quality");
  assert.equal(getPilotPage(["faq"]), "faq");
  assert.equal(getPilotPage(["quality-control", "x"]), null);
  assert.equal(liveHref("/quality-control/"), "/quality-control/");
  assert.equal(liveHref("/quality-control"), "/quality-control");
  assert.equal(liveHref("/faq/"), "/faq/");
});

test("unknown and near-miss paths still go to the live origin", () => {
  assert.equal(liveHref("/quality/"), LIVE_ORIGIN + "/quality/");
  assert.equal(liveHref("/faqs/"), LIVE_ORIGIN + "/faqs/");
});
```

注意:顶部 import 行原本没有 `QUALITY_PATH, FAQ_PATH`,需把这两个名字并入既有 import。

- [ ] **Step 2: 运行测试确认失败**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: FAIL(`QUALITY_PATH` 未导出 / `getPilotPage` 返回 null)。

- [ ] **Step 3: 实现路由扩展**

在 `src/lib/live-site.ts` 的 `PILOT_PRODUCT_PATH` 附近新增常量:

```ts
export const QUALITY_PATH = "/quality-control/";
export const FAQ_PATH = "/faq/";
```

将 `getPilotPage` 的返回类型改为 `"category" | "product" | "quality" | "faq" | null`,并在 `return null` 前插入:

```ts
  if (path + "/" === QUALITY_PATH) return "quality";
  if (path + "/" === FAQ_PATH) return "faq";
```

(放在 `if (path === PILOT_PRODUCT_PATH) return "product";` 之后、`return null;` 之前即可。`liveHref` 无需改动——它已通过 `getPilotPage` 判本地/线上。)

- [ ] **Step 4: 运行测试确认通过**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: 全部通过(原 8 项 + 新增 2 项)。

- [ ] **Step 5: 提交(如用户要求提交则执行)**

```bash
git add src/lib/live-site.ts src/lib/live-site.test.ts
git commit -m "feat: route quality-control and faq sections locally"
```

---

### Task 2: 质量控制页

**Files:**
- Create: `src/content/live-site/quality.ts`
- Create: `src/components/live-site/quality-page.tsx`
- Modify: `src/app/[...legacyPath]/page.tsx`

**Interfaces:**
- Consumes: `container`(from `./catalog`)、`liveHref`(from `@/lib/live-site`)、`ui/section-head`、`ui/reveal`。
- Produces: `QualityPage`(默认导出组件,无 props);`QUALITY_PATH` 用于 metadata。

- [ ] **Step 1: 写数据文件**

创建 `src/content/live-site/quality.ts`(全文):

```ts
// TEAO 中文站 — 质量控制页数据
// 基于英文站 src/app/quality/page.tsx 本地化;图片复用英文站 public/images/company/

export const inspectionCards = [
  {
    badge: "100% 扭矩检测",
    title: "每件必测,无一例外",
    image: "/images/company/visual-inspection-2.webp",
    points: [
      "出货前对每一件产品进行 100% 扭矩检测",
      "支持单向、双向及定制扭矩曲线",
      "在 -40°C ~ +110°C 环境下扭矩稳定",
      "实时数据记录,支持完整批次追溯",
    ],
  },
  {
    badge: "100% 外观检测",
    title: "每个表面,逐件检查",
    image: "/images/company/visual-inspection.webp",
    points: [
      "100% 外观检测,确认表面质量与一致性",
      "缺陷分类:毛边、缩痕、色差、尺寸",
      "标准化作业指导书与明确接收标准",
      "高分辨率光学检测 + 培训后人工复核",
    ],
  },
];

export const engineeringCapabilities = [
  { title: "小体积大扭矩", description: "在紧凑、受限空间内实现高扭矩输出。" },
  { title: "长寿命设计", description: "通过材料与结构优化延长产品使用寿命。" },
  { title: "宽温域稳定", description: "-40°C ~ +110°C 环境温度下保持稳定阻尼性能。" },
  { title: "单向阻尼", description: "单方向精确控制阻尼——顺开、紧合。" },
  { title: "定制调校", description: "按目标扭矩、速度与手感要求调校阻尼曲线。" },
  { title: "低温度敏感性", description: "黏度稳定的硅油配方,降低温度循环下的性能漂移。" },
];

export const labGroups = [
  {
    label: "力学检测",
    items: [
      { equipment: "数显推拉力计", range: "0.25 ~ 500N", accuracy: "±0.25N" },
      { equipment: "扭矩计", range: "10g ~ 6000g", accuracy: "±0.1g" },
      { equipment: "扭矩测试仪", range: "1 ~ 100 圈", accuracy: "内部标准" },
    ],
  },
  {
    label: "环境检测",
    items: [
      { equipment: "环境试验箱", range: "-40°C ~ +110°C", accuracy: "±1°C" },
      { equipment: "高温试验箱", range: "-40°C ~ +110°C", accuracy: "±1°C" },
      { equipment: "温度计", range: "-40°C ~ +110°C", accuracy: "±1°C" },
    ],
  },
  {
    label: "耐久与检验",
    items: [
      { equipment: "寿命测试机", range: "长寿命循环", accuracy: "内部标准" },
      { equipment: "光学投影仪", range: "X200mm × Y100mm", accuracy: "0.001mm" },
      { equipment: "橡胶硬度计", range: "0 ~ 100A", accuracy: "±1A" },
    ],
  },
  {
    label: "精密测量",
    items: [
      { equipment: "数显卡尺 / 高度尺", range: "0 ~ 150mm", accuracy: "0.01mm" },
      { equipment: "电子天平", range: "0.000001 ~ 150kg", accuracy: "0.000001kg" },
      { equipment: "黏度测试仪", range: "0.1 ~ 60 圈", accuracy: "1mPa" },
    ],
  },
];

export const iatfNote = {
  title: "IATF 16949 认证质量管理体系",
  description:
    "特澳以 IATF 16949 汽车行业质量管理体系运行,覆盖从设计、原材料采购到生产、检测与售后服务的全产品生命周期。通过客户反馈、内部审核与定期管理评审持续改进。",
  ctaLabel: "查看认证资质",
  ctaHref: "/about",
};
```

- [ ] **Step 2: grep 校验无寿命数字**

Run: `grep -nE "100,000|30,000|since" src/content/live-site/quality.ts`
Expected: 无输出(命中则为失败,需改写)。

- [ ] **Step 3: 写组件**

创建 `src/components/live-site/quality-page.tsx`(全文):

```tsx
import Image from "next/image";
import Link from "next/link";
import { Gauge, Eye, Clock, Thermometer, Target, Sliders, Waves, Shield } from "lucide-react";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { liveHref } from "@/lib/live-site";
import { container } from "./catalog";
import { inspectionCards, engineeringCapabilities, labGroups, iatfNote } from "@/content/live-site/quality";

const inspectionIcons = [Gauge, Eye];
const capabilityIcons = [Gauge, Clock, Thermometer, Target, Sliders, Waves];

export default function QualityPage() {
  return (
    <>
      <section className={`${container} py-14`}>
        <SectionHead
          eyebrow="质量控制"
          title="每一件阻尼器,都有据可查"
          description="IATF 16949 认证体系,100% 扭矩检测与 100% 外观检测,从原材料到成品的批次可追溯。"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {inspectionCards.map((card, i) => {
            const Icon = inspectionIcons[i];
            return (
              <Reveal key={card.badge} delay={((i % 2) + 1) as 1 | 2}>
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="relative h-[220px] overflow-hidden bg-surface">
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
                  </div>
                  <div className="p-7">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                        <Icon className="h-7 w-7 text-brand-700" />
                      </span>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{card.badge}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                      {card.points.map(point => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className={`${container} py-14`}>
          <SectionHead eyebrow="工程能力" title="按你的需求调校每一款阻尼器" description="从扭矩、方向到安装结构,工程团队可按应用要求调整关键参数。" />
          <div className="grid gap-5 sm:grid-cols-2">
            {engineeringCapabilities.map((cap, i) => {
              const Icon = capabilityIcons[i];
              return (
                <Reveal key={cap.title} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
                  <div className="flex gap-5 rounded-2xl border border-line bg-white p-6 transition-colors hover:border-brand-500/30">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
                      <Icon className="h-5 w-5 text-brand-700" />
                    </span>
                    <div>
                      <h4 className="text-[15px] font-bold text-ink">{cap.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{cap.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${container} py-14`}>
        <SectionHead eyebrow="实验室" title="经校准设备提供的清晰验证数据" description="特澳实验室支持扭矩、寿命、尺寸与环境验证,满足汽车级质量控制要求。" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {labGroups.map((group, gi) => (
            <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-2xl border border-line bg-white p-5">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">{group.label}</h4>
                <ul className="space-y-4">
                  {group.items.map(item => (
                    <li key={item.equipment}>
                      <div className="text-[13px] font-bold leading-snug text-ink">{item.equipment}</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <span className="rounded-lg bg-surface px-2.5 py-2 text-muted">
                          <span className="block text-[9px] font-bold uppercase tracking-wider">量程</span>
                          <span className="mt-0.5 block font-bold">{item.range}</span>
                        </span>
                        <span className="rounded-lg bg-surface px-2.5 py-2 text-muted">
                          <span className="block text-[9px] font-bold uppercase tracking-wider">精度</span>
                          <span className="mt-0.5 block font-bold">{item.accuracy}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${container} pb-14`}>
        <div className="flex items-start gap-5 rounded-2xl border border-line bg-gradient-to-br from-surface to-white p-8 sm:p-10">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
            <Shield className="h-7 w-7 text-brand-700" />
          </span>
          <div>
            <h3 className="text-xl font-bold">{iatfNote.title}</h3>
            <p className="mb-6 mt-3 leading-relaxed text-muted">{iatfNote.description}</p>
            <Link href={iatfNote.ctaHref} className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-7 py-3.5 text-sm font-bold text-ink-soft transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700">
              {iatfNote.ctaLabel} →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className={`${container} py-14 text-center`}>
          <Reveal>
            <h2 className="text-[28px] font-bold tracking-tight sm:text-[34px]">需要验证过的质量数据?</h2>
            <p className="mx-auto mb-8 mt-4 max-w-xl text-[15px] text-muted">可索取 PPAP 文档、扭矩测试报告与质量认证,用于你的项目评估。</p>
            <a href={liveHref("/contacts/")} className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] transition-all hover:-translate-y-0.5">
              索取质量文档 →
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: 接入路由 + metadata**

修改 `src/app/[...legacyPath]/page.tsx`:

新增 import(顶部):
```tsx
import QualityPage from "@/components/live-site/quality-page";
import { getPilotPage, LIVE_ORIGIN, PILOT_PRODUCT_PATH, QUALITY_PATH } from "@/lib/live-site";
```
(`FAQ_PATH` 与 `FaqPage` 留到 Task 3 再加。)

新增 metadata 常量(文件顶部,`Props` 之前):
```tsx
const QUALITY_META: Metadata = {
  title: { absolute: "质量控制 | IATF 16949 认证 · 100% 扭矩检测 | 特澳 TEAO" },
  description: "IATF 16949 认证质量管理体系,100% 扭矩检测与 100% 外观检测。实验室支持扭矩、寿命、尺寸与环境验证,提供 PPAP 与扭矩测试报告。",
  alternates: { canonical: LIVE_ORIGIN + QUALITY_PATH },
  robots: { index: false, follow: true },
};
```

`generateMetadata` 内,在 `const type = getPilotPage(segments);` 之后加:
```tsx
  if (type === "quality") return QUALITY_META;
```

`LegacyPage` 内,在 `const type = getPilotPage(segments);` 之后加:
```tsx
  if (type === "quality") return <QualityPage />;
```

- [ ] **Step 5: 类型检查 + 构建验证**

Run: `npx tsc --noEmit`(若项目无此脚本则 `npm run build`)
Expected: 通过。

- [ ] **Step 6: 提交(如用户要求提交则执行)**

```bash
git add src/content/live-site/quality.ts src/components/live-site/quality-page.tsx src/app/\[...legacyPath\]/page.tsx
git commit -m "feat: add quality-control section"
```

---

### Task 3: FAQ 页

**Files:**
- Create: `src/content/live-site/faq.ts`
- Create: `src/components/live-site/faq-page.tsx`
- Modify: `src/app/[...legacyPath]/page.tsx`

**Interfaces:**
- Consumes: `container`(from `./catalog`)、`ui/section-head`、`ui/reveal`。
- Produces: `FaqPage`(默认导出组件,无 props);`FAQ_PATH` 用于 metadata。

- [ ] **Step 1: 写数据文件(国内口径,无海外条款)**

创建 `src/content/live-site/faq.ts`(全文):

```ts
// TEAO 中文站 — 常见问题数据
// 基于英文站 src/content/faq.ts 本地化,重写为国内询盘口径,删除海外销售条款

export const faqGroups = [
  {
    label: "产品与能力",
    items: [
      {
        q: "特澳(TEAO)是谁?",
        a: "东莞市特澳电子科技有限公司,专注阻尼器、缓冲器、门锁与运动控制零部件的研发、生产、销售与 OEM。2001 年成立,总部位于广东东莞,持有 IATF 16949 认证,年产能 8000 万件,服务 200+ 客户,覆盖汽车、家电、医疗、工业等领域。",
      },
      {
        q: "特澳能为我做什么?",
        a: "提供全系列标准阻尼器,并支持从概念到量产的完整定制:工程设计、扭矩计算、快速打样、自有模具、自动装配、100% 检测、PPAP 文档与交付。标准平台产品或完全定制方案均可。",
      },
      {
        q: "特澳生产哪些类型的阻尼器?",
        a: "五大产品线:齿轮阻尼器(旋转阻尼器)、圆筒/轴向阻尼器(线性阻尼器)、手套箱阻尼器、锁扣、定制阻尼模块。每类都可按扭矩、阻尼方向、力值曲线、行程和安装方式定制。",
      },
      {
        q: "能针对我们的具体应用定制吗?",
        a: "可以,定制阻尼器是特澳核心能力。提供图纸、目标扭矩、空间包络与应用需求,工程团队会评估并推荐标准平台或设计定制方案。",
      },
      {
        q: "齿轮阻尼器和圆筒阻尼器有什么区别?",
        a: "齿轮阻尼器(也称旋转阻尼器)提供旋转运动阻尼,用于杯托、扶手、储物门等;圆筒/轴向阻尼器(也称线性阻尼器)沿直线行程提供阻尼力,用于拉手、手套箱、滑动机构等。由应用的运动路径决定选型。",
      },
      {
        q: "汽车内饰通常用哪些阻尼器?",
        a: "杯托、内门把手等旋转机构常用齿轮/旋转阻尼器;拉手、扶手、顶置控制台常用圆筒/轴向阻尼器;手套箱缓降常用手套箱阻尼器。",
      },
      {
        q: "支持单向阻尼吗?",
        a: "支持。可配置为单向阻尼——一个方向阻力极小,反方向受控阻尼,常用于 push-push 机构、手套箱门等需自由打开、缓慢闭合的场景。",
      },
    ],
  },
  {
    label: "定制与选型",
    items: [
      {
        q: "怎么选择合适的目标扭矩?",
        a: "扭矩选型取决于盖板/门的重量、尺寸与期望关闭速度。提供应用参数(重量、力臂长度、目标关闭时间),工程团队会计算所需扭矩。",
      },
      {
        q: "支持充电口盖阻尼器吗?",
        a: "支持。可评估充电口盖的软开、防撞击、降噪、温度稳定、运动方向与安装空间,推荐齿轮阻尼器、圆筒阻尼器或定制模块。",
      },
      {
        q: "什么是无硅氧烷(SOC-free)硅油?",
        a: "无硅氧烷硅油消除了挥发性硅氧烷化合物,避免其在汽车内饰中挥发并导致电气接触失效。特澳提供 SOC-free 阻尼器型号,适用于靠近电子元件的应用。",
      },
      {
        q: "能按我们现有供应商的扭矩匹配吗?",
        a: "可以。提供目标扭矩值(N·m、gf·cm 或 kgf·cm)与公差带,工程团队会调整硅油黏度与内部结构,匹配或优化现有规格。",
      },
    ],
  },
  {
    label: "样品与打样",
    items: [
      {
        q: "量产前能打样吗?",
        a: "可以。特澳提供原型样与量产前样品供装配验证。标准平台样品一般 2-3 周交付;定制设计需工程评审与开模周期,视复杂度一般 4-8 周。",
      },
      {
        q: "支持小批量吗?",
        a: "支持。特澳支持小批量与原型订单,用于工程验证后再放大到量产。",
      },
      {
        q: "批量订单交期多久?",
        a: "约 5000 件的批量订单,交期约 9 天。需新开模的订单另加模具制造与验证时间;复购订单因模具已就位通常更快。",
      },
    ],
  },
  {
    label: "质量与检测",
    items: [
      {
        q: "有哪些质量认证?",
        a: "特澳按 IATF 16949 质量管理体系运行,并持有 ISO 14001 环境管理体系认证。每件阻尼器经过 100% 扭矩检测与 100% 外观检测,支持完整批次追溯。",
      },
      {
        q: "提供 PPAP 文档吗?",
        a: "支持。可按汽车客户要求提供 PPAP(生产件批准程序)文档,常规交付包括尺寸报告、材质证明、扭矩检测数据(100% 检测记录)、过程流程图与 PFMEA。",
      },
      {
        q: "做 DV/PV 验证测试吗?",
        a: "做。特澳在自有实验室开展 DV/PV 测试,包括寿命耐久、环境试验(-40°C ~ +110°C)、振动测试与耐化学验证,每个验证阶段提供测试报告。",
      },
      {
        q: "每批订单附哪些报告?",
        a: "每批附带合格证明(CoC)、扭矩测试统计汇总、关键尺寸检测报告(Cpk 数据)与材质证明。所有原材料与成品按批次号全程追溯。",
      },
      {
        q: "温度会影响阻尼性能吗?",
        a: "会,扭矩随温度变化源于硅油黏度变化。特澳阻尼器在 -40°C ~ +110°C 区间验证;温度极端应用可推荐特定油品与内部设计以降低扭矩波动。",
      },
    ],
  },
  {
    label: "交付与质保",
    items: [
      {
        q: "质保期多久?",
        a: "特澳提供覆盖材料与工艺缺陷的标准质保,质保条款在供货协议中约定,通常对齐汽车行业标准;长期项目可协商延长质保。",
      },
      {
        q: "包装方式是什么?",
        a: "产品采用出口级纸箱包装,单品袋保护;可按需定制包装与标签,确保运输安全。",
      },
    ],
  },
  {
    label: "应用与行业",
    items: [
      {
        q: "服务哪些行业?",
        a: "汽车(主机厂与 Tier-1)、卫浴、家电、办公设备与工业零部件领域。",
      },
      {
        q: "年产能多少?",
        a: "年产能 8000 万件,依托自有模具、注塑成型、自动装配与检测。",
      },
      {
        q: "有哪些安装方式?",
        a: "支持卡扣、螺钉、夹持、压入及定制支架等多种安装方式,根据壳体设计与装配工艺选定。",
      },
    ],
  },
];
```

- [ ] **Step 2: grep 校验无海外条款**

Run: `grep -niE "MOQ|T/T|L/C|FOB|CIF|USD|EUR|wire transfer|freight|consignment|VMI|retail" src/content/live-site/faq.ts`
Expected: 无输出(命中则为失败,需改写)。

- [ ] **Step 3: 写组件**

创建 `src/components/live-site/faq-page.tsx`(全文):

```tsx
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { container } from "./catalog";
import { faqGroups } from "@/content/live-site/faq";

export default function FaqPage() {
  return (
    <section className={`${container} py-14`}>
      <SectionHead
        eyebrow="常见问题"
        title="阻尼器定制与选型,快速答疑"
        description="关于特澳产品、定制能力、交期与询盘的常见问题解答。"
      />
      <div className="mx-auto max-w-3xl space-y-10">
        {faqGroups.map((group, gi) => (
          <Reveal key={group.label} delay={(Math.min(gi, 2) + 1) as 1 | 2 | 3}>
            <section>
              <h2 className="mb-4 text-lg font-bold text-ink">{group.label}</h2>
              <div className="divide-y divide-line-soft rounded-xl border border-line bg-white">
                {group.items.map(item => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink">
                      {item.q}
                      <span className="shrink-0 text-brand-700 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-7 text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 接入路由 + metadata**

修改 `src/app/[...legacyPath]/page.tsx`:

新增 import(合并进 Task 2 已加的 import):
```tsx
import FaqPage from "@/components/live-site/faq-page";
import { getPilotPage, LIVE_ORIGIN, PILOT_PRODUCT_PATH, QUALITY_PATH, FAQ_PATH } from "@/lib/live-site";
```

新增 metadata 常量:
```tsx
const FAQ_META: Metadata = {
  title: { absolute: "常见问题 | 阻尼器定制与选型 FAQ | 特澳 TEAO" },
  description: "关于特澳阻尼器定制、扭矩选型、打样、交期、质量认证与询盘的常见问题解答。",
  alternates: { canonical: LIVE_ORIGIN + FAQ_PATH },
  robots: { index: false, follow: true },
};
```

`generateMetadata` 内 `if (type === "quality") return QUALITY_META;` 之后加:
```tsx
  if (type === "faq") return FAQ_META;
```

`LegacyPage` 内 `if (type === "quality") return <QualityPage />;` 之后加:
```tsx
  if (type === "faq") return <FaqPage />;
```

- [ ] **Step 5: 类型检查 + 构建验证**

Run: `npx tsc --noEmit`(或 `npm run build`)
Expected: 通过。

- [ ] **Step 6: 提交(如用户要求提交则执行)**

```bash
git add src/content/live-site/faq.ts src/components/live-site/faq-page.tsx src/app/\[...legacyPath\]/page.tsx
git commit -m "feat: add faq section"
```

---

### Task 4: 全量验证

**Files:**
- 无新增;验证整站。

- [ ] **Step 1: 回归测试**

Run: `npx tsx --test src/lib/live-site.test.ts`
Expected: 全部通过(含原手套箱空格编码回归测试)。

- [ ] **Step 2: lint**

Run: `npm run lint`
Expected: 无错误(允许 partner-section 既有 img 性能提示)。

- [ ] **Step 3: 生产构建**

Run: `npm run build`
Expected: 成功,`/quality-control`、`/faq` 生成静态页。

- [ ] **Step 4: 本地浏览器检查**

Run: `npm run start`(或项目现有启动方式),浏览器访问:
- `http://localhost:3000/quality-control/` → 200,标题「质量控制 | IATF 16949 认证 · 100% 扭矩检测 | 特澳 TEAO」,含双检测卡片、工程能力、实验室设备、IATF 说明、CTA。
- `http://localhost:3000/faq/` → 200,标题「常见问题 | 阻尼器定制与选型 FAQ | 特澳 TEAO」,6 组手风琴可展开。
- `http://localhost:3000/quality-control`(无尾斜杠)→ 200 或重定向到带斜杠版本,不 404。
- 桌面 1440px + 移动 390px 下无横向溢出。
- 检查页面 `<head>` 有 `noindex`、canonical 指向 `https://www.chinateao.com/quality-control/` 与 `/faq/`。

- [ ] **Step 5: 汇报**

汇总验证结果,附本地预览地址与遗留问题(如有)。

---

## Self-Review 记录

- **Spec 覆盖**:spec 的 5(路由)、6(数据模型)、8(组件)、9(SEO)、10(测试)均有对应 Task;第 7 节 FAQ 去留映射落实在 Task 3 的 faq.ts 内容与 Step 2 grep。
- **占位符扫描**:无 TBD/TODO;所有代码块为完整可编译内容。
- **类型一致**:`QUALITY_PATH`/`FAQ_PATH` 在 Task 1 定义,Task 2/3 消费;`QualityPage`/`FaqPage` 为无 props 默认导出。
- **Review Focus**:5 条均有对应测试/grep/验证步骤(Task 1 测试、Task 2 Step 2 grep、Task 3 Step 2 grep、Task 4 全量)。
