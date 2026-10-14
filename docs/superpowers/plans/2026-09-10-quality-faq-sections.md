# 子项目 A：质量控制 + FAQ 栏目承接

日期：2026-09-10。承接线上 https://www.chinateao.com/ 的 `/quality-control/` 与 `/faq/` 两个栏目。

## 1. 目标与背景

在保留线上 URL 结构的前提下，把「质量控制」和「常见问题」两个栏目本地化承接。内容来源为英文站 teao-website 对应栏目（`src/app/quality/page.tsx`、`src/app/faq/page.tsx`、`src/content/faq.ts`），中文人工本地化；线上原站正文后续能抓到时再替换。沿用已跑通的分类承接模式：数据文件 + 组件 + catch-all 白名单。

## 2. 范围

**In scope**
- `/quality-control/` 质量控制页（静态）
- `/faq/` 常见问题页（静态）
- 两个页面的中文 SEO metadata、canonical、JSON-LD

**Out of scope**
- 联系我们表单与询盘流转（属于「询盘转化」方向）
- 应用案例、新闻、支持/下载、关于/联系 URL 对齐（子项目 B/C）
- 线上原站正文抓取与替换（依赖抓取条件）
- noindex 解除与 sitemap 收录（等整站验收）

## 3. 内容口径（已与用户确认）

1. **FAQ 重写为国内口径**：删除海外销售条款（MOQ、支付方式、货币、国际物流 FOB/CIF、VMI/寄售、年度返点），保留通用技术问答，补充国内询盘流程、交期、样品、质保。
2. **质量页保守原则**：只写已验证事实；有争议的细节（认证年份、寿命次数）不写具体数字。
3. **素材直接复用英文站**：图片、检测设备资料、工程能力文案均从 teao-website 直接拷贝使用。质量页两张检测图 `visual-inspection.webp` / `visual-inspection-2.webp` 已随 about 页拷贝至中文站 `public/images/company/`（英文站 company 目录 10 张已全部就位），无需重复下载。

## 4. 已验证事实清单（可写入页面）

| 事实 | 来源 | 处理 |
|---|---|---|
| IATF 16949 认证 | about 页已用 | 写「IATF 16949 认证」，**不写** since 2016 / 原 TS 16949 |
| ISO 14001 认证 | about 页已用 | 照写 |
| 年产能 8000 万件 | about 页 businessStats + 英文 80 million 一致 | 照写 |
| 100% 扭矩检测 / 100% 外观检测 | 英文 quality 页 + about 页 quality-promise | 照写 |
| 检测设备清单（名称/量程/精度） | 英文 quality 页 LAB_GROUPS | 设备规格可直接翻译 |
| 温度范围 -40°C ~ +110°C | 英文 quality 页（设备量程） | 作为设备量程照写 |

**不写**：产品寿命「>100,000 cycles」与旧站「30,000 次」冲突，寿命数字一律不出现；认证年份、成立年份细节不写。

## 5. 路由设计

扩展 [src/lib/live-site.ts](src/lib/live-site.ts)：

- 新增 `getPilotPage` 返回类型：`"quality"`、`"faq"`
- 白名单新增 `/quality-control/`、`/faq/`（精确匹配，带/不带尾斜杠）
- `liveHref` 对这两条返回本地路径（不再跳到线上原址）
- [src/app/[...legacyPath]/page.tsx](src/app/[...legacyPath]/page.tsx) 增加分支渲染

## 6. 数据模型

### 6.1 `src/content/live-site/quality.ts`

```ts
export interface InspectionCard {
  icon: string;            // lucide 图标名
  badge: string;           // 角标文案
  title: string;
  image: string;           // /images/company/...（英文站已拷贝）
  points: string[];        // 4 条要点
}
export interface EngineeringCapability { icon: string; title: string; description: string; }
export interface LabEquipment { equipment: string; range: string; accuracy: string; }
export interface LabGroup { label: string; items: LabEquipment[]; }

export const inspectionCards: InspectionCard[];   // 2 项
export const engineeringCapabilities: EngineeringCapability[]; // 6 项
export const labGroups: LabGroup[];               // 4 组 × 3 设备
export const iatfNote: { title: string; description: string; ctaLabel: string; ctaHref: string };
```

### 6.2 `src/content/live-site/faq.ts`

```ts
export interface FaqGroup { label: string; items: { q: string; a: string }[]; }
export const faqGroups: FaqGroup[];
```

## 7. FAQ 去留映射（英文 35 条 → 中文国内口径）

英文 7 组，重写为国内 7 组，条目约 22–24 条：

| 英文分组 | 处理 | 中文分组 |
|---|---|---|
| Product & Capability (11) | 保留通用技术问答（公司/产品线/定制/选型/扭矩/单向/SOC-free），删除纯海外表述 | 产品与能力 |
| Ordering & Commercial (8) | **整体删除** MOQ/支付/货币/寄售/返点；保留「长期合作」改写为「合作方式」 | 合作与询盘 |
| Samples & Production (3) | 保留样品/交期/小批量，改写为国内表达（去掉 freight 由客户承担等） | 样品与打样 |
| Quality & Engineering (5) | 保留认证/PPAP/DV-PV/测试报告/温度影响/灭菌，去掉海外 PPAP Level 3 术语过细 | 质量与检测 |
| Shipping & Logistics (3) | 国际物流/出口包装**删除**，保留质保改写为国内 | 交付与质保 |
| Industry & Applications (3) | 保留（行业/产能/安装方式） | 应用与行业 |
| Getting Started (3) | 保留询盘/报价信息，改写联系方式为国内（info@chinateao.com + 电话） | 询盘与选型 |

## 8. 组件设计

### 8.1 `src/components/live-site/quality-page.tsx`
复用 `ui/button`、`ui/reveal`、`ui/section-head`、`container`（从 catalog.tsx 导入），lucide 图标。
Section 顺序：
1. Hero（SectionHead eyebrow「质量控制」+ 双检测卡片 inspectionCards）
2. 工程能力（6 卡片网格，复用 about/core-capabilities 的视觉风格）
3. 实验室能力（4 组设备，每组设备卡：名称 + 量程 + 精度两格）
4. IATF 16949 说明横幅（iatfNote + 按钮跳 /about 或认证区块）
5. CTA（「需要验证数据？」→ 联系页）

### 8.2 `src/components/live-site/faq-page.tsx`
SectionHead + 分组列表（可用 `<details>` 原生手风琴，零依赖），按 faqGroups 渲染。锚点支持每组跳转。

## 9. SEO

- **quality metadata**：`title: "质量控制 | IATF 16949 认证 · 100% 扭矩检测 | 特澳 TEAO"`，中文 description，canonical `https://www.chinateao.com/quality-control/`，robots noindex
- **faq metadata**：`title: "常见问题 | 阻尼器定制与选型 FAQ | 特澳 TEAO"`，canonical `https://www.chinateao.com/faq/`，robots noindex
- **JSON-LD**：质量页 `Organization + hasCredential`；FAQ 页 `FAQPage`。若中文站无 structured-data 工具则内联 `<script type="application/ld+json">`。

## 10. 测试与验证

- 扩展 [src/lib/live-site.test.ts](src/lib/live-site.test.ts)：`/quality-control/`、`/faq/` 返回正确类型；`liveHref` 指向本地；未知路径仍跳线上
- `npx tsx --test src/lib/live-site.test.ts`、`npm run build`、`npm run lint` 通过
- 本地浏览器：两个栏目 HTTP 200、H1/内容匹配、桌面+移动无溢出

## 11. 验收标准

- [ ] 两栏目本地渲染，URL 原样 `/quality-control/`、`/faq/`
- [ ] FAQ 无海外销售条款，内容为国内口径
- [ ] 质量页无寿命数字、无认证年份等未核对声明
- [ ] metadata + canonical + JSON-LD 就位，noindex 保持
- [ ] 回归测试、类型检查、构建、lint 全绿
