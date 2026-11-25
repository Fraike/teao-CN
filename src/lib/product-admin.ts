// 商品后台校验与 PATCH 构造。纯函数，便于单测。

export interface RangeInput { min: number; max: number; unit: string }
export interface SpecInput { label: string; value: string }
export interface ImageInput { url: string; alt?: string }
export interface MaterialInput { part: string; material: string }
export interface VariantsInput { variants: string[]; rows: { param: string; values: string[] }[] }

export const PRODUCT_UNITS = ["gf·cm", "kgf·cm", "N·m", "N"] as const;

export function slugFromModel(model: string): string {
  return String(model ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "product";
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

export function isValidProductPath(path: string): boolean {
  if (!path.startsWith("/") || path.endsWith("/")) return false;
  if (!path.endsWith(".html")) return false;
  if (path.includes("?") || path.includes("#") || path.includes("//") || path.includes("..")) return false;
  return path.length >= 6;
}

export function assertLocalImage(url: unknown, field: string): string | null {
  if (url === null || url === undefined || url === "") return null;
  if (typeof url !== "string" || !url.startsWith("/")) return `${field} 必须是本地路径（以 / 开头）`;
  if (url.includes("..")) return `${field} 不能包含 ..`;
  return null;
}

export function normalizeRange(value: unknown, field: string): { value: RangeInput | null; error?: string } {
  if (value === null || value === undefined) return { value: null };
  if (typeof value !== "object") return { value: null, error: `${field} 格式不正确` };
  const range = value as Record<string, unknown>;
  const min = Number(range.min);
  const max = Number(range.max);
  const unit = String(range.unit ?? "");
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { value: null, error: `${field} 的 min/max 必须是数字` };
  if (min > max) return { value: null, error: `${field} 的 min 不能大于 max` };
  if (!PRODUCT_UNITS.includes(unit as typeof PRODUCT_UNITS[number])) return { value: null, error: `${field} 单位不支持` };
  return { value: { min, max, unit } };
}

function normalizeArray<T>(value: unknown, field: string, validate: (item: unknown) => string | null): { value: T[]; error?: string } {
  if (!Array.isArray(value)) return { value: [], error: `${field} 必须是数组` };
  for (const item of value) {
    const error = validate(item);
    if (error) return { value: [], error };
  }
  return { value: value as T[] };
}

function normalizeImages(value: unknown): { value: ImageInput[]; error?: string } {
  return normalizeArray<ImageInput>(value, "产品相册", item => {
    if (!item || typeof item !== "object") return "产品相册项目格式不正确";
    const url = (item as ImageInput).url;
    return assertLocalImage(url, "产品相册图片");
  });
}

function normalizeSpecs(value: unknown): { value: SpecInput[]; error?: string } {
  return normalizeArray<SpecInput>(value, "规格参数", item => {
    if (!item || typeof item !== "object") return "规格参数项目格式不正确";
    const spec = item as SpecInput;
    if (!spec.label || !spec.value) return "规格参数的 label/value 不能为空";
    return null;
  });
}

function normalizeMaterials(value: unknown): { value: MaterialInput[]; error?: string } {
  return normalizeArray<MaterialInput>(value, "材料", item => {
    if (!item || typeof item !== "object") return "材料项目格式不正确";
    const material = item as MaterialInput;
    return material.part && material.material ? null : "材料的 part/material 不能为空";
  });
}

function normalizeStrings(value: unknown, field: string): { value: string[]; error?: string } {
  return normalizeArray<string>(value, field, item => typeof item === "string" ? null : `${field} 必须都是字符串`);
}

function normalizeScenarios(value: unknown): { value: { image: string; label: string }[]; error?: string } {
  return normalizeArray<{ image: string; label: string }>(value, "应用场景", item => {
    if (!item || typeof item !== "object") return "应用场景项目格式不正确";
    const scenario = item as { image: string; label: string };
    return assertLocalImage(scenario.image, "应用场景图片") ?? (scenario.label ? null : "应用场景 label 不能为空");
  });
}

function normalizeVariants(value: unknown): { value: VariantsInput | null; error?: string } {
  if (value === null || value === undefined) return { value: null };
  if (typeof value !== "object") return { value: null, error: "型号对比格式不正确" };
  const variants = value as VariantsInput;
  if (!Array.isArray(variants.variants) || !Array.isArray(variants.rows)) return { value: null, error: "型号对比格式不正确" };
  for (const row of variants.rows) {
    if (!row || !row.param || !Array.isArray(row.values) || row.values.length !== variants.variants.length) {
      return { value: null, error: "型号对比每行的数值数量必须等于型号数量" };
    }
  }
  return { value: { variants: variants.variants, rows: variants.rows } };
}

function normalizeDuration(value: unknown): { value: { cycles?: number; temperature?: string; test_method?: string } | null; error?: string } {
  if (value === null || value === undefined) return { value: null };
  if (typeof value !== "object") return { value: null, error: "耐久性格式不正确" };
  const duration = value as { cycles?: unknown; temperature?: unknown; test_method?: unknown };
  const cycles = duration.cycles === undefined || duration.cycles === null || duration.cycles === "" ? undefined : Number(duration.cycles);
  if (cycles !== undefined && (!Number.isInteger(cycles) || cycles < 0)) return { value: null, error: "耐久循环次数必须是非负整数" };
  return {
    value: {
      ...(cycles !== undefined ? { cycles } : {}),
      ...(typeof duration.temperature === "string" ? { temperature: duration.temperature } : {}),
      ...(typeof duration.test_method === "string" ? { test_method: duration.test_method } : {}),
    },
  };
}

export type ProductPatch = Record<string, unknown>;

/** 只处理请求里出现的字段；绝不把未提交字段重置为空。 */
export function buildProductPatch(body: Record<string, unknown>, existingPath?: string): { patch: ProductPatch; error?: string } {
  const patch: ProductPatch = {};
  const setString = (key: string, required = false) => {
    if (!(key in body)) return;
    const value = body[key];
    if (value === null || value === undefined) { patch[key] = ""; return; }
    if (typeof value !== "string") { patch[key] = String(value); return; }
    const trimmed = value.trim();
    if (required && !trimmed) throw new Error(`${key} 不能为空`);
    patch[key] = trimmed;
  };

  try {
    setString("slug", true);
    setString("path", true);
    setString("model", true);
    setString("name", true);
    setString("listingTitle");
    setString("category", true);
    setString("summary", true);
    setString("description");
    setString("image", true);
    setString("hardTorque");
    setString("hardForce");
    setString("soundType");
    setString("bufferDirection");
    setString("assemblyMethod");
    setString("dimensionDrawing");
    setString("seoTitle");
    setString("seoDescription");
  } catch (error) {
    return { patch, error: error instanceof Error ? error.message : "字段校验失败" };
  }

  if ("slug" in patch && !isValidSlug(String(patch.slug))) return { patch, error: "slug 只能包含小写字母、数字和连字符" };
  if ("path" in patch) {
    const path = String(patch.path);
    if (!isValidProductPath(path)) return { patch, error: "历史路径必须以 / 开头、以 .html 结尾，且不能包含 ? # // .." };
    if (existingPath && path !== existingPath) return { patch, error: "已有商品的历史路径不可修改" };
  }
  if ("image" in patch) {
    const error = assertLocalImage(patch.image, "列表主图");
    if (error) return { patch, error };
  }
  if ("dimensionDrawing" in patch) {
    const error = assertLocalImage(patch.dimensionDrawing, "尺寸图");
    if (error) return { patch, error };
  }

  if ("images" in body) {
    const { value, error } = normalizeImages(body.images);
    if (error) return { patch, error };
    patch.images = value;
  }
  if ("specifications" in body) {
    const { value, error } = normalizeSpecs(body.specifications);
    if (error) return { patch, error };
    patch.specifications = value;
  }
  if ("materials" in body) {
    const { value, error } = normalizeMaterials(body.materials);
    if (error) return { patch, error };
    patch.materials = value;
  }
  if ("characteristics" in body) {
    const { value, error } = normalizeStrings(body.characteristics, "产品特性");
    if (error) return { patch, error };
    patch.characteristics = value;
  }
  if ("applications" in body) {
    const { value, error } = normalizeStrings(body.applications, "应用领域");
    if (error) return { patch, error };
    patch.applications = value;
  }
  if ("tags" in body) {
    const { value, error } = normalizeStrings(body.tags, "标签");
    if (error) return { patch, error };
    patch.tags = value;
  }
  if ("applicationScenarios" in body) {
    const { value, error } = normalizeScenarios(body.applicationScenarios);
    if (error) return { patch, error };
    patch.applicationScenarios = value;
  }
  if ("torque" in body) {
    const { value, error } = normalizeRange(body.torque, "可调扭矩");
    if (error) return { patch, error };
    patch.torque = value;
  }
  if ("force" in body) {
    const { value, error } = normalizeRange(body.force, "操作力");
    if (error) return { patch, error };
    patch.force = value;
  }
  if ("durability" in body) {
    const { value, error } = normalizeDuration(body.durability);
    if (error) return { patch, error };
    patch.durability = value;
  }
  if ("variants" in body) {
    const { value, error } = normalizeVariants(body.variants);
    if (error) return { patch, error };
    patch.variants = value;
  }
  if ("performanceCharts" in body) {
    const value = body.performanceCharts;
    if (value === null || value === undefined) patch.performanceCharts = null;
    else if (typeof value !== "object") return { patch, error: "性能曲线格式不正确" };
    else {
      const charts = value as Record<string, unknown>;
      const rotation = charts.rotation === null || charts.rotation === undefined || charts.rotation === "" ? null : String(charts.rotation);
      const temperature = charts.temperature === null || charts.temperature === undefined || charts.temperature === "" ? null : String(charts.temperature);
      const imageError = assertLocalImage(rotation, "旋转曲线") ?? assertLocalImage(temperature, "温度曲线");
      if (imageError) return { patch, error: imageError };
      patch.performanceCharts = { rotation, temperature };
    }
  }
  if ("isActive" in body) {
    patch.isActive = body.isActive ? 1 : 0;
    patch.status = body.isActive ? "active" : "inactive";
  }
  if ("sortOrder" in body) {
    const sortOrder = Number(body.sortOrder);
    if (!Number.isInteger(sortOrder)) return { patch, error: "排序必须是整数" };
    patch.sortOrder = sortOrder;
  }

  return { patch };
}

export function validateProductCreate(patch: ProductPatch): string | null {
  const labels: Record<string, string> = {
    slug: "Slug",
    path: "历史路径",
    model: "型号",
    name: "产品名称",
    category: "分类",
    summary: "摘要",
    image: "列表主图",
  };
  for (const field of ["slug", "path", "model", "name", "category", "summary", "image"]) {
    if (!patch[field]) return `请填写${labels[field] ?? field}`;
  }
  return null;
}
