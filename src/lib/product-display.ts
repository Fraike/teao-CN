// 商品列表展示计算 — 与英文站 src/lib/products.ts 的写法保持一致

export interface SpecChip { label: string; value: string }
export interface RangeBar { scaleMax: number; start: number; width: number }

const MIN_BAR_WIDTH = 6;

const CHIP_PRIORITY: Record<string, string[]> = {
  "gear-damper": ["尺寸", "齿数", "模数", "安装方式"],
  "axial-damper": ["尺寸", "有效行程", "安装方式"],
  "glove-box-damper": ["有效行程", "尺寸", "安装方式"],
  latch: ["声音", "操作力"],
};

export function parseSpecifications(specs: readonly string[]): SpecChip[] {
  const chips: SpecChip[] = [];
  for (const raw of specs) {
    const match = String(raw ?? "").trim().match(/^([^:：]+)[:：]\s*(.+)$/);
    if (match) chips.push({ label: match[1].trim(), value: match[2].trim() });
  }
  return chips;
}

/** Round up to a "nice" ceiling (1, 2, 5, 10, 20, 50, 100, …). */
export function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const normalized = value / power;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * power;
}

function rangeBar(range: { min: number; max: number } | null): RangeBar | null {
  if (!range) return null;
  const scaleMax = niceCeil(range.max * 1.45);
  const rawStart = Math.max(0, Math.min(100, (range.min / scaleMax) * 100));
  const rawEnd = Math.max(rawStart, Math.min(100, (range.max / scaleMax) * 100));
  const width = Math.min(Math.max(MIN_BAR_WIDTH, rawEnd - rawStart), 100 - rawStart);
  const start = rawStart + rawEnd > 0 ? Math.min(rawStart, 100 - width) : rawStart;
  return { scaleMax, start, width };
}

export function getTorqueBar(torque: { min: number; max: number } | null): RangeBar | null {
  return rangeBar(torque);
}

export function getForceBar(force: { min: number; max: number } | null): RangeBar | null {
  return rangeBar(force);
}

export function formatTorque(torque: { min: number; max: number; unit: string }): string {
  return torque.min === torque.max ? `${torque.min} ${torque.unit}` : `${torque.min} – ${torque.max} ${torque.unit}`;
}

export function pickChips(chips: SpecChip[], categoryId: string): { chips: SpecChip[]; accentIndex: number } {
  const priority = CHIP_PRIORITY[categoryId];
  const ordered = priority
    ? [...priority.flatMap(label => chips.filter(chip => chip.label === label)), ...chips.filter(chip => !priority.includes(chip.label))]
    : chips;
  return { chips: ordered.slice(0, 4), accentIndex: 0 };
}
