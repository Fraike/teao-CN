import { listInquiries } from "@/lib/inquiry-store";
import InquiryTable, { type InquiryRow } from "@/components/admin/inquiry-table";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  let rows: InquiryRow[] = [];
  try {
    const data = await listInquiries();
    rows = data.map(row => ({
      id: row.id,
      name: row.name,
      company: row.company,
      phone: row.phone,
      email: row.email,
      productInterest: row.productInterest,
      annualVolume: row.annualVolume,
      message: row.message,
      status: row.status,
      submittedAt: row.submittedAt,
    }));
  } catch (error) {
    console.error("加载询盘失败:", error);
  }

  const newCount = rows.filter(row => row.status === "new").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-ink">询盘管理</h1>
          <p className="mt-1 text-sm text-muted">官网表单提交的客户询盘。当前新询盘 {newCount} 条。</p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">共 {rows.length} 条</span>
      </div>
      <InquiryTable rows={rows} />
    </div>
  );
}
