// 扭矩单位换算 — 纯函数,行为与英文站 TorqueConverter 保持一致

export interface TorqueUnit { key: string; label: string }
export interface TorqueResult extends TorqueUnit { value: number }

export const TORQUE_UNITS: TorqueUnit[] = [
  { key: "N·m", label: "N·m" },
  { key: "cN·m", label: "cN·m (N·cm)" },
  { key: "mN·m", label: "mN·m" },
  { key: "kgf·cm", label: "kgf·cm" },
  { key: "kgf·m", label: "kgf·m" },
  { key: "gf·cm", label: "gf·cm" },
  { key: "lbf·in", label: "lbf·in" },
  { key: "lbf·ft", label: "lbf·ft" },
  { key: "ozf·in", label: "ozf·in" },
];

const TORQUE_TO_NM: Record<string, number> = {
  "N·m": 1,
  "cN·m": 0.01,
  "mN·m": 0.001,
  "kgf·cm": 0.0981,
  "kgf·m": 9.81,
  "gf·cm": 0.0000981,
  "lbf·in": 0.113,
  "lbf·ft": 1.36,
  "ozf·in": 0.00706,
};

export function formatTorqueValue(v: number): string {
  const a = Math.abs(v);
  if (a === 0) return "0";
  if (a < 0.001) return v.toExponential(3);
  if (a < 1) return v.toFixed(4);
  if (a < 10) return v.toFixed(3);
  if (a < 100) return v.toFixed(2);
  if (a < 1000) return v.toFixed(1);
  return Math.round(v).toLocaleString("en-US");
}

export function normalizeTorqueInput(raw: string): string | null {
  const normalized = raw.replace(/[，。．]/g, ".").replace(/,/g, ".");

  if (normalized === "") return "";
  if (normalized === ".") return "0.";
  if (normalized.startsWith(".")) return `0${normalized}`;
  if (!/^\d*\.?\d{0,3}$/.test(normalized)) return null;

  return normalized;
}

export function isTeaoTorqueUnit(key: string): boolean {
  return key === "gf·cm" || key === "mN·m";
}

export function convertTorque(value: string, fromUnit: string): TorqueResult[] | null {
  const num = parseFloat(value);
  if (isNaN(num)) return null;

  const nmValue = num * TORQUE_TO_NM[fromUnit];
  return TORQUE_UNITS.map(unit => ({ ...unit, value: nmValue / TORQUE_TO_NM[unit.key] }));
}
