import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { deleteInquiry, isInquiryStatus, updateInquiryStatus } from "@/lib/inquiry-store";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的询盘 ID" }, { status: 400 });

  const body = await request.json().catch(() => ({})) as { status?: unknown };
  if (!isInquiryStatus(body.status)) return NextResponse.json({ error: "无效的状态" }, { status: 400 });

  await updateInquiryStatus(id, body.status);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "无效的询盘 ID" }, { status: 400 });

  await deleteInquiry(id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}
