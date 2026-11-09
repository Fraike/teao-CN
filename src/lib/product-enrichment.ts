import overlayData from "@/content/live-site/product-specs.json";
import type { CatalogProduct } from "./live-catalog";
import { parseSpecifications, pickChips, type SpecChip } from "./product-display";

interface OverlayEntry {
  model: string;
  torque: { min: number; max: number; unit: string } | null;
  force: { min: number; max: number; unit: string } | null;
  mounting: string | null;
  specs: SpecChip[];
}

const overlay = overlayData as Record<string, OverlayEntry>;

export interface EnrichedProduct extends CatalogProduct {
  categoryId: string;
  chips: SpecChip[];
  accentIndex: number;
  torque: OverlayEntry["torque"];
  force: OverlayEntry["force"];
}

export function enrichProduct(categoryId: string, product: CatalogProduct): EnrichedProduct {
  const entry = overlay[product.path];
  const source = entry?.specs?.length ? entry.specs : parseSpecifications(product.specifications ?? []);
  const picked = pickChips(source, categoryId);
  return {
    ...product,
    categoryId,
    chips: picked.chips,
    accentIndex: picked.accentIndex,
    torque: entry?.torque ?? null,
    force: entry?.force ?? null,
  };
}
