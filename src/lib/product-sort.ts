// 按型号自然排序:RD-T001 < RD-T002 < RD-T010 < RD-T010A < RD-T011

export interface ModelKey {
  prefix: string;
  number: number;
  suffix: string;
}

export function modelSortKey(model: string): ModelKey {
  const cleaned = String(model ?? "").toUpperCase().replace(/\s+/g, "");
  const match = cleaned.match(/RD-?([A-Z]*)-?(\d+)([A-Z]*)/);
  if (!match) return { prefix: cleaned, number: Number.MAX_SAFE_INTEGER, suffix: "" };
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

/** 带字母前缀的系列(如 T001、TR02、V107)排在纯数字型号(如 RD-10)之前。 */
function prefixRank(prefix: string): number {
  return prefix === "" ? 1 : 0;
}

export function compareModel(a: string, b: string): number {
  const left = modelSortKey(a);
  const right = modelSortKey(b);
  const rankDiff = prefixRank(left.prefix) - prefixRank(right.prefix);
  if (rankDiff !== 0) return rankDiff;
  if (left.prefix !== right.prefix) return left.prefix.localeCompare(right.prefix);
  if (left.number !== right.number) return left.number - right.number;
  if (left.suffix !== right.suffix) return left.suffix.localeCompare(right.suffix);
  return String(a).localeCompare(String(b));
}
