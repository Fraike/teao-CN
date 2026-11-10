import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择图片" }, { status: 400 });
  }
  const extension = ALLOWED.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "仅支持 jpg / png / webp / gif" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "图片不能超过 5MB" }, { status: 400 });
  }

  const now = new Date();
  const folder = `news/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const targetDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(targetDir, { recursive: true });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  await writeFile(join(targetDir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${folder}/${name}` }, { status: 201 });
}
