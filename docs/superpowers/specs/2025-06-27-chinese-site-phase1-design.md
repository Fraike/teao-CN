# 中文独立站 Phase 1 设计文档

**日期:** 2025-06-27  
**状态:** 已确认  
**版本:** v1

---

## 1. 目标

基于英文站 (teao-website) 的内容和架构，建设中文独立站 (teao-CN) 核心页面。UI 风格采用 teao-cn-homepage-v5.html 的设计系统。

## 2. 技术决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 技术栈 | Next.js 15 + Tailwind CSS + SQLite (Drizzle ORM) | 与英文站一致，降低维护成本 |
| 数据库 | 独立 SQLite | 中文内容可独立优化，不受英文库约束 |
| 后台 | 共用英文站 Admin | 第一期不做独立后台，统一在英文站发布 |
| 内容策略 | 参数从英文站同步，标题/描述中文重写 | 事实数据复用，营销内容人工优化 |
| 数据同步 | API 拉取 + 中文库标记 translation_status | 增量同步，不覆盖已改写内容 |

## 3. 页面范围（Phase 1）

| 路由 | 页面 | 优先级 |
|------|------|--------|
| `/` | 首页 (Hero + Products + Apps + Factory + Quality + Clients + CTA) | P0 |
| `/products` | 产品列表 (分类筛选 + 产品卡片) | P0 |
| `/products/[category]/[slug]` | 产品详情 (参数表 + 图纸 + 询盘入口) | P0 |
| `/contact` | 询盘/联系 (表单 + 联系方式 + 微信) | P1 |

## 4. 设计系统 (v5 → Tailwind)

```js
// 品牌色
brand: { 50: '#FFF3E8', 500: '#E8781A', 700: '#C7610A' }
// 中性色
ink: '#1E1E20', muted: '#6F6F75', surface: '#FAFAFB'
// 圆角
radius-sm: 10px, radius: 14px, radius-lg: 20px
// 字体
font-sans: "PingFang SC", "Microsoft YaHei", sans-serif
```

## 5. 组件策略

复用英文站的组件逻辑模式（数据获取、表单验证、SEO），UI 层全部用 v5 设计令牌重写。

## 6. 开发顺序

1. **基础设施** — Tailwind 配置、全局样式、Layout (Header/Footer)
2. **首页** — 用 Next.js 组件重建 v5 的 7 个 Section
3. **产品列表** — 分类筛选 + 产品卡片
4. **产品详情** — 参数表 + 图纸 + 应用场景
5. **询盘表单** — 表单 + 国内联系方式
6. **数据层** — Schema + 种子数据 + 同步脚本

## 7. 约束

- 中文站和英文站各自保存已发布内容副本
- 产品 ID、型号、参数、图片路径与英文站一致
- 中文标题、描述、CTA、联系方式可独立定制
- ICP 备案等信息后续补充
