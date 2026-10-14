# 子项目 B：应用案例（Applications）栏目承接

日期：2026-10-14。承接线上 https://www.chinateao.com/ 的 `/applications/` 栏目（共 7 个叶子页）。

## 1. 目标与背景

在保留线上 URL 结构的前提下，把「应用案例」栏目本地化承接。内容来源为英文站 teao-website 的 `src/app/applications/` 与 `src/content/automotive-applications.ts`；中文人工本地化。原站该栏目正文多数 403 未抓到（仅标题 + 图片 URL），与子项目 A 一致，采用「英文站先行 + 原站后补」策略。

## 2. 范围

**In scope（7 个叶子 URL，全部本地承接）**

| 原站 URL | 页面 | 内容深度 |
|---|---|---|
| `/applications/` | 应用案例首页 | 4 张应用卡片 |
| `/applications/automotive-interior/` | 汽车内外饰总览 | 内饰/外饰两个入口 |
| `/applications/automotive-interior/internal/` | 内饰 | 6 个场景卡片 |
| `/applications/automotive-interior/external/` | 外饰 | 2 个场景卡片 |
| `/applications/home-life/` | 家居 | 简洁单页 |
| `/applications/office-equipment/` | 办公设备 | 简洁单页 |
| `/applications/industrial-application/` | 工业设备 | 简洁单页 |

**Out of scope**
- 分页 URL（`/applications/index_2.html`、`/applications/automotive-interior/index_2.html` 等）——不加入白名单，沿用现有机制跳线上原址。
- `/internal/*.html` 深链文章（7 篇，原站 403）——不承接。
- 联系表单、询盘流转（属于「询盘转化」方向）。
- 新闻、支持/下载、关于/联系 URL 对齐（子项目 C）。
- noindex 解除与 sitemap 收录（等整站验收）。

## 3. 内容口径（已与用户确认）

1. **家居/办公/工业三页维持英文站现状**：每页 = 中文标题 + 一句简介（翻译英文站 description）+ 一张静态图 + CTA，不额外创作场景内容。
2. **汽车内外饰采用简化卡片列表**：不还原英文站的交互式热点地图（车辆线稿 + 可点击热点），每个场景用卡片呈现。
3. **场景动效用 gif**：直接拷贝英文站 gif 素材，场景卡片带 gif 动图展示（比英文站场景卡更直观）。
4. **素材复用英文站**：静态图、gif 均从 teao-website 直接拷贝。原站该栏目图片为带水印产品图（`/data/watermark/*.png`），不采用。

## 4. 素材与内容来源

### 4.1 英文站 applications 首页 4 卡片（翻译为中文）

| 卡片 | 英文 description | 中文简介 |
|---|---|---|
| 汽车内外饰 | Glove boxes, armrests, cup holders, charge ports, interior storage compartments and assist handles. | 手套箱、扶手、杯托、充电口盖、车内储物格与拉手。 |
| 家居 | Toilet seat dampers, shower door buffers, cabinet soft-close mechanisms and bidet motion control. | 马桶盖阻尼、淋浴门缓冲、柜门缓闭与卫浴运动控制。 |
| 办公设备 | Printer covers, display mounts, scanner lids, workstation drawers and controlled opening panels. | 打印机盖、显示器支架、扫描仪盖板、工作站抽屉与受控开合面板。 |
| 工业设备 | Access doors, equipment enclosures, service panels, vending machine mechanisms and special motion modules. | 检修门、设备外壳、维护面板、自动售货机机构与特殊运动模块。 |

### 4.2 汽车内饰 6 场景（源自 `automotive-applications.ts` 的 `automotiveInterior.scenes`）

| no | 中文标题 | 英文 desc 翻译 |
|---|---|---|
| 01 | 中控扶手箱盖 | 中控储物盖的软开、软关与防撞击控制。 |
| 02 | 手套箱 / 杂物箱 | 受控下降，降低乘客车内储物的冲击与噪音。 |
| 03 | 内门把手 | 带回弹阻尼，让内门把手操作更安静、更稳定。 |
| 04 | 顶棚拉手 | 回弹缓冲，消除车顶拉手的回弹撞击噪音。 |
| 05 | 顶棚控制台 / 眼镜盒 | 顶棚储物格与眼镜盒的软开、软关。 |
| 06 | 遮阳板 | 遮阳板与翻转机构的旋转阻尼，动作更顺滑。 |

### 4.3 汽车外饰 2 场景

| no | 中文标题 | 英文 desc 翻译 |
|---|---|---|
| 01 | 外门把手 | 平嵌式与常规外门把手的伸出、回位与手感控制。 |
| 02 | 充电口盖 | 新能源汽车充电口盖的软开、软关与防撞击。 |

### 4.4 场景推荐产品

沿用英文站 `groups`（每个场景 1–2 个产品组，组内若干型号）。**中文站不展示产品小图**（英文站产品图未拷贝，且多数型号未承接），组内型号仅作文字展示；**产品组标题链接到对应分类页**（用 `liveHref`），映射规则：

| 英文站 group 标题 | 中文分类路径 |
|---|---|
| Gear Damper / Gear / Custom Module | `/gear-damper/` |
| Axial Damper | `/axial-dampers/` |
| Glove Box Damper | `/Glove Box Dampers/` |
| Synchronizer | `/qitaqichelingbujian/` |

## 5. 路由设计

扩展 [src/lib/live-site.ts](../..//src/lib/live-site.ts)（路径常量 + `getPilotPage` 返回类型）。

新增路径常量：

```ts
export const APPLICATIONS_PATH = "/applications/";
export const AUTOMOTIVE_INTERIOR_PATH = "/applications/automotive-interior/";
export const INTERIOR_PATH = "/applications/automotive-interior/internal/";
export const EXTERIOR_PATH = "/applications/automotive-interior/external/";
export const HOME_LIFE_PATH = "/applications/home-life/";
export const OFFICE_EQUIPMENT_PATH = "/applications/office-equipment/";
export const INDUSTRIAL_APPLICATION_PATH = "/applications/industrial-application/";
```

`getPilotPage` 新增返回类型：`"applications" | "automotive-interior" | "interior" | "exterior" | "home-life" | "office-equipment" | "industrial-application"`。

[src/app/[...legacyPath]/page.tsx](../..//src/app/[...legacyPath]/page.tsx) 增加 7 个分支渲染 + 各自 metadata（title/description/canonical/noindex）。

## 6. 数据模型

新建 `src/content/live-site/applications.ts`（单一数据文件，导出全部应用数据）：

```ts
export interface ApplicationCard {
  key: string;          // 图标 key：automotive | home | office | industrial
  title: string;
  description: string;
  image: string;        // /images/applications/*.webp
  href: string;         // 本地叶子 URL
}

export interface SimpleApplication {
  key: string;          // 图标 key
  title: string;
  description: string;
  image: string;        // /images/applications/*.webp
}

export interface SceneProductGroup {
  title: string;        // 组标题（齿轮阻尼器 / 轴向阻尼器 / 手套箱阻尼器 / 同步器），可链接到分类页
  categoryPath: string; // 组标题链接的分类路径
  models: string[];     // 组内型号文字列表
}

export interface ApplicationScene {
  id: string;
  no: string;
  title: string;
  description: string;
  gif: string;          // /images/applications/applications-gif/*.gif
  groups: SceneProductGroup[];
}

export const applicationCards: ApplicationCard[];          // 4 项（首页卡片）
export const automotiveInteriorScenes: ApplicationScene[]; // 6 项
export const automotiveExteriorScenes: ApplicationScene[]; // 2 项
export const simpleApplications: SimpleApplication[];      // 3 项（家居/办公/工业）
```

## 7. 组件设计

新建 4 个组件（复用 `container`、`SectionHead`、`Reveal`，沿用子项目 A 的视觉风格）：

- `src/components/live-site/applications-page.tsx` — 首页：SectionHead + 4 张卡片（图标 + 标题 + 简介 + 图，整卡可点）。
- `src/components/live-site/automotive-overview-page.tsx` — 汽车内外饰总览：SectionHead + 内饰/外饰两个入口卡片。
- `src/components/live-site/application-scenes-page.tsx` — 场景列表（props 接收 `scenes: ApplicationScene[]`，internal/external 复用）：每场景一张卡片 = gif 动图 + 编号 + 标题 + 描述 + 推荐产品组（组标题链接分类页 + 组内型号文字）。
- `src/components/live-site/simple-application-page.tsx` — 简洁单页（props 接收一张 `SimpleApplication`，家居/办公/工业复用）：标题 + 简介 + 静态图 + CTA。

### 7.1 gif 渲染要点

`next/image` 对 gif 默认走优化，会破坏动效，必须加 `unoptimized` 属性（英文站已验证 `unoptimized={item.image.endsWith(".gif")}`）。

## 8. SEO

- 每页 metadata：中文 title（`… | 特澳 TEAO`）、中文 description、canonical 指向 `https://www.chinateao.com` + 原路径、`robots: { index: false, follow: true }`（noindex，与现有样板一致）。
- 各页 title 建议：
  - applications：`应用案例 | 阻尼器应用场景 | 特澳 TEAO`
  - automotive-interior：`汽车内外饰阻尼器应用 | 特澳 TEAO`
  - internal：`汽车内饰阻尼器应用 | 特澳 TEAO`
  - external：`汽车外饰阻尼器应用 | 特澳 TEAO`
  - home-life：`家居阻尼器应用 | 特澳 TEAO`
  - office-equipment：`办公设备阻尼器应用 | 特澳 TEAO`
  - industrial-application：`工业设备阻尼器应用 | 特澳 TEAO`
- JSON-LD：applications 首页与 automotive-interior 总览用 `CollectionPage`（含 `itemListElement`）；场景页可不加（noindex）。

## 9. 图片拷贝清单（从 teao-website → teao-CN `public/images/applications/`）

| 文件 | 用途 | 大小 |
|---|---|---|
| `automotive.webp` | 首页卡片 + 汽车总览 | 27KB |
| `bathroom.webp` | 家居页 | 20KB |
| `office.webp` | 办公设备页 | 28KB |
| `home-appliances.webp` | 工业设备页 | 22KB |
| `applications-gif/Center console lid.gif` | 内饰场景 01 | 415KB |
| `applications-gif/Glove box.gif` | 内饰场景 02 | 5.3MB |
| `applications-gif/Door handle.gif` | 内饰场景 03 / 外饰 01 | 4.2MB |
| `applications-gif/safty handle.gif` | 内饰场景 04 | 5.9MB |
| `applications-gif/glasses box.gif` | 内饰场景 05/06 | 2.7MB |
| `applications-gif/outlet cover.gif` | 外饰场景 02 | 1.8MB |

gif 文件名含空格，拷贝时保留原名（public 路径经 Next 自动编码），组件内用原字符串路径引用。

## 10. 测试与验证

- 扩展 [src/lib/live-site.test.ts](../..//src/lib/live-site.test.ts)：7 个叶子路径（带/不带尾斜杠）解析正确、未知路径与分页（`index_2.html`）仍跳线上、`liveHref` 不回归。
- `npx tsx --test`、`npx tsc --noEmit`、`npm run build`、`npm run lint` 全绿。
- 本地浏览器：7 个 URL 均 200；标题/内容/JSON-LD 匹配；桌面 1440 + 移动 390 无横向溢出；gif 正常播放（`unoptimized`）。

## 11. 验收标准

- [ ] 7 个叶子 URL 本地渲染，URL 原样保留。
- [ ] 汽车内外饰为简化卡片列表（无热点地图），场景带 gif。
- [ ] 家居/办公/工业三页简洁承接（英文站现状）。
- [ ] metadata + canonical + JSON-LD 就位，noindex 保持。
- [ ] 回归测试、类型检查、构建、lint 全绿。
