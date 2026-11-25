import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { revalidateCatalog } from "@/lib/content-revalidate";
import { scheduleBaiduPush } from "@/lib/baidu-push";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { ids?: unknown; action?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter(Number.isInteger) : [];
  const action = String(body.action ?? "");
  if (!ids.length) return NextResponse.json({ error: "请选择商品" }, { status: 400 });
  if (!["publish", "unpublish", "delete"].includes(action)) return NextResponse.json({ error: "无效操作" }, { status: 400 });

  const rows = await db.select().from(products).where(inArray(products.id, ids));
  if (!rows.length) return NextResponse.json({ error: "商品不存在" }, { status: 404 });

  if (action === "delete") {
    await db.delete(products).where(inArray(products.id, ids));
  } else {
    const isActive = action === "publish" ? 1 : 0;
    await db.update(products)
      .set({ isActive, status: isActive ? "active" : "inactive", updatedAt: new Date() })
      .where(inArray(products.id, ids));
  }

  const paths = rows.map(row => row.path);
  revalidateCatalog(paths, action !== "delete");
  if (action === "publish") {
    scheduleBaiduPush(rows.filter(row => !row.isActive).map(row => row.path), "push");
  } else {
    scheduleBaiduPush(paths, "delete");
  }
  return NextResponse.json({ success: true, count: rows.length });
}
