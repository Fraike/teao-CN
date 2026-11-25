import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

export type InquiryStatus = "new" | "contacted" | "closed";
export const INQUIRY_STATUSES: InquiryStatus[] = ["new", "contacted", "closed"];

export interface InquiryInput {
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  productInterest: string | null;
  annualVolume: string | null;
  message: string;
  ip: string;
  submittedAt: string;
}

export async function saveInquiry(input: InquiryInput) {
  const [row] = await db.insert(inquiries).values({
    ...input,
    status: "new",
  }).returning({ id: inquiries.id });
  return row.id;
}

export async function listInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.submittedAt), desc(inquiries.id));
}

export async function updateInquiryStatus(id: number, status: InquiryStatus) {
  await db.update(inquiries).set({ status, updatedAt: new Date() }).where(eq(inquiries.id, id));
}

export async function deleteInquiry(id: number) {
  await db.delete(inquiries).where(eq(inquiries.id, id));
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && INQUIRY_STATUSES.includes(value as InquiryStatus);
}

export function inquiryStatusLabel(status: string) {
  if (status === "contacted") return "已联系";
  if (status === "closed") return "已关闭";
  return "新询盘";
}
