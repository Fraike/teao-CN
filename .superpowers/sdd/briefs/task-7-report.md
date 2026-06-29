# Task 7 Report: Product Listing + Product Detail Pages

## Status: COMPLETED

## Files Created

1. **`src/lib/constants.ts`** — Chinese category constants (`CATEGORIES_ZH`) with 5 categories including slug, name, description, image, and zhTags array.

2. **`src/app/products/page.tsx`** — Product listing page:
   - Metadata: title="产品中心", SEO description
   - Queries all active products + categories from DB
   - Category filter tabs (`?category=slug`) with active state styling
   - "全部" tab to show all products
   - 5-column responsive grid (2-col on mobile) with Reveal staggered animations
   - Each card: product image, model badge, name, summary (line-clamp-2), "详情 →" link
   - Empty state for categories with no products
   - Uses existing design tokens (brand-50/500/700, ink, muted, line, line-soft, surface)

3. **`src/app/products/[category]/[slug]/page.tsx`** — Product detail page:
   - `generateMetadata` for dynamic SEO (title, description, OpenGraph)
   - Breadcrumb navigation: 首页 > 产品中心 > [category] > [product name]
   - Two-column layout: left (large product image in Next.js Image), right (info)
   - Model badge, h1 title, full description
   - Specifications table: parses `specifications` JSON string into key-value table rows
   - Features list: parses `features` JSON string array into bullet list
   - Applications tags: parses `applications` JSON string array into branded tags
   - CTA buttons: "发送图纸获取报价" → /contact, "电话咨询" → tel:021-57684226
   - `notFound()` handling for missing products

## Verification Results

| Check | Result |
|---|---|
| `npm run dev` starts without errors | PASS |
| `/products` returns 200 | PASS |
| `/products` shows 5 products in grid | PASS |
| `/products?category=gear-damper` filters to TRD-25 + RD-T015 | PASS |
| `/products?category=axial-damper` shows TAD-18 | PASS |
| `/products/gear-damper/trd-25-rotary-gear-damper` returns 200 | PASS |
| Detail page: specs table (e.g., "扭矩范围", "0.5 – 4.0 N·m") | PASS |
| Detail page: features list ("产品特点") | PASS |
| Detail page: applications tags ("应用场景") | PASS |
| Detail page: CTA buttons ("发送图纸获取报价", "电话咨询") | PASS |
| Non-existent product slug returns 404 | PASS |

## Technical Notes

- Uses `params` and `searchParams` as `Promise` types per Next.js 16 API
- DB queries use drizzle-orm with `eq()` for filtering
- JSON fields (`specifications`, `features`, `applications`) parsed with try/catch fallback
- All styling uses existing design tokens defined in `globals.css`
- Card design matches the existing `ProductGrid` home component for visual consistency
