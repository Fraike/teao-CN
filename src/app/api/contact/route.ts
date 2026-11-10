import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

async function persist(inquiry: Record<string, unknown>) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    return;
  }

  // 本地开发兜底:写入 .data/inquiries.jsonl(该目录已被 git 忽略)
  const dir = join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(join(dir, "inquiries.jsonl"), JSON.stringify(inquiry) + "\n", "utf8");
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "提交过于频繁,请稍后再试。" }, { status: 429 });
    }

    const body = await request.json();
    const {
      name,
      company,
      phone,
      email,
      productInterest,
      annualVolume,
      message,
      privacyAccepted,
      captchaToken,
      captchaAnswer,
      website,
    } = body ?? {};

    if (website) {
      return NextResponse.json({ error: "提交被拒绝。" }, { status: 400 });
    }
    if (!name || !phone || !message) {
      return NextResponse.json({ error: "请填写姓名、手机号码和需求描述。" }, { status: 400 });
    }
    if (privacyAccepted !== true) {
      return NextResponse.json({ error: "请先同意隐私说明。" }, { status: 400 });
    }
    if (
      !captchaToken ||
      !captchaAnswer ||
      btoa(String(captchaAnswer).toUpperCase()) !== captchaToken
    ) {
      return NextResponse.json({ error: "验证码不正确。" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "邮箱格式不正确。" }, { status: 400 });
    }

    try {
      await persist({
        name,
        company: company || null,
        phone,
        email: email || null,
        productInterest: productInterest || null,
        annualVolume: annualVolume || null,
        message,
        submittedAt: new Date().toISOString(),
        ip,
      });
    } catch (error) {
      console.error("Inquiry persistence failed:", error);
      return NextResponse.json(
        { error: "在线表单暂未接通,请直接电话或微信联系罗小姐。" },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    return NextResponse.json({ error: "提交失败,请稍后重试。" }, { status: 500 });
  }
}
