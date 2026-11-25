// 分类后台校验与 PATCH 构造。

const RESERVED_PATHS = new Set([
  "/products/",
  "/news/",
  "/applications/",
  "/quality-control/",
  "/faq/",
  "/about-us/",
  "/contacts/",
  "/convert/",
  "/sitemap/",
  "/admin/",
  "/api/",
]);

export interface CategoryPatch { [key: string]: unknown }

export function isValidCategoryPath(path: string): boolean {
  if (!path.startsWith("/") || !path.endsWith("/") || path === "/") return false;
  if (path.includes("?") || path.includes("#") || path.includes("//") || path.includes("..")) return false;
  return true;
}

export function isValidCategorySlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

export function buildCategoryPatch(
  body: Record<string, unknown>,
  existing?: { path?: string; slug?: string; pageSize?: number },
): { patch: CategoryPatch; error?: string } {
  const patch: CategoryPatch = {};
  const setString = (key: string, required = false) => {
    if (!(key in body)) return;
    const value = body[key];
    const text = value === null || value === undefined ? "" : String(value).trim();
    if (required && !text) throw new Error(`${key} 不能为空`);
    patch[key] = text;
  };

  try {
    setString("name", true);
    setString("slug", true);
    setString("path", true);
    setString("description", true);
    setString("image", true);
  } catch (error) {
    return { patch, error: error instanceof Error ? error.message : "字段校验失败" };
  }

  if ("slug" in patch) {
    const slug = String(patch.slug);
    if (!isValidCategorySlug(slug)) return { patch, error: "slug 只能包含小写字母、数字和连字符" };
    if (existing?.slug && slug !== existing.slug) return { patch, error: "已有分类的 slug 不可修改" };
  }
  if ("path" in patch) {
    const path = String(patch.path);
    if (!isValidCategoryPath(path)) return { patch, error: "分类路径必须以 / 开头和结尾，且不能包含 ? # // .." };
    if (RESERVED_PATHS.has(path)) return { patch, error: "该路径已被系统页面占用" };
    if (existing?.path && path !== existing.path) return { patch, error: "已有分类的路径不可修改" };
  }
  if ("image" in patch) {
    const image = String(patch.image);
    if (!image.startsWith("/") || image.includes("..")) return { patch, error: "分类图必须是本地路径" };
  }
  if ("pageSize" in body) {
    const pageSize = Number(body.pageSize);
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return { patch, error: "每页产品数必须是 1–100 的整数" };
    if (existing?.pageSize !== undefined && pageSize !== existing.pageSize) return { patch, error: "已有分类的每页产品数不可修改" };
    patch.pageSize = pageSize;
  }
  if ("sortOrder" in body) {
    const sortOrder = Number(body.sortOrder);
    if (!Number.isInteger(sortOrder)) return { patch, error: "排序必须是整数" };
    patch.sortOrder = sortOrder;
  }

  return { patch };
}

export function validateCategoryCreate(patch: CategoryPatch): string | null {
  const labels: Record<string, string> = {
    name: "分类名称",
    slug: "Slug",
    path: "分类路径",
    description: "分类描述",
    image: "分类图",
  };
  for (const field of ["name", "slug", "path", "description", "image"]) {
    if (!patch[field]) return `请填写${labels[field] ?? field}`;
  }
  return null;
}
