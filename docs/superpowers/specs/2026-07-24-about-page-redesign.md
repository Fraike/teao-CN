# 关于我们页面重设计 — 设计规格

**日期：** 2026-07-24  
**设计方向：** 大气商务信赖风（方案 B）  
**参考站：** teao-website（素材复用，设计独立）

---

## 目标

重新设计 `/about` 页面，保持数据内容不变，提升视觉质感，对标国内 B2B 制造业审美。素材（图片、视频）从 teao-website 复制到中文站 `public/` 目录。

---

## 全局设计原则

- **配色：** 品牌橙 `#E8781A`（brand-500），深色 `#1B1B1F`，ink `#111827`，muted `#6B7280`
- **图标：** 统一使用 `lucide-react` 替代 emoji，映射如下：

| Section | 原 emoji/无 | Lucide 图标 |
|---------|------------|-------------|
| QualityPromise | 📋⚡✅📦 | ClipboardCheck / Zap / ShieldCheck / Truck |
| ServiceIndustries | 🚗🏠🛁🏥⚙️ | Car / Home / Bath / HeartPulse / Wrench |
| CorporateValues | 📚🤝🌱🏘️ | BookOpen / HeartHandshake / Leaf / Building2 |
| PeopleCulture | —（新建） | GraduationCap / HeartPulse / ShieldCheck |
| CoreCapabilities | 无 | Settings / Wrench / Cog |
- **动画：** 所有 section 使用现有 `Reveal` 组件驱动入场动画
- **卡片交互：** hover 上浮 4px + 阴影加深 + 边框变品牌色（统一交互模式）
- **背景交替：** 白色 ↔ 浅暖灰 `bg-surface-warm` 交替，形成视觉节奏
- **字体层级：** eyebrow 11.5px 粗体大写 → 标题 28-34px 超粗体 → 正文 14px

---

## Section 细化设计

### 1. AboutHero（Hero 区）

**素材：** `/images/company/factory-entrance.webp`（从 teao-website 复制），YouTube 视频链接（teao-website `companyVideoUrl`）

**布局：**
- 左右分栏 `lg:grid-cols-[1.1fr_0.9fr]`
- 左：eyebrow "关于特澳" + 主标题（48px 超粗，"阻尼器"和"锁扣"品牌色强调）+ 描述（18px）+ CTA 按钮 + 4 列信任徽章网格 + 3 个卖点标签
- 右：16:10 工厂图卡片（圆角 16px），右下浮出产能数据卡片（"8000万 年综合产能"）

**背景：** 网格纹理 + 右上角品牌色装饰圆环

**交互：** IntersectionObserver 驱动入场动画（保持现有模式）

---

### 2. BusinessStats（经营数据区）

**素材：** 无新素材

**布局：**
- 居中 eyebrow "经营数据" + 标题 "数字背后的实力" + 副标题
- 2 行 × 3 列卡片网格

**卡片样式：**
- 白底 + 细边框 `border-line` + 浅阴影
- 顶部品牌色超大数字 `text-4xl font-black text-brand-500`
- 中间灰色标签 + 底部品牌色浅底单位标签
- hover：上浮 + 阴影加深 + 边框变 `border-brand-200`

**背景：** `bg-surface-warm`

---

### 3. CoreCapabilities（核心能力区）

**素材：** 复用现有图片路径（`/images/company/visual-inspection.webp` 等），确认文件存在

**布局：**
- 左对齐 eyebrow + 标题 "从模具到交付 · 全链路自主可控" + 描述
- 3 列卡片

**卡片样式：**
- 顶部 16:10 图片区（深色底），左上角品牌色圆角标签（副标题）
- 图片底部渐变遮罩过渡到白色内容区
- Lucide 图标（Settings / Wrench / Cog）+ 标题 + 描述
- 底部品牌色浅底 highlight 标签（check 图标 + 文字）
- hover：图片 scale-105，整卡上浮

**背景：** 白色

---

### 4. CompanyTimeline（发展历程区）

**素材：** 无新素材

**布局：**
- 左：标题 "每一步都算数" + 描述
- 右：5 列等宽卡片（2001 / 2009 / 2014 / 2021 / 2025）

**卡片样式：**
- 顶部品牌色细线（hover 延长）
- 年份数字 24px 超粗体
- 标题 + 简短描述
- 右上角小圆点装饰
- hover：边框变 brand-300 + 浅橙底 + 上浮

**背景：** 白色

---

### 5. CertificationsSection（资质认证区）

**素材：** 确认专利图路径（`/images/patents/RD-*.webp`），从 teao-website 补充缺失的

**布局：**
- 上：2 列体系认证卡片（IATF 16949 + ISO 14001）
- 下：标题 "国家专利证书" + 3 列专利卡片

**体系认证卡片：**
- 左：竖向证书缩略图 80×112px，hover 光泽扫过
- 右："已获证"绿色徽章 + 认证名称 + 描述

**专利卡片：**
- 3:4 证书实拍图 + 专利名称 + 描述
- hover：图上浮

**背景：** `bg-surface-warm`

---

### 6. QualityPromise（品质承诺区）

**素材：** 无新素材

**布局：**
- 左对齐 eyebrow + 标题 + 描述
- 4 列步骤卡片（01-04）
- 底部交付承诺横幅

**卡片样式：**
- 左上角步骤编号方块（hover 填充品牌色+白色数字）
- Lucide 图标替代 emoji（ClipboardCheck / Zap / ShieldCheck / Truck）
- 标题 + 描述 + 底部品牌色短线（hover 延长）

**交付横幅：** 品牌色浅底圆角卡片，3 项交付承诺 + check 图标

**背景：** 白色

---

### 7. ServiceIndustries（服务行业区）

**素材：** 无新素材

**布局：**
- 居中 eyebrow + 标题 + 描述
- 5 列行业卡片

**卡片样式：**
- Lucide 图标（Car / Home / Bath / HeartPulse / Wrench），品牌色圆形浅底衬底
- hover：圆形衬底填充品牌色+白色图标，整卡上浮

**背景：** `bg-surface-warm`

---

### 8. CorporateValues（企业社会责任区）

**素材：** SVG 装饰 `bg-latch-outline.svg`

**布局：**
- 左右分栏标题区：左侧 eyebrow "企业社会责任" + 标题 "做有温度的企业"，右侧描述文字
- 4 列价值观卡片

**卡片样式：**
- Lucide 图标（BookOpen / HeartHandshake / Leaf / Building2），品牌色 28px
- 标题（xl 粗体）+ 描述
- hover：上浮 + 阴影加深 + 边框变品牌色

**背景：** 白色

---

### 9. PeopleCulture（团队文化区）

**素材：** 4 张团队实拍图（`/images/about/team/team-*.webp`），从 teao-website 复制

**布局：**
- 左右分栏：左文字（eyebrow "团队与文化" + 标题 + 描述），右 2×2 图片网格
- 图片网格：4 张 4:3 比例圆角图片，第 2/4 列向下偏移形成错落感
- 下方 3 列文化理念卡片

**图片网格样式：**
- 圆角 12px，白底边框，浅阴影
- 左侧装饰性虚线框（品牌色淡边框）

**文化理念卡片：**
- Lucide 图标（GraduationCap / HeartPulse / ShieldCheck），品牌色
- 标题（粗体）+ 描述
- hover：上浮 + 阴影加深

**背景：** 浅灰 `bg-surface-warm` 或 `#F8FAFC`

---

### 10. AboutCTA（底部 CTA 区）

**素材：** `/images/company/factory-entrance.webp` 低透明度叠加背景，3 张产品缩略图（从 teao-website 复制）

**布局：**
- 深色底 + 工厂图低透明度叠加 + 渐变遮罩 + 品牌色发光圆
- 左（60%）：eyebrow + 大标题 + 描述 + 双按钮（主按钮"立即询价" + 次按钮"电话咨询"）
- 右（40%）：3 张产品浮动卡片（齿轮阻尼器 / 轴向阻尼器 / 手套箱阻尼器），每张含编号+缩略图+名称
- 底部 3 个信任标记（24h 响应 / 免费评估 / 不限打样）

**背景：** 深色 `#0a0b0d`

---

## 素材迁移清单

从 teao-website 复制到 teao-CN 的完整文件清单：

### 公司图片（缺失的）
```
teao-website/public/images/company/factory-entrance.webp
teao-website/public/images/company/visual-inspection.webp
teao-website/public/images/company/visual-inspection-2.webp
teao-website/public/images/company/automation-equipment-2.webp
teao-website/public/images/company/automation-equipment-3.webp
teao-website/public/images/company/automation-equipment.webp
teao-website/public/images/company/production-workshop.webp
teao-website/public/images/company/production-workshop-2.webp
teao-website/public/images/company/contactUs.webp
→ teao-CN/public/images/company/
```

### 专利证书图片（全部）
```
teao-website/public/images/patents/RD-V109.webp
teao-website/public/images/patents/RD-V108.webp
teao-website/public/images/patents/RD-T088.webp
teao-website/public/images/patents/RD-T015.webp
teao-website/public/images/patents/RD-T023.webp
teao-website/public/images/patents/RD-T180A.webp
teao-website/public/images/patents/RD-V038.webp
teao-website/public/images/patents/RD-V129.webp
→ teao-CN/public/images/patents/
```

### 认证图片
```
teao-website/public/images/certifications/IATF16949.webp
teao-website/public/images/certifications/ISO14001.webp
→ teao-CN/public/images/certifications/
```

### SVG 装饰
```
teao-website/public/images/about/bg-cylindrical-damper-outline.svg
teao-website/public/images/about/bg-gear-damper-outline.svg
teao-website/public/images/about/bg-glove-box-damper-outline.svg
teao-website/public/images/about/bg-latch-outline.svg
→ teao-CN/public/images/about/
```

### 团队图片
```
teao-website/public/images/about/team/team-office-v2.webp
teao-website/public/images/about/team/team-building-v3.webp
teao-website/public/images/about/team/team-training-v2.webp
teao-website/public/images/about/team/team-interaction-v3.webp
→ teao-CN/public/images/about/team/
```

### 产品缩略图（CTA 区使用）
```
teao-website/public/images/products/gear-damper/GearDamperSingle.webp
teao-website/public/images/products/axial-damper/AxialDamperSingle.webp
teao-website/public/images/products/glove-box-damper/GloveBoxDamperSingle.webp
→ teao-CN/public/images/products/{gear-damper,axial-damper,glove-box-damper}/
```

### 视频 URL
```
companyVideoUrl: "/video/companyProfile.mp4" (需复制视频文件)
youtubeVideoPlaybackUrl: 通过 YOUTUBE_VIDEO_ID 环境变量构建
```

---

## 组件改动范围

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `src/components/about/about-hero.tsx` | 重写 | 新布局，工厂图+浮卡 |
| `src/components/about/business-stats.tsx` | 重写 | 新卡片样式 |
| `src/components/about/core-capabilities.tsx` | 修改 | Lucide 图标，卡片优化 |
| `src/components/about/company-timeline.tsx` | 修改 | 卡片交互优化 |
| `src/components/about/certifications-section.tsx` | 修改 | 视觉优化 |
| `src/components/about/quality-promise.tsx` | 修改 | Lucide 图标替代 emoji |
| `src/components/about/service-industries.tsx` | 修改 | Lucide 图标替代 emoji |
| `src/components/about/corporate-values.tsx` | 重写 | 对标英文站，Lucide 图标+左右分栏标题 |
| `src/components/about/people-culture.tsx` | **新建** | 团队图片网格+文化理念卡片 |
| `src/components/about/about-cta.tsx` | 重写 | 深色底+产品卡片布局 |
| `src/content/about.ts` | 不修改 | 数据保持不变（peopleCulture 已存在） |
| `src/app/about/page.tsx` | 修改 | 新增 PeopleCulture 导入和使用 |

---

## 不在此次范围的改动

- 不新增 CompanyVideoSection（YouTube 链接后续替换为国内平台时再做）
- 不新增 CustomersSection
- 不修改 `src/content/about.ts` 数据文件
- 不修改页面路由结构
