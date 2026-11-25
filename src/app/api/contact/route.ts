import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { saveInquiry, type InquiryInput } from "@/lib/inquiry-store";

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

async function notifyInquiry(inquiry: InquiryInput) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return;

  const content = [
    "【特澳官网新询盘】",
    `姓名：${inquiry.name}`,
    `公司：${inquiry.company || "—"}`,
    `电话：${inquiry.phone}`,
    `邮箱：${inquiry.email || "—"}`,
    `产品：${inquiry.productInterest || "—"}`,
    `年用量：${inquiry.annualVolume || "—"}`,
    `需求：${inquiry.message}`,
    `时间：${inquiry.submittedAt}`,
    "后台：https://www.chinateao.com/admin/inquiries",
  ].join("\n");

  const payload = process.env.CONTACT_WEBHOOK_TYPE === "wecom"
    ? { msgtype: "text", text: { content } }
    : inquiry;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) console.warn("[inquiry-webhook] failed", response.status);
  } catch (error) {
    console.warn("[inquiry-webhook] request failed", error instanceof Error ? error.message : error);
  }
}

async function persist(inquiry: InquiryInput) {
  try {
    await saveInquiry(inquiry);
  } catch (error) {
    // 数据库失败时保留文件兜底，避免线索直接丢失
    console.error("Inquiry DB save failed, falling back to file:", error);
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, "inquiries.jsonl"), JSON.stringify(inquiry) + "\n", "utf8");
  }

  // 通知不阻塞提交；没有配置 webhook 时只进后台询盘列表
  void notifyInquiry(inquiry).catch(() => {});
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
