# 关于我们页面重设计 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重新设计 `/about` 页面全部 10 个 section，统一使用 lucide-react 图标，从 teao-website 迁移素材，提升视觉质感。

**Architecture:** 每个 section 是独立的 `"use client"` 组件，使用 `Reveal` 包裹实现入场动画，数据从 `@/content/about` 导入。组件间无直接依赖，通过 `page.tsx` 组合。

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, lucide-react, @/components/ui/reveal

## 全局约束

- 所有组件必须使用 `"use client"` 指令（使用 Reveal 需 CSR）
- 图标统一使用 `lucide-react`，不使用 emoji
- 配色使用 Tailwind token：`brand-500` (#E8781A), `brand-700` (#C7610A), `brand-50` (#FFF3E8), `ink` (#1E1E20), `ink-soft` (#3A3A3E), `muted` (#6F6F75), `line` (#E4E4E7), `line-soft` (#EEEEF0), `surface` (#FAFAFB), `surface-warm` (#FFFBF7), `green` (#2D8A56)
- 卡片交互统一模式：`hover:-translate-y-1 hover:shadow-lg hover:border-brand-200 transition-all duration-300`
- 背景交替：白 ↔ `bg-surface-warm`，CTA 深色底 `#0a0b0d`
- 所有 section 使用 `Reveal` 组件包裹内容，不自己写 IntersectionObserver

---

## 组件文件清单

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/components/about/about-hero.tsx` | 重写 | Hero 左右分栏+工厂图+浮卡 |
| `src/components/about/business-stats.tsx` | 重写 | 经营数据 3×2 卡片网格 |
| `src/components/about/core-capabilities.tsx` | 重写 | 3 列图片卡片+Lucide 图标 |
| `src/components/about/company-timeline.tsx` | 重写 | 5 列时间线卡片 |
| `src/components/about/certifications-section.tsx` | 重写 | 体系认证+专利卡片 |
| `src/components/about/quality-promise.tsx` | 重写 | 4 步流程+交付横幅 |
| `src/components/about/service-industries.tsx` | 重写 | 5 列行业图标卡片 |
| `src/components/about/corporate-values.tsx` | 重写 | 4 列 CSR 价值观卡片 |
| `src/components/about/people-culture.tsx` | **新建** | 团队图片网格+理念卡片 |
| `src/components/about/about-cta.tsx` | 重写 | 深色 CTA+产品浮动卡 |
| `src/app/about/page.tsx` | 修改 | 新增 PeopleCulture |

---

### Task 0: 安装依赖 + 素材迁移

**文件:**
- 修改: `package.json` (依赖自动更新)
- 创建: `public/images/` 下多个目录和文件

**前置:** 无

- [ ] **Step 1: 安装 lucide-react**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npm install lucide-react
```

- [ ] **Step 2: 从 teao-website 复制素材文件**

```bash
# 公司图片
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/factory-entrance.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/visual-inspection.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/visual-inspection-2.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/automation-equipment.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/automation-equipment-2.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/automation-equipment-3.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/production-workshop.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/production-workshop-2.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/company/contactUs.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/company/

# 专利图片
mkdir -p /Users/mikewang/AI_Workspace/teao-CN/public/images/patents
cp /Users/mikewang/AI_Workspace/teao-website/public/images/patents/*.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/patents/

# 认证图片
mkdir -p /Users/mikewang/AI_Workspace/teao-CN/public/images/certifications
cp /Users/mikewang/AI_Workspace/teao-website/public/images/certifications/IATF16949.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/certifications/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/certifications/ISO14001.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/certifications/

# SVG 装饰
mkdir -p /Users/mikewang/AI_Workspace/teao-CN/public/images/about
cp /Users/mikewang/AI_Workspace/teao-website/public/images/about/bg-*.svg /Users/mikewang/AI_Workspace/teao-CN/public/images/about/

# 团队图片
mkdir -p /Users/mikewang/AI_Workspace/teao-CN/public/images/about/team
cp /Users/mikewang/AI_Workspace/teao-website/public/images/about/team/*.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/about/team/

# 产品缩略图（CTA 用）
cp /Users/mikewang/AI_Workspace/teao-website/public/images/products/gear-damper/GearDamperSingle.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/products/gear-damper/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/products/axial-damper/AxialDamperSingle.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/products/axial-damper/
cp /Users/mikewang/AI_Workspace/teao-website/public/images/products/glove-box-damper/GloveBoxDamperSingle.webp /Users/mikewang/AI_Workspace/teao-CN/public/images/products/glove-box-damper/
```

- [ ] **Step 3: 验证素材迁移成功**

```bash
# 确认关键文件存在
ls -la /Users/mikewang/AI_Workspace/teao-CN/public/images/company/factory-entrance.webp
ls -la /Users/mikewang/AI_Workspace/teao-CN/public/images/patents/RD-V109.webp
ls -la /Users/mikewang/AI_Workspace/teao-CN/public/images/certifications/IATF16949.webp
ls -la /Users/mikewang/AI_Workspace/teao-CN/public/images/about/team/team-office-v2.webp
ls -la /Users/mikewang/AI_Workspace/teao-CN/public/images/products/gear-damper/GearDamperSingle.webp
```

- [ ] **Step 4: 验证 lucide-react 可用**

```bash
node -e "require('lucide-react')" && echo "OK" || echo "FAIL"
```

- [ ] **Step 5: Commit**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
git add package.json package-lock.json public/images/
git commit -m "chore: install lucide-react and migrate assets from teao-website"
```

---

### Task 1: 重写 AboutHero

**文件:**
- 重写: `src/components/about/about-hero.tsx`

**接口:**
- 消费: `trustBadges` from `@/content/about`
- 产出: 无（页面级组件）

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trustBadges } from "@/content/about";

const sellingPoints = [
  { label: "20+ 年", desc: "阻尼器研发制造经验" },
  { label: "源头工厂", desc: "模具·注塑·装配·检测一体化" },
  { label: "IATF 认证", desc: "汽车级质量管理体系" },
];

export function AboutHero() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "linear-gradient(180deg, #000, transparent 85%)",
        }}
      />
      {/* Decorative ring */}
      <div className="pointer-events-none absolute -right-[14vw] top-[10%] h-[42vw] w-[42vw] max-w-[620px] max-h-[620px] rounded-full border border-brand-500/12" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 pb-14 lg:px-8 lg:pt-32 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Left: text */}
          <div>
            <div
              className={`inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="block h-[2px] w-[22px] rounded bg-brand-500" />
              关于特澳
            </div>

            <h1
              className={`mt-5 max-w-[640px] text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink transition-all duration-700 delay-100 sm:text-[40px] lg:text-[48px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              专注<span className="text-brand-500">阻尼器</span>与
              <span className="text-brand-500">锁扣</span>
              <br />
              定制制造{" "}
              <span className="inline-block rounded-lg bg-brand-50 px-2 py-0.5 text-brand-700">
                20+年
              </span>
            </h1>

            <p
              className={`mt-5 max-w-[560px] text-[16px] leading-relaxed text-muted transition-all duration-700 delay-200 lg:text-[18px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              特澳成立于 2001 年，是一家集模具开发、精密注塑、自动化装配和
              100% 扭矩检测于一体的阻尼器与锁扣源头制造厂家。凭借 IATF 16949
              认证体系和 8000 万件年产能，已为国内外 200+ 家汽车、家电、卫浴、医疗及工业领域企业提供可靠的缓冲控制解决方案。
            </p>

            {/* CTAs */}
            <div
              className={`mt-7 flex flex-wrap gap-3 transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(232,120,26,0.35)] transition-all hover:bg-brand-700 hover:shadow-[0_6px_20px_rgba(232,120,26,0.45)] hover:-translate-y-0.5"
              >
                立即询价
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:18617094202"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:border-brand-500 hover:bg-brand-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                186-1709-4202
              </a>
            </div>

            {/* Trust badges */}
            <div
              className={`mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line transition-all duration-700 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {trustBadges.map((b) => (
                <span
                  key={b}
                  className="flex items-center justify-center bg-white px-2 py-3 text-[11px] font-extrabold text-muted transition-colors hover:text-brand-700"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Selling points */}
            <div
              className={`mt-5 flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {sellingPoints.map((p) => (
                <div key={p.label} className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[13px] font-semibold text-ink-soft">
                    <span className="text-brand-600">{p.label}</span> · {p.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: factory image */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="relative aspect-[16/10] lg:aspect-[5/4] overflow-hidden rounded-2xl border border-line bg-[#1a1a1e] shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
              <Image
                src="/images/company/factory-entrance.webp"
                alt="特澳工厂"
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow-sm">
                <span className="text-[11px] font-bold text-muted">东莞黄江厂房</span>
                <span className="ml-2 text-xs font-extrabold text-brand-600">20+ 条产线</span>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -left-4 bottom-8 hidden rounded-xl border border-line bg-white px-5 py-4 shadow-[0_12px_32px_rgba(0,0,0,0.06)] lg:block">
              <span className="block text-3xl font-black leading-none text-brand-500">8000万</span>
              <span className="mt-1 block text-[11px] font-bold text-muted">年综合产能（件）</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-hero.tsx
git commit -m "refactor: rewrite AboutHero with factory image and new layout"
```

---

### Task 2: 重写 BusinessStats

**文件:**
- 重写: `src/components/about/business-stats.tsx`

**接口:**
- 消费: `businessStats` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { Reveal } from "@/components/ui/reveal";
import { businessStats } from "@/content/about";

export function BusinessStats() {
  return (
    <section className="bg-surface-warm py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              经营数据
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              数字背后的实力
            </h2>
            <p className="mt-2 text-[14px] text-muted">
              每一项数据，都是 24 年积累的信任凭证
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 lg:gap-4">
          {businessStats.map((stat, i) => (
            <Reveal key={stat.label} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group cursor-default rounded-xl border border-line bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg lg:p-7">
                <span className="block text-3xl font-black tracking-[-0.04em] text-brand-500 lg:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[12.5px] font-bold leading-snug text-ink-soft">
                  {stat.label}
                </span>
                <span className="mt-1 block text-[11px] font-semibold text-brand-600">
                  {stat.unit}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/business-stats.tsx
git commit -m "refactor: rewrite BusinessStats with clean card layout"
```

---

### Task 3: 重写 CoreCapabilities

**文件:**
- 重写: `src/components/about/core-capabilities.tsx`

**接口:**
- 消费: `competencies` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import Image from "next/image";
import { Settings, Wrench, Cog } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { competencies } from "@/content/about";

const icons = [Settings, Wrench, Cog];

export function CoreCapabilities() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              核心能力
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              从模具到交付 · 全链路自主可控
            </h2>
            <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted">
              模具开发、精密注塑、自动化装配、100%检测 — 每一个环节都在自有工厂内完成。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {competencies.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={Math.min(i + 2, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1e]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-extrabold text-brand-700">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-500" strokeWidth={1.5} />
                      <div>
                        <h3 className="text-lg font-extrabold text-ink">{item.title}</h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/core-capabilities.tsx
git commit -m "refactor: rewrite CoreCapabilities with lucide icons"
```

---

### Task 4: 重写 CompanyTimeline

**文件:**
- 重写: `src/components/about/company-timeline.tsx`

**接口:**
- 消费: `timeline` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { Reveal } from "@/components/ui/reveal";
import { timeline } from "@/content/about";

export function CompanyTimeline() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-12">
          {/* Left: section head */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                发展历程
              </span>
              <h2 className="mt-2.5 text-[26px] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink">
                每一步<br />都算数
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                从深圳创业到东莞新厂，24 年来我们始终专注阻尼器一件事。
              </p>
            </div>
          </Reveal>

          {/* Right: timeline cards */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group relative cursor-default rounded-xl border border-line bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg">
                  {/* Top accent bar */}
                  <div className="mb-2 h-1 w-8 rounded-full bg-line transition-all duration-300 group-hover:w-12 group-hover:bg-brand-500" />

                  <b className="block text-xl font-black tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-600">
                    {item.year}
                  </b>
                  <h3 className="mt-1.5 text-sm font-extrabold leading-tight text-ink-soft">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                    {item.description}
                  </p>

                  {/* Connector dot */}
                  <div className="absolute -top-[7px] right-4 h-3 w-3 rounded-full border-2 border-line bg-white transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:scale-110" />
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

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/company-timeline.tsx
git commit -m "refactor: rewrite CompanyTimeline with cleaner card design"
```

---

### Task 5: 重写 CertificationsSection

**文件:**
- 重写: `src/components/about/certifications-section.tsx`

**接口:**
- 消费: `systemCertificates`, `patentCertificates` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { systemCertificates, patentCertificates } from "@/content/about";

export function CertificationsSection() {
  return (
    <section className="bg-surface-warm py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              资质认证
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              体系认证与专利技术
            </h2>
            <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted">
              IATF 16949 汽车行业质量管理体系 + ISO 14001 环境管理体系双重认证。
            </p>
          </div>
        </Reveal>

        {/* System Certifications */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {systemCertificates.map((cert, i) => (
            <Reveal key={cert.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group relative cursor-default overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-5">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-line shadow-sm transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="flex-1">
                    <span className="inline-flex rounded-full bg-green/10 px-2.5 py-0.5 text-[10px] font-extrabold text-green tracking-wider">
                      已获证
                    </span>
                    <h3 className="mt-2 text-lg font-extrabold text-ink">{cert.name}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Patent Certificates */}
        <Reveal>
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
              国家专利证书
            </span>
            <p className="mt-1.5 text-[13px] text-muted">
              持续创新，已获得多项结构设计及功能专利
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {patentCertificates.map((pat, i) => (
            <Reveal key={pat.name} delay={Math.min(i + 2, 5) as 1 | 2 | 3 | 4 | 5}>
              <div className="group cursor-default overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
                  <Image
                    src={pat.image}
                    alt={pat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-extrabold text-ink">{pat.name}</h4>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{pat.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/certifications-section.tsx
git commit -m "refactor: rewrite CertificationsSection with improved visuals"
```

---

### Task 6: 重写 QualityPromise

**文件:**
- 重写: `src/components/about/quality-promise.tsx`

**接口:**
- 消费: `qualityPromises` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { ClipboardCheck, Zap, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { qualityPromises } from "@/content/about";

const icons = [ClipboardCheck, Zap, ShieldCheck, Truck];

export function QualityPromise() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              品质承诺
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              每一件产品，都经得起检验
            </h2>
            <p className="mt-2 max-w-[580px] text-[14px] leading-relaxed text-muted">
              从来料、过程到出货，四级品控体系确保每一件阻尼器都符合标准。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qualityPromises.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-2xl border border-line-soft bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                  {/* Step number */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-black text-brand-500 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(232,120,26,0.35)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <Icon className="h-7 w-7 text-brand-500" strokeWidth={1.5} />

                  <h3 className="mt-3 text-base font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.description}</p>

                  {/* Bottom accent */}
                  <div className="mt-5 h-1 w-0 rounded-full bg-brand-500 transition-all duration-500 group-hover:w-16" />
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Delivery promise highlight */}
        <Reveal delay={3}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200 bg-brand-50/70 p-6 text-center sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-extrabold text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                交付承诺
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  标准品 <b className="text-brand-600">3-5 天</b> 发货
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  定制件 <b className="text-brand-600">15-20 天</b> 交付
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  批次 <b className="text-brand-600">可追溯</b> 至原材料
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/quality-promise.tsx
git commit -m "refactor: rewrite QualityPromise with lucide icons"
```

---

### Task 7: 重写 ServiceIndustries

**文件:**
- 重写: `src/components/about/service-industries.tsx`

**接口:**
- 消费: `industries` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { Car, Home, Bath, HeartPulse, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/content/about";

const icons = [Car, Home, Bath, HeartPulse, Wrench];

export function ServiceIndustries() {
  return (
    <section className="bg-surface-warm py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
              before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
              服务行业
            </span>
            <h2 className="mt-2.5 text-[28px] font-extrabold tracking-[-0.03em] text-ink lg:text-[34px]">
              5 大行业 · 一站式阻尼缓冲方案
            </h2>
            <p className="mt-2 text-[14px] text-muted">
              从汽车到家电，从卫浴到医疗 — 我们在多个行业积累了丰富的应用经验
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={industry.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-2xl border border-line bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 transition-all duration-300 group-hover:bg-brand-500">
                    <Icon className="h-6 w-6 text-brand-500 transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-ink">{industry.name}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                    {industry.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/service-industries.tsx
git commit -m "refactor: rewrite ServiceIndustries with lucide icons"
```

---

### Task 8: 重写 CorporateValues

**文件:**
- 重写: `src/components/about/corporate-values.tsx`

**接口:**
- 消费: `corporateValues` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import { BookOpen, HeartHandshake, Leaf, Building2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { corporateValues } from "@/content/about";

const icons = [BookOpen, HeartHandshake, Leaf, Building2];

export function CorporateValues() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[0.78fr_1fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                企业社会责任
              </span>
              <h2 className="mt-2.5 text-[26px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] lg:text-[38px]">
                做有温度的企业
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-muted lg:text-[17px]">
              企业的价值不仅在于产品，更在于对员工、社区和环境的责任。我们相信负责任的企业成长意味着为所有人创造价值。
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corporateValues.map((value, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={value.name} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="group cursor-default rounded-xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                  <Icon className="mb-5 h-7 w-7 text-brand-500" strokeWidth={1.5} />
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-ink">{value.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/corporate-values.tsx
git commit -m "refactor: rewrite CorporateValues with lucide icons and layout"
```

---

### Task 9: 新建 PeopleCulture

**文件:**
- 创建: `src/components/about/people-culture.tsx`

**接口:**
- 消费: `peopleCulture` from `@/content/about`
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import Image from "next/image";
import { GraduationCap, HeartPulse, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { peopleCulture } from "@/content/about";

const cultureIcons = [GraduationCap, HeartPulse, ShieldCheck];

export function PeopleCulture() {
  const cultureImages = [
    { src: peopleCulture.images.office, alt: "特澳办公室团队合影" },
    { src: peopleCulture.images.employeeWork, alt: "特澳团队互动" },
    { src: peopleCulture.images.training, alt: "特澳员工培训" },
    { src: peopleCulture.images.building, alt: "特澳团建活动" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-12 lg:py-16">
      {/* Decorative ring */}
      <div className="pointer-events-none absolute left-[-80px] top-[-140px] h-[320px] w-[320px] rounded-full border border-brand-500/10" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-11">
          {/* Left: text */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-700 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                {peopleCulture.eyebrow}
              </span>
              <h2 className="mt-2.5 text-[26px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] lg:text-[38px]">
                {peopleCulture.title}
              </h2>
              <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-muted lg:text-[17px]">
                {peopleCulture.description}
              </p>
            </div>
          </Reveal>

          {/* Right: image grid */}
          <Reveal delay={1}>
            <div className="relative mx-auto max-w-[680px]">
              {/* Decorative dashed outline behind */}
              <div className="absolute -left-4 top-8 hidden h-[78%] w-[58%] rounded-2xl border border-brand-500/12 bg-white/40 lg:block" />

              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
                {cultureImages.map((image, index) => (
                  <figure
                    key={image.src}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_30px_rgba(15,23,42,0.055)] ${
                      index === 1 || index === 3 ? "translate-y-4" : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                      loading="lazy"
                      draggable={false}
                    />
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Culture highlights */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-8">
          {peopleCulture.highlights.map((item, index) => {
            const Icon = cultureIcons[index];
            return (
              <Reveal key={item.name} delay={Math.min(index + 2, 5) as 1 | 2 | 3 | 4 | 5}>
                <div className="h-full rounded-xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
                  <Icon className="h-6 w-6 text-brand-500" strokeWidth={1.7} />
                  <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.02em] text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/people-culture.tsx
git commit -m "feat: add PeopleCulture section with team photos grid"
```

---

### Task 10: 重写 AboutCTA

**文件:**
- 重写: `src/components/about/about-cta.tsx`

**接口:**
- 消费: 无（内联数据）
- 产出: 无

- [ ] **Step 1: 写入新组件**

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0a0b0d] py-20 text-white lg:py-28">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-[0.12]">
        <Image
          src="/images/company/factory-entrance.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/97 via-[#0a0b0d]/88 to-[#0a0b0d]/72" />
      {/* Decorative ring */}
      <div className="pointer-events-none absolute -right-[100px] -bottom-[160px] h-[500px] w-[500px] rounded-full border border-brand-500/15" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
          {/* Left: text + CTAs */}
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-bold text-brand-500 tracking-[0.14em] uppercase
                before:content-[''] before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                开始合作
              </span>
              <h2 className="mt-3.5 max-w-[640px] text-[clamp(30px,4vw,48px)] leading-[1.02] tracking-[-0.04em] font-black">
                有阻尼器需求？<br />
                让我们为您提供<span className="text-brand-500">专业方案</span>
              </h2>
              <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-white/55 lg:text-[18px]">
                发送图纸或样品，我们将在 24 小时内提供技术评估和报价建议
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-extrabold text-white shadow-[0_6px_24px_rgba(232,120,26,0.4)] transition-all hover:bg-brand-700 hover:shadow-[0_8px_30px_rgba(232,120,26,0.5)] hover:-translate-y-0.5"
                >
                  立即询价
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="tel:18617094202"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-transparent px-7 py-3.5 text-base font-extrabold text-white transition-all hover:border-brand-500 hover:text-brand-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  186-1709-4202
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right: product cards */}
          <Reveal delay={2}>
            <div className="hidden flex-col gap-3 lg:flex">
              {[
                { src: "/images/products/gear-damper/GearDamperSingle.webp", label: "齿轮阻尼器" },
                { src: "/images/products/axial-damper/AxialDamperSingle.webp", label: "轴向阻尼器" },
                { src: "/images/products/glove-box-damper/GloveBoxDamperSingle.webp", label: "手套箱阻尼器" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-white/15 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-[#F8F9FA]">
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-500">
                      0{index + 1}
                    </span>
                    <p className="mt-0.5 text-sm font-extrabold text-ink">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Trust indicators */}
        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/45">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              24 小时内响应
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              免费技术评估
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              不限数量打样
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/about/about-cta.tsx
git commit -m "refactor: rewrite AboutCTA with dark background and product cards"
```

---

### Task 11: 更新 page.tsx

**文件:**
- 修改: `src/app/about/page.tsx`

**接口:**
- 新增导入: `PeopleCulture` from `@/components/about/people-culture`
- 插入位置: `CorporateValues` 之后，`AboutCTA` 之前

- [ ] **Step 1: 修改 page.tsx**

Replace the file with:

```typescript
import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { BusinessStats } from "@/components/about/business-stats";
import { CoreCapabilities } from "@/components/about/core-capabilities";
import { CertificationsSection } from "@/components/about/certifications-section";
import { QualityPromise } from "@/components/about/quality-promise";
import { ServiceIndustries } from "@/components/about/service-industries";
import { CorporateValues } from "@/components/about/corporate-values";
import { PeopleCulture } from "@/components/about/people-culture";
import { AboutCTA } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "关于特澳 | 20+年阻尼器定制厂家",
  description:
    "特澳 TEAO 成立于 2001 年，专注阻尼器与锁扣机构研发制造 20 余年。IATF 16949 认证，8000 万件年产能，模具·注塑·装配·检测一体化源头工厂。",
  keywords: [
    "特澳",
    "TEAO",
    "阻尼器厂家",
    "阻尼器",
    "齿轮阻尼器厂家",
    "阻尼器制造商",
    "阻尼器定制",
    "IATF 16949",
    "源头工厂",
    "锁扣厂家",
  ],
  openGraph: {
    title: "关于特澳 | 20+年阻尼器定制厂家",
    description:
      "IATF 16949 认证源头工厂，模具·注塑·装配·检测一体化，8000 万件年产能。",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BusinessStats />
      <CoreCapabilities />
      <CompanyTimeline />
      <CertificationsSection />
      <QualityPromise />
      <ServiceIndustries />
      <CorporateValues />
      <PeopleCulture />
      <AboutCTA />
    </>
  );
}
```

- [ ] **Step 2: 最终构建验证**

```bash
cd /Users/mikewang/AI_Workspace/teao-CN
npx next build 2>&1 | tail -30
```

Expected: "✓ Compiled successfully" or "✓ Generating static pages"

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add PeopleCulture section to about page"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Section 1 (AboutHero) → Task 1
- ✅ Section 2 (BusinessStats) → Task 2
- ✅ Section 3 (CoreCapabilities) → Task 3
- ✅ Section 4 (CompanyTimeline) → Task 4
- ✅ Section 5 (CertificationsSection) → Task 5
- ✅ Section 6 (QualityPromise) → Task 6
- ✅ Section 7 (ServiceIndustries) → Task 7
- ✅ Section 8 (CorporateValues) → Task 8
- ✅ Section 9 (PeopleCulture) → Task 9
- ✅ Section 10 (AboutCTA) → Task 10
- ✅ Asset migration → Task 0
- ✅ Page integration → Task 11
- ✅ lucide-react dependency → Task 0

**2. Placeholder scan:** No TBDs, TODOs, or vague instructions found.

**3. Type consistency:** All imports reference exact paths. All icon arrays match their section's data count. Reveal delay types are valid (1-5). All section components have self-contained data dependencies from `@/content/about`.
