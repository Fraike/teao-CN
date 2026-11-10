"use client";

import { useCallback, useRef, useState } from "react";
import { Captcha, type CaptchaRef } from "@/components/ui/captcha";

const productTypes = ["齿轮阻尼器", "圆筒阻尼器", "手套箱阻尼器", "锁扣", "定制零部件", "不确定 / 需要推荐"];

const initialForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  productInterest: "",
  annualVolume: "",
  message: "",
  privacyAccepted: false,
  website: "",
};

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink-soft transition-all placeholder:text-muted-light focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10";

export default function ContactForm() {
  const captchaRef = useRef<CaptchaRef>(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm(prev => ({ ...prev, [target.name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setErrorMsg("");

      if (!form.privacyAccepted) {
        setStatus("error");
        setErrorMsg("请先阅读并同意隐私说明。");
        return;
      }
      if (!captchaRef.current?.validate()) {
        setStatus("error");
        setErrorMsg("验证码不正确,请重新输入。");
        return;
      }

      setStatus("submitting");
      try {
        const payload = captchaRef.current?.getPayload();
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, captchaToken: payload?.token, captchaAnswer: payload?.answer }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || "提交失败,请稍后重试。");
        }

        setStatus("success");
        setForm(initialForm);
        captchaRef.current?.reset();
      } catch (error) {
        setStatus("error");
        setErrorMsg(error instanceof Error ? error.message : "提交失败,请稍后重试。");
        captchaRef.current?.reset();
      }
    },
    [form]
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-500/20 bg-brand-50/60 p-8 text-center">
        <h3 className="text-xl font-black text-ink">询盘已提交</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">感谢您的需求,销售工程师会在 24 小时内与您联系。</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-5 text-sm font-bold text-brand-700 hover:underline">
          再提交一条询盘
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">姓名 *</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">公司名称</label>
          <input type="text" name="company" value={form.company} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">手机号码 *</label>
          <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">邮箱</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className={fieldClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">产品类型</label>
          <select name="productInterest" value={form.productInterest} onChange={handleChange} className={fieldClass}>
            <option value="">请选择产品…</option>
            {productTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">预估年用量</label>
          <input type="text" name="annualVolume" value={form.annualVolume} onChange={handleChange} placeholder="例如 5 万件 / 年" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-bold text-ink">需求描述 *</label>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="应用场景 / 目标扭矩或阻力 / 安装空间 / 工作温度…"
          className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink-soft transition-all placeholder:text-muted-light focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
        </label>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-surface-warm p-4">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            checked={form.privacyAccepted}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand-500 focus:ring-brand-500"
          />
          <span>我已阅读并同意隐私说明,所填信息仅用于本次询盘沟通。</span>
        </label>
        <Captcha ref={captchaRef} />
      </div>

      {status === "error" && <p className="text-sm font-medium text-red-600">{errorMsg || "提交失败,请稍后重试。"}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-brand-500 px-8 text-base font-bold text-white shadow-[0_14px_30px_rgba(232,120,26,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-700 disabled:translate-y-0 disabled:opacity-50"
      >
        {status === "submitting" ? "提交中…" : "提交需求,获取选型方案 →"}
      </button>
    </form>
  );
}
