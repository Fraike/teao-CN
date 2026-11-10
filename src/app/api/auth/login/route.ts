import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { createToken, setSession, verifyPassword } from "@/lib/auth";

const attempts = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "尝试次数过多,请稍后再试。" }, { status: 429 });
  }

  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    return NextResponse.json({ error: "请输入账号和密码。" }, { status: 400 });
  }

  const admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1).then(rows => rows[0]);
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json({ error: "账号或密码不正确。" }, { status: 401 });
  }

  await setSession(await createToken(admin.username));
  return NextResponse.json({ success: true });
}
