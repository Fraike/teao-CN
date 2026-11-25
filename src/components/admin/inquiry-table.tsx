"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, Phone, Trash2 } from "lucide-react";

type Status = "new" | "contacted" | "closed";

export interface InquiryRow {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  productInterest: string | null;
  annualVolume: string | null;
  message: string;
  status: string;
  submittedAt: string;
}

const STATUS_LABELS: Record<Status, string> = {
  new: "新询盘",
  contacted: "已联系",
  closed: "已关闭",
};

function statusClass(status: string) {
  if (status === "contacted") return "bg-blue-50 text-blue-700";
  if (status === "closed") return "bg-surface text-muted";
  return "bg-brand-50 text-brand-700";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("zh-CN");
}

function csv(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function InquiryTable({ rows }: { rows: InquiryRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => rows.filter(row => {
    if (statusFilter && row.status !== statusFilter) return false;
    if (!search) return true;
    return [row.name, row.company, row.phone, row.email, row.message].join(" ").toLowerCase().includes(search.toLowerCase());
  }), [rows, search, statusFilter]);

  async function updateStatus(id: number, status: Status) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "更新失败");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失败");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("确认删除这条询盘？")) return;
    setBusy(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setBusy(null);
    }
  }

  function exportCsv() {
    const header = ["提交时间", "姓名", "公司", "电话", "邮箱", "感兴趣的产品", "年用量", "需求", "状态"];
    const lines = filtered.map(row => [
      formatDate(row.submittedAt),
      row.name,
      row.company,
      row.phone,
      row.email,
      row.productInterest,
      row.annualVolume,
      row.message,
      STATUS_LABELS[row.status as Status] ?? row.status,
    ].map(csv).join(","));
    const blob = new Blob(["﻿" + [header.map(csv).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const field = "h-9 rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-500";

  return (
    <div>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</div>}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${field} w-64`} placeholder="搜索姓名、公司、电话或需求…" value={search} onChange={event => setSearch(event.target.value)} />
        <select className={field} value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
          <option value="">全部状态</option>
          <option value="new">新询盘</option>
          <option value="contacted">已联系</option>
          <option value="closed">已关闭</option>
        </select>
        <button type="button" onClick={exportCsv} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-bold text-ink-soft hover:border-brand-500">
          <Download size={13} /> 导出 CSV
        </button>
        <span className="ml-auto text-xs text-muted">显示 {filtered.length} / {rows.length} 条</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-white py-16 text-center text-sm text-muted">暂无询盘。</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(row => (
            <article key={row.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-ink">{row.name}</h3>
                    {row.company && <span className="text-xs text-muted">{row.company}</span>}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(row.status)}`}>
                      {STATUS_LABELS[row.status as Status] ?? row.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-light">{formatDate(row.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={row.status}
                    disabled={busy === row.id}
                    onChange={event => void updateStatus(row.id, event.target.value as Status)}
                    className="h-8 rounded-lg border border-line bg-white px-2 text-xs font-bold text-ink-soft outline-none focus:border-brand-500"
                  >
                    <option value="new">新询盘</option>
                    <option value="contacted">已联系</option>
                    <option value="closed">已关闭</option>
                  </select>
                  <button type="button" onClick={() => void remove(row.id)} disabled={busy === row.id} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-300 hover:text-red-600 disabled:opacity-50" aria-label="删除询盘">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-soft">
                <a href={`tel:${row.phone}`} className="inline-flex items-center gap-1.5 hover:text-brand-700"><Phone size={12} /> {row.phone}</a>
                {row.email && <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1.5 hover:text-brand-700"><Mail size={12} /> {row.email}</a>}
                {row.productInterest && <span>产品：{row.productInterest}</span>}
                {row.annualVolume && <span>年用量：{row.annualVolume}</span>}
              </div>

              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-surface px-3 py-2 text-sm leading-relaxed text-ink-soft">{row.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
