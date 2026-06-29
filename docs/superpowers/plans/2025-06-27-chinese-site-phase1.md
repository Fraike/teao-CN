# 中文独立站 Phase 1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于英文站内容架构，建设中文独立站 4 个核心页面（首页、产品列表、产品详情、询盘），UI 采用 v5 设计系统。

**Architecture:** Next.js 16 App Router + Tailwind v4 + SQLite (Drizzle ORM)。复用英文站的组件逻辑模式和数据模型，UI 层全部用 v5 CSS 设计令牌重写。数据从英文站 SQLite 同步，参数复用，中文内容人工重写。

**Tech Stack:** Next.js 16.2, React 19.2, Tailwind v4, Drizzle ORM + libSQL, TypeScript 5

## Global Constraints

- 所有 UI 使用 v5 设计令牌：`--brand: #E8781A`, `--ink: #1E1E20`, `--muted: #6F6F75`, `--surface: #FAFAFB`
- 字体：`"PingFang SC", "Microsoft YaHei", sans-serif`
- 圆角系统：`--radius-sm: 10px`, `--radius: 14px`, `--radius-lg: 20px`
- 中文站独立部署，内容独立管理，不依赖英文站运行时
- 产品 ID、型号、参数、图片路径与英文站保持一致

---

## 文件结构总览

```
src/
├── app/
│   ├── globals.css              # [MODIFY] v5 设计令牌
│   ├── layout.tsx                # [MODIFY] 添加 Header/Footer
│   ├── page.tsx                  # [MODIFY] 首页
│   ├── products/
│   │   ├── page.tsx              # [CREATE] 产品列表
│   │   └── [category]/
│   │       └── [slug]/
│   │           └── page.tsx      # [CREATE] 产品详情
│   └── contact/
│       └── page.tsx              # [CREATE] 询盘/联系
├── components/
│   ├── layout/
│   │   ├── header.tsx            # [CREATE]
│   │   └── footer.tsx            # [CREATE]
│   ├── ui/
│   │   ├── button.tsx            # [CREATE]
│   │   ├── reveal.tsx            # [CREATE]
│   │   └── section-head.tsx      # [CREATE]
│   └── home/
│       ├── hero-section.tsx      # [CREATE]
│       ├── stats-bar.tsx         # [CREATE]
│       ├── product-grid.tsx      # [CREATE]
│       ├── application-section.tsx # [CREATE]
│       ├── capability-section.tsx # [CREATE]
│       ├── quality-section.tsx   # [CREATE]
│       ├── partner-section.tsx   # [CREATE]
│       └── cta-section.tsx       # [CREATE]
├── db/
│   ├── schema.ts                 # [CREATE]
│   ├── index.ts                  # [CREATE]
│   └── seed.ts                   # [CREATE]
└── lib/
    └── constants.ts              # [CREATE]
```

---

### Task 1: 基础设施 — 设计令牌 + 全局布局

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/footer.tsx`

**Interfaces:**
- Produces: `<Header />` — sticky header with mega nav, logo, CTA button
- Produces: `<Footer />` — 3-column footer with links, contact, ICP placeholder

- [ ] **Step 1: 更新 globals.css — v5 设计令牌**

用 v5 的设计令牌替换现有 CSS 变量：

```css
@import "tailwindcss";

@theme inline {
  /* 品牌色 */
  --color-brand-50: #FFF3E8;
  --color-brand-500: #E8781A;
  --color-brand-700: #C7610A;
  /* 中性色 */
  --color-ink: #1E1E20;
  --color-ink-soft: #3A3A3E;
  --color-muted: #6F6F75;
  --color-muted-light: #9A9AA0;
  --color-line: #E4E4E7;
  --color-line-soft: #EEEEF0;
  /* 表面色 */
  --color-surface: #FAFAFB;
  --color-surface-warm: #FFFBF7;
  /* 语义色 */
  --color-green: #2D8A56;
  --color-red: #D14343;
  --color-blue: #3B82C4;
  /* 字体 */
  --font-sans: "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", -apple-system, sans-serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    background: var(--color-surface);
  }
  body {
    font-family: var(--font-sans);
    color: var(--color-ink);
    line-height: 1.7;
    font-size: 15px;
    overflow-x: hidden;
    background: var(--color-surface);
  }
  img {
    display: block;
    max-width: 100%;
    -webkit-user-drag: none;
    user-select: none;
  }
}
```

- [ ] **Step 2: 创建 Header 组件**

```tsx
// src/components/layout/header.tsx
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "首页", href: "/" },
  {
    label: "产品中心",
    href: "/products",
    children: [
      { label: "齿轮阻尼器", desc: "旋转阻尼，适用于杯托、眼镜盒、扶手箱", href: "/products/gear-damper" },
      { label: "轴向阻尼器", desc: "线性缓冲，推拉手感控制方案", href: "/products/axial-damper" },
      { label: "手套箱阻尼器", desc: "杂物箱专用缓降，消除末端撞击", href: "/products/glove-box-damper" },
      { label: "Push-Push 锁扣", desc: "锁止释放机构，可配合阻尼使用", href: "/products/latch" },
      { label: "定制零部件", desc: "非标开发 · 模具自制 · 按图打样", href: "/products/other" },
    ],
  },
  { label: "应用领域", href: "/applications" },
  { label: "制造实力", href: "/#factory" },
  { label: "质量认证", href: "/#quality" },
  { label: "关于我们", href: "/about" },
  { label: "联系我们", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-100 bg-white/88 backdrop-blur-xl border-b border-transparent transition-shadow duration-300 [.scrolled_&]:border-line [.scrolled_&]:shadow-sm" id="siteHeader">
      <div className="mx-auto flex min-h-[68px] max-w-[1240px] items-center justify-between gap-5 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/images/logo-color.webp" alt="TEAO 特澳" width={38} height={38} priority />
          <span className="hidden sm:block pl-3 border-l border-line leading-tight">
            <strong className="block text-[17px] font-bold text-ink tracking-wide">特澳 TEAO</strong>
            <span className="block mt-0.5 text-[11px] font-medium text-muted">阻尼器 · 锁扣 · 定制缓冲源头厂家</span>
          </span>
        </Link>

        {/* Nav — 桌面端 */}
        <nav className="hidden lg:flex flex-1 justify-center gap-0">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3.5 py-2.5 text-[13.5px] font-semibold text-ink-soft hover:text-brand-700 transition-colors whitespace-nowrap"
              >
                {item.label}
                {item.children && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                    className="opacity-45 group-hover:rotate-180 transition-transform duration-200">
                    <path d="M2 4l4 4 4-4"/>
                  </svg>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-500 text-white text-[13px] font-bold rounded-lg shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] transition-all shrink-0 whitespace-nowrap"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          获取报价
        </Link>
      </div>

      {/* Header scroll effect script */}
      <script dangerouslySetInnerHTML={{ __html: `
        const h = document.getElementById('siteHeader');
        addEventListener('scroll', () => { h.classList.toggle('scrolled', scrollY > 50); }, {passive:true});
      `}} />
    </header>
  );
}
```

- [ ] **Step 3: 创建 Footer 组件**

```tsx
// src/components/layout/footer.tsx
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1E] text-[#E8E8EC]/50 text-[13px] border-t-2 border-brand-500 pt-12 pb-6">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr] gap-8">
          {/* Brand */}
          <div>
            <Image src="/images/logo-color.webp" alt="TEAO" width={34} height={34} className="brightness-0 invert mb-3" />
            <p className="max-w-[280px] text-[12.5px] leading-relaxed">东莞市特澳电子科技有限公司 — 专注汽车内饰阻尼器、齿轮阻尼器、轴向阻尼器与锁扣的源头制造商。</p>
          </div>
          {/* Links */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="text-[#E8E8EC]/80 text-[13px] font-bold mb-3">产品中心</h4>
              {["齿轮阻尼器","轴向阻尼器","手套箱阻尼器","Push-Push 锁扣","定制零部件"].map(s => (
                <Link key={s} href="/products" className="block mb-1.5 text-[12.5px] text-[#E8E8EC]/38 hover:text-brand-500 hover:translate-x-0.5 transition-all">{s}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-[#E8E8EC]/80 text-[13px] font-bold mb-3">关于我们</h4>
              {["公司介绍","制造实力","质量认证","新闻资讯","技术支持"].map(s => (
                <Link key={s} href="#" className="block mb-1.5 text-[12.5px] text-[#E8E8EC]/38 hover:text-brand-500 hover:translate-x-0.5 transition-all">{s}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-[#E8E8EC]/80 text-[13px] font-bold mb-3">技术资源</h4>
              {["选型指南","扭矩单位换算","常见问题","下载中心","图纸询盘"].map(s => (
                <Link key={s} href="#" className="block mb-1.5 text-[12.5px] text-[#E8E8EC]/38 hover:text-brand-500 hover:translate-x-0.5 transition-all">{s}</Link>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-[#E8E8EC]/80 text-[13px] font-bold mb-3">联系方式</h4>
            {[
              { label: "业务热线", value: "400-XXX-XXXX" },
              { label: "微信咨询", value: "扫码添加销售工程师" },
              { label: "邮箱", value: "sales@chinateao.com", href: "mailto:sales@chinateao.com" },
              { label: "地址", value: "广东省东莞市（详细地址待确认）" },
            ].map((item) => (
              <div key={item.label} className="mb-2.5">
                <label className="block text-[10.5px] font-semibold text-[#E8E8EC]/30 uppercase tracking-wider mb-0.5">{item.label}</label>
                {item.href ? (
                  <a href={item.href} className="text-[#E8E8EC]/60">{item.value}</a>
                ) : (
                  <span className="text-[#E8E8EC]/60">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[#E8E8EC]/6 flex justify-between items-center text-[11px] text-[#E8E8EC]/25 flex-wrap gap-2">
          <span>© 2026 东莞市特澳电子科技有限公司 版权所有</span>
          <span>ICP备案号 / 公安备案号 待正式资料确认后替换</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: 更新 RootLayout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "特澳 TEAO - 汽车内饰阻尼器与锁扣定制源头厂家", template: "%s | 特澳 TEAO" },
  description: "特澳 TEAO 专注齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制缓冲机构研发制造。IATF 16949 认证，支持按图定制，从打样到量产一体化交付。",
  keywords: ["阻尼器厂家", "齿轮阻尼器", "轴向阻尼器", "汽车内饰阻尼器", "锁扣厂家", "特澳"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body className="min-h-screen flex flex-col bg-surface">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 验证** — `npm run dev`，检查 Header/Footer 渲染和 sticky 效果

---

### Task 2: UI 基础组件

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/reveal.tsx`
- Create: `src/components/ui/section-head.tsx`

**Interfaces:**
- Produces: `<Button variant="primary" | "outline" href="...">` — 两种按钮样式
- Produces: `<Reveal delay={1-5}>` — 滚动入场动画包装器
- Produces: `<SectionHead eyebrow="..." title="..." description="..." />` — 区域标题

- [ ] **Step 1: Button 组件**

```tsx
// src/components/ui/button.tsx
import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href: string;
  className?: string;
}

const base = "inline-flex items-center justify-center gap-1.5 px-7 py-3.5 text-sm font-bold rounded-lg transition-all duration-250 cursor-pointer";

const variants = {
  primary: "bg-brand-500 text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)]",
  outline: "bg-white text-ink-soft border-1.5 border-line shadow-sm hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50",
};

export function Button({ children, variant = "primary", href, className = "" }: ButtonProps) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}
```

- [ ] **Step 2: Reveal 组件**

```tsx
// src/components/ui/reveal.tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const delayMap = { 1: "0.08s", 2: "0.16s", 3: "0.24s", 4: "0.32s", 5: "0.40s" };

export function Reveal({ children, delay, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out ${delay ? "" : ""} ${className}`}
      style={{
        transitionDelay: delay ? delayMap[delay] : undefined,
        ...({} as React.CSSProperties),
      }}
    >
      {children}
    </div>
  );
}
```

同时在 globals.css 添加：
```css
.reveal-visible { opacity: 1; transform: translateY(0); }
```

等等，我们用 JS 控制类名。修正 Reveal 逻辑：
```tsx
// 在 useEffect 中:
el.classList.add("reveal-visible");
// 在 globals.css 中:
.reveal-visible { opacity: 1 !important; transform: translateY(0) !important; }
```

不对，直接用 Tailwind 的 `!opacity-100 !translate-y-0` 更好。重写：

```tsx
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("!opacity-100", "!translate-y-0");
        obs.unobserve(el);
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  obs.observe(el);
  return () => obs.disconnect();
}, []);
```

- [ ] **Step 3: SectionHead 组件**

```tsx
// src/components/ui/section-head.tsx
import { Reveal } from "./reveal";

interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}

export function SectionHead({ eyebrow, title, description }: SectionHeadProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-11">
      <Reveal>
        <p className="text-[11.5px] font-bold text-brand-700 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
          before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
          {eyebrow}
        </p>
        <h2 className="text-[36px] leading-tight font-bold text-ink tracking-tight">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={1}>
          <p className="max-w-[430px] text-[14px] text-muted leading-relaxed">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 验证** — 组件能正常 import 和渲染

---

### Task 3: 数据库层

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `src/db/seed.ts`
- Modify: `package.json` — 添加依赖

**Interfaces:**
- Produces: `db` — Drizzle ORM 实例
- Produces: `categories`, `products` 表定义
- Consumes: 无，这是基础层

- [ ] **Step 1: 安装依赖**

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

- [ ] **Step 2: 创建数据库 Schema**

```ts
// src/db/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  model: text("model").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull().references(() => categories.slug),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  features: text("features").notNull().default("[]"),
  image: text("image").notNull(),
  images: text("images").notNull().default("[]"),
  specifications: text("specifications").notNull().default("{}"),
  torque: text("torque"),
  materials: text("materials").default("[]"),
  characteristics: text("characteristics").default("[]"),
  dimensionDrawing: text("dimension_drawing"),
  performanceCharts: text("performance_charts"),
  variants: text("variants"),
  bufferDirection: text("buffer_direction"),
  assemblyMethod: text("assembly_method"),
  applications: text("applications").notNull().default("[]"),
  applicationScenarios: text("application_scenarios").default("[]"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  tags: text("tags").default("[]"),
  status: text("status").default("active"),
  isActive: integer("is_active").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

- [ ] **Step 3: 创建数据库连接**

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL || "file:data/teao-cn.db",
});

export const db = drizzle(client, { schema });
```

- [ ] **Step 4: 创建种子数据脚本**

```ts
// src/db/seed.ts
import { db } from "./index";
import { categories, products } from "./schema";

async function seed() {
  // 5 个分类 — 中文名
  await db.insert(categories).values([
    { slug: "gear-damper", name: "齿轮阻尼器", description: "旋转阻尼控制，适用于杯托、眼镜盒、储物盒等", image: "/images/products/gear-damper/GearDamperCategory.webp", sortOrder: 1 },
    { slug: "axial-damper", name: "轴向阻尼器", description: "线性缓冲，推拉运动手感控制", image: "/images/products/axial-damper/AxialDamperCategory.webp", sortOrder: 2 },
    { slug: "glove-box-damper", name: "手套箱阻尼器", description: "汽车杂物箱专用缓降阻尼", image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp", sortOrder: 3 },
    { slug: "latch", name: "Push-Push 锁扣", description: "汽车内饰锁止释放机构", image: "/images/products/latch/LatchCategory.webp", sortOrder: 4 },
    { slug: "other", name: "定制零部件", description: "非标开发、按图打样、模具自制", image: "/images/products/other/OthersCategory.webp", sortOrder: 5 },
  ]);

  // 初始产品 — 参数沿用英文站，标题/描述用中文
  await db.insert(products).values([
    {
      slug: "trd-25-rotary-gear-damper",
      model: "TRD-25",
      name: "TRD-25 齿轮阻尼器",
      category: "gear-damper",
      summary: "高扭矩旋转阻尼器，适用于汽车内饰杯托、储物盒等开合机构。",
      description: "TRD-25 系列提供平稳可控的旋转阻尼运动，适用于汽车内饰杯托、储物盒、扶手等。支持多扭矩范围定制和安装方式定制。",
      image: "/images/products/gear-damper/GearDamperSingle.webp",
      images: "[]",
      specifications: JSON.stringify({ "扭矩范围": "0.5 – 4.0 N·m", "工作温度": "-30°C ～ +80°C", "材料": "POM / PA66 + GF", "阻尼方向": "顺时针 / 逆时针 / 双向", "使用寿命": ">50,000 次" }),
      features: JSON.stringify(["紧凑设计适配狭小空间", "全温区稳定扭矩输出", "支持定制扭矩值", "低噪音运行"]),
      applications: JSON.stringify(["汽车内饰", "储物盒"]),
      isActive: 1,
      sortOrder: 1,
    },
    // ... 后续从英文站同步更多产品
  ]);

  console.log("Seed complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
```

- [ ] **Step 5: 运行 seed**

```bash
npx tsx src/db/seed.ts
```

---

### Task 4: 首页 — Hero + Stats Bar

**Files:**
- Create: `src/components/home/hero-section.tsx`
- Create: `src/components/home/stats-bar.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Button, Reveal from Task 2
- Produces: `<HeroSection />`, `<StatsBar />`

- [ ] **Step 1: 创建 HeroSection**

参照 v5 HTML 的 `.hero` 区域，转换为 Tailwind 组件：

```tsx
// src/components/home/hero-section.tsx
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";

const TRUST_ITEMS = [
  { color: "bg-green", label: "IATF 16949" },
  { color: "bg-blue", label: "ISO 14001" },
  { color: "bg-brand-500", label: "8000万件年产能" },
  { color: "bg-green", label: "100%扭矩全检" },
  { color: "bg-brand-500", label: "支持图纸/样品定制" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FBF9F6] via-[#F5F2ED] to-[#F0EDE8]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse at 78% 30%, rgba(232,120,26,0.08) 0%, transparent 50%), radial-gradient(ellipse at 5% 80%, rgba(232,120,26,0.04) 0%, transparent 45%)" }}
      />

      <div className="relative z-2 mx-auto grid max-w-[1240px] grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-center px-6 py-14 lg:py-16">
        {/* 左侧文案 */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-brand-500/20 bg-white/70 backdrop-blur rounded-full text-[12.5px] font-bold text-brand-700 tracking-wider
              before:content-[''] before:w-[7px] before:h-[7px] before:bg-brand-500 before:rounded-full before:shadow-[0_0_8px_rgba(232,120,26,0.15)]">
              面向汽车 · 家电 · 卫浴 · 办公供应链
            </span>
          </Reveal>

          <h1 className="mt-5 text-[clamp(36px,4.5vw,60px)] leading-[1.15] font-semibold text-ink tracking-tight">
            <Reveal delay={1}>汽车内饰<em className="not-italic text-brand-700 font-black relative after:absolute after:left-0 after:bottom-0.5 after:w-full after:h-2 after:bg-brand-500/12 after:rounded after:-z-1">阻尼器</em></Reveal>
            {" "}<Reveal delay={2}>与锁扣</Reveal>
            <br />
            <Reveal delay={3}><strong className="font-black">定制源头厂家</strong></Reveal>
          </h1>

          <Reveal delay={2}>
            <p className="max-w-[540px] mt-4 text-[15px] text-muted leading-relaxed">
              特澳 TEAO 专注齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制缓冲机构研发制造。支持扭矩、角度、方向和安装结构按图定制，从打样到量产一体化交付。
            </p>
          </Reveal>

          {/* Trust badges */}
          <Reveal delay={3}>
            <div className="flex flex-wrap gap-2 mt-6">
              {TRUST_ITEMS.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-line bg-white rounded-lg text-[12.5px] font-semibold text-ink-soft shadow-xs hover:border-brand-500/25 hover:bg-brand-50 hover:-translate-y-0.5 transition-all">
                  <span className={`w-[7px] h-[7px] rounded-full ${item.color}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={4}>
            <div className="flex flex-wrap gap-2.5 mt-7">
              <Button href="/contact" variant="primary">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                发送图纸获取选型建议
              </Button>
              <Button href="tel:400-XXX-XXXX" variant="outline">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                电话咨询
              </Button>
              <Button href="#wechat" variant="outline">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                加微信
              </Button>
            </div>
          </Reveal>

          <Reveal delay={5}>
            <p className="mt-4 text-[12.5px] text-muted-light">
              适用于：<code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">汽车杯托</code>{" "}
              <code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">手套箱</code>{" "}
              <code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">扶手箱</code>{" "}
              <code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">眼镜盒</code>{" "}
              <code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">充电口盖</code>{" "}
              <code className="inline-block bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 rounded">家电盖板</code>{" "}
              等开合缓冲结构
            </p>
          </Reveal>
        </div>

        {/* 右侧快速询盘面板 */}
        <aside className="self-stretch hidden lg:flex flex-col gap-3 justify-center">
          <div className="border border-line bg-white/85 backdrop-blur p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-center text-ink">工程师在线评估</h3>
            <p className="text-[12.5px] text-muted text-center mt-1 mb-4">提交产品类型、应用场景、目标扭矩或上传图纸，工程师将在 2 小时内给出选型与打样建议。</p>
            <div className="grid grid-cols-2 gap-2 mb-3.5">
              <div className="border border-line-soft bg-white p-3 text-center rounded-xl hover:border-brand-500/25 hover:bg-brand-50 transition cursor-pointer">
                <Image src="/images/products/gear-damper/GearDamperCategory.webp" alt="齿轮阻尼器" width={80} height={60} className="mx-auto object-contain" />
                <p className="mt-1.5 text-xs font-semibold text-ink-soft">齿轮阻尼器</p>
              </div>
              <div className="border border-line-soft bg-white p-3 text-center rounded-xl hover:border-brand-500/25 hover:bg-brand-50 transition cursor-pointer">
                <Image src="/images/products/axial-damper/AxialDamperCategory.webp" alt="轴向阻尼器" width={80} height={60} className="mx-auto object-contain" />
                <p className="mt-1.5 text-xs font-semibold text-ink-soft">轴向阻尼器</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface p-3 text-center border border-line-soft rounded-xl"><label className="text-[10.5px] font-bold text-muted-light uppercase tracking-wider">需要提供</label><strong className="block text-[13px] text-ink font-semibold">图纸 / 样品 / 年用量</strong></div>
              <div className="bg-surface p-3 text-center border border-line-soft rounded-xl"><label className="text-[10.5px] font-bold text-muted-light uppercase tracking-wider">回复方式</label><strong className="block text-[13px] text-ink font-semibold">电话 / 微信 / 邮件</strong></div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-gradient-to-br from-brand-500 to-[#F09630] text-white p-3.5 rounded-xl">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <div><b className="block text-lg font-bold">400-XXX-XXXX</b><span className="text-[11px] opacity-85">工作日 8:30–18:00 在线</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 创建 StatsBar**

```tsx
// src/components/home/stats-bar.tsx
"use client";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/reveal";

const STATS = [
  { value: "20", unit: "+年", label: "阻尼器研发制造经验" },
  { value: "8000", unit: "万+", label: "年产能（参考值）" },
  { value: "IATF", unit: "", label: "16949 质量体系认证" },
  { value: "100", unit: "%", label: "出厂扭矩检测覆盖" },
  { value: "5", unit: "大", label: "核心产品线" },
];

function AnimatedStat({ value, unit, label }: { value: string; unit: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isNumber = /^\d+$/.test(value);

  useEffect(() => {
    if (!isNumber) return;
    const el = ref.current;
    if (!el) return;
    const target = parseInt(value);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1600;
        const animate = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = String(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(animate);
          else el.textContent = value;
        };
        requestAnimationFrame(animate);
        obs.unobserve(el);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, isNumber]);

  return (
    <div className="text-center">
      <div className="text-[32px] font-bold text-ink leading-tight flex items-baseline justify-center gap-1">
        <span ref={ref}>{value}</span>
        {unit && <span className="text-sm font-semibold text-brand-500">{unit}</span>}
      </div>
      <span className="block mt-1.5 text-[12.5px] font-semibold text-muted tracking-wide">{label}</span>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-[18px]">
      <Reveal>
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 border border-line bg-white rounded-2xl shadow-sm overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="p-7 border-r lg:border-b-0 border-line-soft last:border-r-0 hover:bg-surface transition-colors">
                <AnimatedStat value={s.value} unit={s.unit} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: 更新 page.tsx 组装首页**

```tsx
// src/app/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      {/* 后续 Task 继续加 ProductGrid, ApplicationSection, etc. */}
    </>
  );
}
```

- [ ] **Step 4: 验证** — `npm run dev`，检查 Hero + Stats 渲染和动画

---

### Task 5: 首页 — 产品展示 + 应用领域

**Files:**
- Create: `src/components/home/product-grid.tsx`
- Create: `src/components/home/application-section.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Reveal, SectionHead from Task 2; db from Task 3
- Produces: `<ProductGrid />`, `<ApplicationSection />`

- [ ] **Step 1: 创建 ProductGrid**

```tsx
// src/components/home/product-grid.tsx
import { db } from "@/db";
import { categories } from "@/db/schema";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import Image from "next/image";
import Link from "next/link";

export async function ProductGrid() {
  const cats = await db.select().from(categories).all();
  cats.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="py-20 bg-white" id="products">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHead
          eyebrow="产品中心"
          title={<>从标准型号到<strong className="font-black text-brand-700">按图非标定制</strong></>}
          description="每款产品支持扭矩范围、阻尼方向、安装方式和材料定制。"
        />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {cats.map((cat, i) => (
            <Reveal key={cat.slug} delay={(Math.min(i + 1, 5) as 1|2|3|4|5)}>
              <Link href={`/products/${cat.slug}`} className="block group bg-white border border-line rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[1/0.78] bg-[#FAF8F5] grid place-items-center p-5">
                  {/* 用 img 标签绕过 Next.js Image 对远程/动态图片的限制，产品图片都是本地静态资源 */}
                  <img src={cat.image} alt={cat.name} className="w-[88%] object-contain group-hover:scale-105 transition-transform duration-400" />
                </div>
                <div className="p-4.5 pb-5.5">
                  <h3 className="text-base font-bold text-ink">{cat.name}</h3>
                  <p className="text-[12.5px] text-muted mt-1.5 leading-relaxed min-h-[38px]">{cat.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-soft">
                    <span className="text-[11px] text-muted font-medium">了解更多</span>
                    <span className="text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform">获取报价 →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 创建 ApplicationSection**

```tsx
// src/components/home/application-section.tsx
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";

const APPS = [
  { icon: "M12 8v8m-4-4h8", title: "汽车杯托", desc: "解决弹开过快、末端撞击和手感突兀问题，让开合节奏一致且安静。", recommend: "推荐：齿轮阻尼器 RD-T 系列" },
  { icon: "M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 7h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V7z", title: "手套箱 / 扶手箱", desc: "控制打开速度，提升乘员舱使用质感，避免储物格意外砸落。", recommend: "推荐：手套箱阻尼器 RD-V 系列" },
  { icon: "M2 6h20v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 6h12", title: "眼镜盒 / 储物盒", desc: "小空间开合结构的最佳选择，支持多种安装方式定制。", recommend: "推荐：齿轮 / 轴向阻尼器" },
  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "充电口盖 / 家电卫浴", desc: "外饰盖板开启控制、马桶盖缓降、家电盖板的缓开缓闭体验优化。", recommend: "推荐：轴向阻尼器 / 定制机构" },
];

export function ApplicationSection() {
  return (
    <section className="py-20 bg-[#F7F6F4]" id="applications">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHead
          eyebrow="应用领域"
          title={<>先看场景，<strong className="font-black text-brand-700">再选产品</strong></>}
          description="国内采购更习惯从使用场景出发找解决方案。以下是我们最常见的应用领域和推荐产品组合。"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 items-stretch">
          {/* Hero card */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl min-h-[440px] flex flex-col justify-between p-10 text-white"
              style={{ background: "linear-gradient(160deg, rgba(26,26,30,0.82) 0%, rgba(26,26,30,0.45) 50%, rgba(26,26,30,0.8) 100%), url('/images/company/automation-workshop.webp') center/cover no-repeat" }}>
              <div>
                <h3 className="text-[28px] leading-tight font-semibold max-w-[450px]">汽车内饰开合机构的<br/><em className="not-italic text-brand-500 font-black">静音缓冲方案</em></h3>
                <p className="text-white/75 text-[14.5px] leading-relaxed mt-3 max-w-[440px]">解决杯托弹开撞击、手套箱下落过快、眼镜盒异响、充电口盖回弹等问题。稳定扭矩输出，适配 −30°C ～ +80°C 温度区间。</p>
              </div>
              <a href="/contact" className="inline-flex items-center gap-1.5 w-fit border border-white/25 bg-white/6 text-white px-5 py-3 text-[13px] font-bold rounded-lg hover:border-white/50 hover:bg-white/12 transition">提交应用需求 →</a>
            </div>
          </Reveal>

          {/* App cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {APPS.map((app, i) => (
              <Reveal key={app.title} delay={((i + 1) as 1|2|3|4)}>
                <div className="border border-line bg-white p-5.5 rounded-2xl shadow-xs hover:border-brand-500/20 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 bg-brand-50 grid place-items-center mb-3 text-brand-700 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={app.icon} /></svg>
                  </div>
                  <h4 className="text-[15px] font-bold text-ink">{app.title}</h4>
                  <p className="mt-1.5 text-[12.5px] text-muted leading-relaxed">{app.desc}</p>
                  <span className="inline-block mt-2.5 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded">{app.recommend}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 更新 page.tsx**

```tsx
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ProductGrid } from "@/components/home/product-grid";
import { ApplicationSection } from "@/components/home/application-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProductGrid />
      <ApplicationSection />
    </>
  );
}
```

- [ ] **Step 4: 验证** — `npm run dev`，检查产品卡片和应用场景渲染

---

### Task 6: 首页 — 制造实力 + 质量认证 + 客户 + CTA

**Files:**
- Create: `src/components/home/capability-section.tsx`
- Create: `src/components/home/quality-section.tsx`
- Create: `src/components/home/partner-section.tsx`
- Create: `src/components/home/cta-section.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: CapabilitySection**

参照 v5 `.factory-layout` + `.cap-grid` 结构：

```tsx
// src/components/home/capability-section.tsx
import { Reveal } from "@/components/ui/reveal";
import Image from "next/image";

const CAPS = [
  { title: "模具开发", desc: "根据产品结构和安装空间进行方案评估，自有模具设计与制造能力。" },
  { title: "注塑生产", desc: "POM / PA66+GF 等工程塑料精密注塑，过程尺寸与外观控制。" },
  { title: "自动化装配线", desc: "半自动到全自动装配，保证产品一致性，适配不同批量需求。" },
  { title: "扭矩全检", desc: "围绕核心性能指标进行 100% 出厂扭矩检测与记录。" },
  { title: "可靠性测试", desc: "寿命测试、高低温循环、盐雾测试等环境适应性验证能力。" },
  { title: "批量交付", desc: "年产能可达千万级，支持汽车主机厂、Tier-1 及家电供应链节奏。" },
];

export function CapabilitySection() {
  return (
    <section className="py-20 bg-white" id="factory">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 items-center">
          <Reveal>
            <p className="text-[11.5px] font-bold text-brand-700 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">制造实力</p>
            <h2 className="text-[36px] leading-tight font-bold text-ink tracking-tight mt-2">
              模具开发 → 注塑生产 →<br/><strong className="font-black text-brand-700">自动化装配 → 批量交付</strong>
            </h2>
            <p className="max-w-[430px] text-[14px] text-muted leading-relaxed mt-4.5">
              国内采购判断供应商时，工厂实拍、设备清单和检测能力是关键依据。我们拥有完整的模具、注塑、装配、检测一体化能力，支持从样品到数百万级的批量交付。
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line shadow-sm">
              <Image src="/images/company/automation-workshop.webp" alt="特澳自动化生产车间" width={420} height={480} className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {CAPS.map((cap, i) => (
              <Reveal key={cap.title} delay={(Math.min(i + 1, 3) as 1|2|3)}>
                <div className="relative overflow-hidden bg-white border border-line p-5.5 rounded-2xl min-h-[140px] flex flex-col justify-center shadow-xs hover:border-brand-500/20 hover:shadow-sm transition-all duration-300
                  before:content-[''] before:absolute before:top-0 before:left-0 before:w-[3px] before:h-0 before:bg-brand-500 before:transition-[height] before:duration-350 hover:before:h-full">
                  <strong className="text-base font-bold text-ink">{cap.title}</strong>
                  <p className="mt-2 text-[13px] text-muted leading-relaxed">{cap.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: QualitySection**

```tsx
// src/components/home/quality-section.tsx
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";

const CERTS = [
  { name: "IATF 16949", desc: "汽车行业质量管理体系认证 — 覆盖产品设计、生产和服务全过程", color: "bg-green" },
  { name: "ISO 14001", desc: "环境管理体系认证 — 生产过程环保合规", color: "bg-blue" },
  { name: "专利与技术积累", desc: "阻尼器、锁扣及相关缓冲结构的专利与工艺沉淀", color: "bg-brand-500" },
];

const QCS = [
  { num: "01", title: "来料检验", desc: "关键原材料和外购件进入生产前先确认材质、尺寸和批次信息。" },
  { num: "02", title: "注塑过程控制", desc: "注塑成型环节的温度、压力和时间监控，确保尺寸一致性。" },
  { num: "03", title: "100% 扭矩检测", desc: "围绕核心使用手感和性能指标，对每个成品进行扭矩检测并记录。" },
  { num: "04", title: "出货检验与追溯", desc: "批次号、外观、功能和包装出货前确认，支持后续质量问题追溯。" },
];

export function QualitySection() {
  return (
    <section className="py-20 bg-[#F7F6F4]" id="quality">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHead
          eyebrow="质量认证"
          title={<>不只是证书墙 — <strong className="font-black text-brand-700">展示质量怎么管</strong></>}
          description="从来料到出货的全流程质量控制，每一批次产品均可追溯。"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-7">
          {/* 证书列表 */}
          <div className="space-y-3">
            {CERTS.map((cert) => (
              <Reveal key={cert.name}>
                <div className="flex items-center justify-between border border-line bg-white p-5.5 rounded-2xl shadow-xs hover:border-brand-500/20 hover:shadow-sm hover:translate-x-1 transition-all">
                  <div><strong className="block text-[19px] font-bold text-ink">{cert.name}</strong><span className="block mt-1 text-[12.5px] text-muted">{cert.desc}</span></div>
                  <div className={`w-[54px] h-[54px] grid place-items-center text-white font-bold text-xs rounded-xl shrink-0 ${cert.color} transition-transform hover:rotate-3 hover:scale-105`}>{cert.name.slice(0, 4)}</div>
                </div>
              </Reveal>
            ))}
          </div>
          {/* QC 步骤 */}
          <div className="grid grid-cols-2 gap-2.5">
            {QCS.map((qc, i) => (
              <Reveal key={qc.num} delay={((i + 1) as 1|2|3|4)}>
                <div className="border border-line bg-white p-5.5 rounded-2xl shadow-xs hover:border-brand-500/20 hover:shadow-sm transition-all">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-500 text-white text-xs font-bold rounded-lg hover:scale-110 transition">{qc.num}</span>
                  <strong className="block mt-3 text-[15px] font-bold text-ink">{qc.title}</strong>
                  <p className="mt-1.5 text-[12.5px] text-muted leading-relaxed">{qc.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: PartnerSection**

```tsx
// src/components/home/partner-section.tsx
import { Reveal } from "@/components/ui/reveal";

const PARTNERS = [
  "BYD", "Geely", "Chery", "SAIC", "FAW", "GAC",
  "Changan", "GreatWall", "Dongfeng", "NIO", "XPeng", "LiAuto",
];

export function PartnerSection() {
  return (
    <section className="py-20 bg-white" id="clients">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 items-center">
          <Reveal>
            <p className="text-[11.5px] font-bold text-brand-700 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">客户案例</p>
            <h2 className="text-[36px] leading-tight font-bold text-ink tracking-tight mt-2">服务汽车及<br/><strong className="font-black text-brand-700">家电供应链客户</strong></h2>
            <p className="max-w-[430px] text-[14px] text-muted leading-relaxed mt-3.5">产品已应用于国内外多家汽车品牌及零部件供应商项目，覆盖燃油车与新能源车型。</p>
          </Reveal>

          <Reveal delay={1}>
            <div className="grid grid-cols-3 lg:grid-cols-4 border border-line rounded-2xl overflow-hidden shadow-xs">
              {PARTNERS.map((p) => (
                <div key={p} className="grid place-items-center min-h-[82px] bg-white p-3.5 border-r border-b border-line-soft [&:nth-child(4n)]:border-r-0 [&:nth-child(n+9)]:border-b-0 hover:bg-[#FAF8F5] transition">
                  <img
                    src={`https://teao-damper.com/images/partners/${p}.webp`}
                    alt={p}
                    className="max-w-[82%] max-h-[46px] object-contain grayscale-[20%] brightness-[0.94] hover:grayscale-0 hover:brightness-100 hover:scale-110 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: CTASection**

```tsx
// src/components/home/cta-section.tsx
import { Reveal } from "@/components/ui/reveal";

export function CTASection() {
  return (
    <section className="relative py-20 text-white overflow-hidden" id="contact"
      style={{ background: "linear-gradient(105deg, rgba(26,26,30,0.96) 0%, rgba(26,26,30,0.88) 55%, rgba(26,26,30,0.78) 100%), url('/images/company/automation-workshop.webp') center/cover no-repeat" }}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(232,120,26,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-1 mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
          <Reveal>
            <p className="text-[11.5px] font-bold text-brand-500 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">快速询盘</p>
            <h2 className="text-[36px] leading-tight font-bold tracking-tight max-w-[620px]">发图纸或描述需求<br/><strong className="font-black text-brand-500">我们先帮你判断结构和扭矩方向</strong></h2>
            <p className="mt-4 text-[#E8E8EC]/60 text-[14.5px] leading-relaxed">无论是标准品选型还是非标定制，提交以下任一信息即可启动工程师评估流程。正式版本将接入电话、微信二维码、文件上传、邮件通知等完整询盘链路。</p>
            <div className="grid grid-cols-3 gap-2.5 mt-7">
              {["✓ 提交图纸获取选型建议", "✓ 发送样品信息安排打样", "✓ 描述应用场景获取方案"].map((b) => (
                <div key={b} className="border border-white/10 bg-white/3 p-4 font-semibold text-[13px] rounded-xl hover:border-brand-500/30 hover:bg-brand-500/6 transition">{b}</div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <form className="bg-white text-ink p-7.5 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border-t-3 border-brand-500">
              <h3 className="text-xl font-bold text-center">获取选型与报价建议</h3>
              <p className="text-[12.5px] text-muted text-center mt-1 mb-5">工程师将在 2 小时内响应</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] text-ink font-medium rounded-lg focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" placeholder="您的姓名 *" />
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] text-ink font-medium rounded-lg focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" placeholder="公司名称 *" />
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] text-ink font-medium rounded-lg focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" type="tel" placeholder="手机号码 *" />
                <select className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] text-ink font-medium rounded-lg focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none">
                  <option value="">选择产品类型 *</option>
                  <option>齿轮阻尼器</option>
                  <option>轴向阻尼器</option>
                  <option>手套箱阻尼器</option>
                  <option>锁扣</option>
                  <option>定制零部件</option>
                  <option>不确定 / 需要推荐</option>
                </select>
                <input className="col-span-2 border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] text-ink font-medium rounded-lg focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" placeholder="应用场景 / 目标扭矩 / 年用量预估" />
                <div className="col-span-2 grid place-items-center min-h-[68px] border-2 border-dashed border-[#D1D1D6] bg-surface text-brand-700 text-[13px] font-semibold rounded-lg cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition">📁 上传图纸、图片、PDF 或 CAD 文件（可选）</div>
                <button type="button" className="col-span-2 mt-1.5 py-3.5 bg-brand-500 text-white text-[14.5px] font-bold rounded-lg shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] transition-all tracking-wider">提交需求，获取选型方案 →</button>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-light leading-relaxed">提交即表示同意隐私政策。具体字段、文件大小限制和通知方式待最终确认后配置。</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 完整首页 page.tsx**

```tsx
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ProductGrid } from "@/components/home/product-grid";
import { ApplicationSection } from "@/components/home/application-section";
import { CapabilitySection } from "@/components/home/capability-section";
import { QualitySection } from "@/components/home/quality-section";
import { PartnerSection } from "@/components/home/partner-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProductGrid />
      <ApplicationSection />
      <CapabilitySection />
      <QualitySection />
      <PartnerSection />
      <CTASection />
    </>
  );
}
```

- [ ] **Step 6: 验证** — `npm run dev`，浏览完整首页，对比 v5 HTML 逐区检查

---

### Task 7: 产品列表页 + 产品详情页

**Files:**
- Create: `src/app/products/page.tsx`
- Create: `src/app/products/[category]/[slug]/page.tsx`
- Create: `src/lib/constants.ts`

**Interfaces:**
- Consumes: db from Task 3
- `/products` — 产品列表，按分类筛选
- `/products/[category]/[slug]` — 产品详情，参数表 + 图纸

- [ ] **Step 1: 创建 lib/constants.ts（中文版分类数据）**

```ts
// src/lib/constants.ts
export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  image: string;
  zhTags?: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  { slug: "gear-damper", name: "齿轮阻尼器", description: "旋转阻尼控制，适用于杯托、眼镜盒、储物盒等汽车内饰开合结构。支持扭矩、方向和安装方式定制。", image: "/images/products/gear-damper/GearDamperCategory.webp", zhTags: ["扭矩 50–500 gf.cm", "双向可选", "螺丝安装"] },
  { slug: "axial-damper", name: "轴向阻尼器", description: "线性缓冲，适用于拉手、滑动门、缓开缓闭等推拉运动场景。", image: "/images/products/axial-damper/AxialDamperCategory.webp", zhTags: ["推拉阻尼", "角度可控", "多规格"] },
  { slug: "glove-box-damper", name: "手套箱阻尼器", description: "汽车杂物箱专用缓降阻尼器，解决打开过快、末端撞击和异响问题。", image: "/images/products/glove-box-damper/GloveBoxDamperCategory.webp", zhTags: ["汽车内饰", "缓降控制", "静音设计"] },
  { slug: "latch", name: "Push-Push 锁扣", description: "汽车内饰锁止释放机构，可与阻尼结构配合使用实现完整的开合手感方案。", image: "/images/products/latch/LatchCategory.webp", zhTags: ["锁止释放", "结构配套", "手感可调"] },
  { slug: "other", name: "定制零部件", description: "定制缓冲机构、收纳机构和其他汽车内饰功能组件。按图纸或样品开发模具。", image: "/images/products/other/OthersCategory.webp", zhTags: ["非标开发", "样品评估", "模具自制"] },
];
```

- [ ] **Step 2: 产品列表页**

```tsx
// src/app/products/page.tsx
import type { Metadata } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "产品中心",
  description: "齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push锁扣及定制零部件。支持扭矩、方向、安装方式按图非标定制。",
};

export default async function ProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    db.select().from(products).where(eq(products.isActive, 1)).all(),
    db.select().from(categories).all(),
  ]);
  allCategories.sort((a, b) => a.sortOrder - b.sortOrder);
  allProducts.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHead eyebrow="产品中心" title={<>从标准型号到<strong className="font-black text-brand-700">按图非标定制</strong></>} description={`共 ${allProducts.length} 款产品，${allCategories.length} 个分类`} />

        {/* 分类 Tab */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/products" className="px-4 py-2 bg-brand-50 text-brand-700 text-[13px] font-bold rounded-lg">全部</Link>
          {allCategories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="px-4 py-2 bg-surface text-ink-soft text-[13px] font-semibold rounded-lg hover:bg-brand-50 hover:text-brand-700 transition">
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 产品网格 */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {allProducts.map((p, i) => (
            <Reveal key={p.slug} delay={(Math.min(i % 5 + 1, 5) as 1|2|3|4|5)}>
              <Link href={`/products/${p.category}/${p.slug}`} className="block group bg-white border border-line rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[1/0.78] bg-[#FAF8F5] grid place-items-center p-5">
                  <img src={p.image} alt={p.name} className="w-[88%] object-contain group-hover:scale-105 transition-transform duration-400" />
                </div>
                <div className="p-4.5 pb-5.5">
                  <h3 className="text-base font-bold text-ink">{p.name}</h3>
                  <p className="text-[12.5px] text-muted mt-1.5 leading-relaxed line-clamp-2">{p.summary}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-soft">
                    <span className="text-[11px] text-muted">{p.model}</span>
                    <span className="text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform">详情 →</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 产品详情页**

```tsx
// src/app/products/[category]/[slug]/page.tsx
import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props { params: Promise<{ category: string; slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;
  const [product] = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.category, category))).limit(1);
  if (!product) return { title: "产品未找到" };
  return { title: product.seoTitle || product.name, description: product.seoDescription || product.summary };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, category } = await params;
  const [product] = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.category, category))).limit(1);
  if (!product) notFound();

  const specs = JSON.parse(product.specifications || "{}") as Record<string, string>;
  const features = JSON.parse(product.features || "[]") as string[];
  const apps = JSON.parse(product.applications || "[]") as string[];

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-muted mb-8">
          <Link href="/" className="hover:text-brand-700">首页</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-700">产品中心</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-brand-700 capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          {/* Product image */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-line p-8 grid place-items-center aspect-square max-h-[520px]">
            <img src={product.image} alt={product.name} className="max-w-[85%] max-h-[85%] object-contain" />
          </div>

          {/* Product info */}
          <div>
            <span className="text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase">{product.model}</span>
            <h1 className="text-[32px] font-bold text-ink mt-2 leading-tight">{product.name}</h1>
            <p className="mt-4 text-muted leading-relaxed">{product.description}</p>

            {/* Specs table */}
            {Object.keys(specs).length > 0 && (
              <div className="mt-6 border border-line rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([k, v]) => (
                      <tr key={k} className="border-b border-line-soft last:border-0">
                        <td className="px-5 py-3.5 font-semibold text-ink-soft bg-surface w-2/5">{k}</td>
                        <td className="px-5 py-3.5 text-muted">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-ink mb-3">产品特点</h3>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-muted">
                      <span className="text-brand-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-1.5 px-7 py-3.5 bg-brand-500 text-white text-sm font-bold rounded-lg shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] transition-all">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                发送图纸获取报价
              </Link>
              <Link href="tel:400-XXX-XXXX" className="inline-flex items-center gap-1.5 px-7 py-3.5 bg-white text-ink-soft text-sm font-bold border-1.5 border-line rounded-lg shadow-sm hover:border-brand-500 hover:text-brand-700 transition-all">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                电话咨询
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 验证** — 确保产品列表和详情页路由正常工作

---

### Task 8: 询盘联系页

**Files:**
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: 联系页面**

```tsx
// src/app/contact/page.tsx
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "联系我们",
  description: "发送图纸或描述需求，特澳工程师将在2小时内给出选型与报价建议。电话/微信/邮件多渠道联系。",
};

export default function ContactPage() {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-14">
          <Reveal>
            <p className="text-[11.5px] font-bold text-brand-700 mb-2 tracking-[0.14em] uppercase inline-flex items-center gap-2
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">联系我们</p>
            <h1 className="text-[40px] leading-tight font-bold text-ink tracking-tight mt-2">
              发图纸或描述需求<br/><strong className="font-black text-brand-700">我们先帮你判断结构和扭矩方向</strong>
            </h1>
            <p className="mt-5 text-muted leading-relaxed max-w-[560px]">无论是标准品选型还是非标定制，提交以下任一信息即可启动工程师评估流程。</p>

            <div className="mt-8 space-y-4">
              {[
                { label: "业务热线", value: "400-XXX-XXXX", icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" },
                { label: "邮箱", value: "sales@chinateao.com", href: "mailto:sales@chinateao.com", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6" },
                { label: "微信咨询", value: "扫码添加销售工程师（二维码待补充）", icon: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" },
                { label: "地址", value: "广东省东莞市（详细地址待确认）", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7v6 M12 13a3 3 0 100-6 3 3 0 000 6z" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-brand-50 grid place-items-center rounded-xl text-brand-700 shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={item.icon} /></svg>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-light uppercase tracking-wider mb-1">{item.label}</label>
                    {item.href ? (
                      <a href={item.href} className="text-[15px] font-semibold text-ink hover:text-brand-700 transition">{item.value}</a>
                    ) : (
                      <span className="text-[15px] font-semibold text-ink">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <form className="bg-white border border-line rounded-2xl p-7.5 shadow-md border-t-3 border-brand-500">
              <h3 className="text-xl font-bold text-center">获取选型与报价建议</h3>
              <p className="text-[12.5px] text-muted text-center mt-1 mb-5">工程师将在 2 小时内响应</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] font-medium text-ink rounded-lg focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" placeholder="您的姓名 *" />
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] font-medium text-ink rounded-lg focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" placeholder="公司名称 *" />
                <input className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] font-medium text-ink rounded-lg focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none" type="tel" placeholder="手机号码 *" />
                <select className="border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] font-medium text-ink rounded-lg focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none">
                  <option value="">选择产品类型 *</option>
                  <option>齿轮阻尼器</option><option>轴向阻尼器</option><option>手套箱阻尼器</option><option>锁扣</option><option>定制零部件</option><option>不确定 / 需要推荐</option>
                </select>
                <textarea className="col-span-2 border-1.5 border-line bg-surface px-3.5 py-3 text-[13.5px] font-medium text-ink rounded-lg focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] transition outline-none min-h-[100px] resize-y" placeholder="请描述应用场景、目标扭矩、年用量预估等信息" />
                <div className="col-span-2 grid place-items-center min-h-[68px] border-2 border-dashed border-[#D1D1D6] bg-surface text-brand-700 text-[13px] font-semibold rounded-lg cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition">📁 上传图纸、图片、PDF 或 CAD 文件（可选）</div>
                <button type="button" className="col-span-2 mt-1.5 py-3.5 bg-brand-500 text-white text-[14.5px] font-bold rounded-lg shadow-[0_4px_16px_rgba(232,120,26,0.18)] hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] transition-all tracking-wider">提交需求，获取选型方案 →</button>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-light leading-relaxed">提交即表示同意隐私政策。</p>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证** — `npm run dev`，访问 `/contact`

---

### Task 9: SEO 完善 + 验证

**Files:**
- Modify: `src/app/layout.tsx` — 补充完整 metadata
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: 完善 layout metadata（已在 Task 1 的基础上升级）**

确保 `layout.tsx` 的 metadata 包含完整的 SEO 字段（已在 Task 1 Step 4 中写入）。

- [ ] **Step 2: robots.ts**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://chinateao.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: sitemap.ts**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chinateao.com";
  const [allProducts, allCategories] = await Promise.all([
    db.select({ slug: products.slug, category: products.category, updatedAt: products.updatedAt }).from(products).where(eq(products.isActive, 1)).all(),
    db.select({ slug: categories.slug }).from(categories).all(),
  ]);

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const productUrls = allProducts.map((p) => ({
    url: `${baseUrl}/products/${p.category}/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productUrls];
}
```

- [ ] **Step 4: 全站验证**

```bash
npm run build
npm run dev
```

检查清单：
- `/` — 首页 8 个 section 完整渲染
- `/products` — 产品列表 + 分类筛选
- `/products/gear-damper/trd-25-rotary-gear-damper` — 产品详情
- `/contact` — 联系表单
- Header sticky 效果
- 移动端响应式（375px、768px）
- `prefers-reduced-motion` 动画降级

---

## 完成标准

- [ ] 4 个核心页面渲染正确，样式与 v5 一致
- [ ] 数据库可读写，种子数据可正常运行
- [ ] `npm run build` 无报错
- [ ] 移动端适配通过（375px / 768px / 1024px / 1440px）
- [ ] 所有 `<img>` 标签带 `alt` 属性
- [ ] 表单输入框有关联 label 或 aria-label
