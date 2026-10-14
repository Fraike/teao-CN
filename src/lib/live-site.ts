import categoryRoutes from "@/content/live-site/category-routes.json";

export const LIVE_ORIGIN = "https://www.chinateao.com";
export const PILOT_PRODUCT_PATH = "/gear-damper/gear-rotary-damper-rd-t038-v038.html";
export const QUALITY_PATH = "/quality-control/";
export const FAQ_PATH = "/faq/";
export const liveCategories = categoryRoutes;

export function developmentCategoryPath(id: string): string | null {
  return liveCategories.find(category => category.id === (id === "custom" ? "other" : id))?.path ?? null;
}

/** Metadata can receive encoded segments while the page receives decoded ones. */
export function legacyPathFromSegments(segments: readonly string[]): string {
  return "/" + segments.map(segment => {
    try {
      const decoded = decodeURIComponent(segment);
      return decoded.includes("/") || decoded.includes("\\") ? segment : decoded;
    } catch { return segment; }
  }).join("/");
}
export function getPilotPage(segments: readonly string[]): "category" | "product" | "quality" | "faq" | null {
  const path = legacyPathFromSegments(segments);
  if (liveCategories.some(category => path + "/" === category.path)) return "category";
  if (liveCategories.some(category => Array.from({ length: category.pageCount - 1 }, (_, index) => category.path + `index_${index + 2}.html`).includes(path))) return "category";
  if (path === PILOT_PRODUCT_PATH) return "product";
  if (path + "/" === QUALITY_PATH) return "quality";
  if (path + "/" === FAQ_PATH) return "faq";
  return null;
}

/** During the pilot, unported pages continue to open at their exact live URL. */
export function liveHref(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Expected a site-relative path");
  const pathname = path.split(/[?#]/)[0];
  if (pathname === "/" || pathname === "/products/" || getPilotPage(pathname.split("/").filter(Boolean))) return path;
  return LIVE_ORIGIN + path;
}

export interface LiveNavItem { label: string; path: string; children?: LiveNavItem[] }
export const liveNavigation: LiveNavItem[] = [
  { label: "首页", path: "/" },
  { label: "产品", path: "/products/", children: liveCategories },
  { label: "应用案例", path: "/applications/", children: [
    { label: "汽车内外饰", path: "/applications/automotive-interior/", children: [
      { label: "内饰", path: "/applications/automotive-interior/internal/" },
      { label: "外饰", path: "/applications/automotive-interior/external/" },
    ] },
    { label: "家居", path: "/applications/home-life/" },
    { label: "办公设备", path: "/applications/office-equipment/" },
    { label: "工业设备", path: "/applications/industrial-application/" },
  ] },
  { label: "质量控制", path: "/quality-control/" },
  { label: "支持", path: "/support/", children: [
    { label: "下载", path: "/brochures/", children: [
      { label: "齿轮阻尼器", path: "/gear-damper-china/" },
      { label: "圆筒阻尼器", path: "/axial-damper-china/" },
      { label: "空气阻尼器", path: "/air-damper-china/" },
      { label: "线性阻尼器", path: "/liner-damper-china/" },
      { label: "汽车杂物箱锁机构", path: "/organizer-china/" },
      { label: "锁扣", path: "/latch-china/" },
    ] },
    { label: "新闻", path: "/news/" },
    { label: "常见问题", path: "/faq/" },
  ] },
  { label: "关于我们", path: "/about-us/" },
  { label: "联系我们", path: "/contacts/" },
];
