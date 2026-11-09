// 型号归一化:把 "RD-T069 / RD-V069"、"RD- T019"、"RD-R018 适用于…" 统一成形如 RDT069 的键。

const ALIASES = new Map([
  ["RD10L", "RD10"],
  ["RD10R", "RD10"],
]);

export function modelKeys(value) {
  return (String(value ?? "").toUpperCase().replace(/\s+/g, "").match(/RD-?[A-Z0-9]+/g) ?? [])
    .map(token => token.replace(/-/g, ""));
}

export function canonicalKeys(value) {
  return modelKeys(value).map(key => ALIASES.get(key) ?? key);
}
