// 产品详情内容 —— 仅服务端使用。数据由 scripts/generate-product-content.mjs 生成。
import productData from "@/content/live-site/products.json";
import { liveCatalog, type CatalogProduct } from "./live-catalog";

export interface ProductImage { url: string; alt?: string }
export interface SpecChip { label: string; value: string }
export interface TorqueRange { min: number; max: number; unit: string }
export interface MaterialItem { part: string; material: string }
export interface Variants {
  variants: string[];
  rows: { param: string; values: string[] }[];
}

export interface ProductContent {
  path: string;
  slug: string;
  categoryId: string;
  model: string;
  name: string;
  summary: string;
  images: ProductImage[];
  characteristics: string[];
  torque: TorqueRange | null;
  force: TorqueRange | null;
  hardTorque: string | null;
  hardForce: string | null;
  soundType: string | null;
  bufferDirection: string | null;
  assemblyMethod: string | null;
  durability: { cycles: number } | null;
  specifications: SpecChip[];
  materials: MaterialItem[];
  applications: string[];
  applicationScenarios: { image: string; label: string }[];
  dimensionDrawing: string | null;
  performanceCharts: { rotation: string | null; temperature: string | null } | null;
  variants: Variants | null;
}

const content = productData as Record<string, ProductContent>;

export function getProductContent(path: string): ProductContent | null {
  return content[path] ?? null;
}

export function getRelatedProducts(categoryId: string, excludePath: string, limit = 4): CatalogProduct[] {
  const category = liveCatalog.find(item => item.id === categoryId);
  if (!category) return [];
  return category.pages
    .flatMap(page => page.products)
    .filter(product => product.path !== excludePath)
    .slice(0, limit);
}

export function formatCycles(cycles: number): string {
  if (cycles >= 10000) {
    const wan = cycles / 10000;
    return `≥ ${Number.isInteger(wan) ? wan : wan.toFixed(1)} 万次`;
  }
  return `≥ ${cycles.toLocaleString("zh-CN")} 次`;
}

export function formatRange(range: TorqueRange): string {
  return range.min === range.max ? `${range.min} ${range.unit}` : `${range.min} – ${range.max} ${range.unit}`;
}

export interface ProductFaq { question: string; answer: string }

export function buildProductFaq(product: ProductContent): ProductFaq[] {
  const usage = product.applications.length > 0
    ? `适用于${product.applications.join("、")}。`
    : "适用于汽车内饰、家用电器、办公设备与工业机械等需要缓冲或缓降控制的机构。";

  const range = product.torque
    ? `本型号的可调扭矩为 ${formatRange(product.torque)},可在该区间内按要求调校。`
    : product.force
      ? `本型号的操作力为 ${formatRange(product.force)}。`
      : "本型号的扭矩可按应用需求定制,欢迎提供目标参数。";

  const check = [
    product.bufferDirection ? `阻尼方向为${product.bufferDirection}` : "确认所需阻尼方向",
    product.assemblyMethod ? `安装方式为${product.assemblyMethod}` : "确认安装结构与空间",
    "以及工作温度与循环寿命要求",
  ].join(";");

  return [
    { question: `${product.model} 用在什么地方?`, answer: usage },
    { question: `${product.model} 支持多大扭矩?`, answer: range },
    { question: `选择 ${product.model} 前需要确认什么?`, answer: `${check}。` },
  ];
}
