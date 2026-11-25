import { revalidatePath } from "next/cache";

/** 商品/分类写入后刷新受影响的公开路由。 */
export function revalidateCatalog(paths: string[] = [], layout = false) {
  if (layout) revalidatePath("/", "layout");
  const targets = new Set(["/", "/products", "/sitemap", "/sitemap.xml", "/llms.txt", ...paths]);
  for (const path of targets) {
    try { revalidatePath(path); } catch { /* 非页面路径忽略 */ }
  }
}
