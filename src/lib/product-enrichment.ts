import type { CatalogProduct, SpecChip, TorqueRange } from "./catalog-store";
import { pickChips } from "./product-display";

export interface EnrichedProduct extends CatalogProduct {
  categoryId: string;
  chips: SpecChip[];
  accentIndex: number;
  torque: TorqueRange | null;
  force: TorqueRange | null;
}

export function enrichProduct(categoryId: string, product: CatalogProduct): EnrichedProduct {
  const chips = product.specifications.flatMap(raw => {
    const index = raw.search(/[:：]/);
    if (index <= 0) return [];
    const label = raw.slice(0, index).trim();
    const value = raw.slice(index + 1).trim();
    return label && value ? [{ label, value }] : [];
  });
  const picked = pickChips(chips, categoryId);
  return {
    ...product,
    categoryId,
    chips: picked.chips,
    accentIndex: picked.accentIndex,
    torque: product.torque ?? null,
    force: product.force ?? null,
  };
}
