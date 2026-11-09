import { Reveal } from "@/components/ui/reveal";

const ctaBenefits = [
  { text: "✓ 提交图纸获取选型建议" },
  { text: "✓ 发送样品信息安排打样" },
  { text: "✓ 描述应用场景获取方案" },
];

const productTypes = [
  "齿轮阻尼器",
  "轴向阻尼器",
  "手套箱阻尼器",
  "锁扣",
  "定制零部件",
  "不确定 / 需要推荐",
];

export function CTASection() {
  return (
    <section
      className="section relative overflow-hidden py-20 text-white"
      id="contact"
      style={{
        background:
          "linear-gradient(105deg, rgba(26,26,30,0.96) 0%, rgba(26,26,30,0.88) 55%, rgba(26,26,30,0.78) 100%), url('/images/company/automation-workshop.webp') center/cover no-repeat",
      }}
    >
      {/* Orange radial glow overlay */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,120,26,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-[1] mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_420px]">
          {/* ── Left: inquiry benefits ── */}
          <div className="cta-left">
            <Reveal>
              <p className="mb-2 inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] uppercase text-brand-500
                before:content-[''] before:block before:w-[22px] before:h-[2px] before:bg-brand-500 before:rounded">
                快速询盘
              </p>
              <h2 className="max-w-[620px] text-[36px] font-bold leading-[1.22] tracking-[-0.01em]">
                发图纸或描述需求<br />
                <b className="font-black text-brand-500">我们先帮你判断结构和扭矩方向</b>
              </h2>
              <p className="mt-4 max-w-[620px] text-[14.5px] leading-[1.8] text-white/60">
                无论是标准品选型还是非标定制，提交以下任一信息即可启动工程师评估流程。也可直接电话、微信或邮件联系销售工程师。
              </p>
            </Reveal>

            <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {ctaBenefits.map((benefit) => (
                <Reveal key={benefit.text}>
                  <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-4 text-[13px] font-semibold transition-all duration-[250ms] hover:border-brand-500/30 hover:bg-brand-500/6">
                    {benefit.text}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ── Right: contact form card ── */}
          <Reveal delay={1}>
            <div className="rounded-[14px] border-t-[3px] border-brand-500 bg-white p-[30px] text-ink shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <h3 className="text-center text-xl font-bold">获取选型与报价建议</h3>
              <p className="mt-1 mb-5 text-center text-[12.5px] text-muted">
                工程师将在 2 小时内响应
              </p>

              <div className="grid grid-cols-1 gap-[9px] sm:grid-cols-2">
                <input
                  className="rounded-lg border-[1.5px] border-line bg-surface px-[14px] py-3 text-[13.5px] font-medium text-ink transition-all duration-200 ease-out placeholder:text-muted-light focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)]"
                  type="text"
                  placeholder="您的姓名 *"
                />
                <input
                  className="rounded-lg border-[1.5px] border-line bg-surface px-[14px] py-3 text-[13.5px] font-medium text-ink transition-all duration-200 ease-out placeholder:text-muted-light focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)]"
                  type="text"
                  placeholder="公司名称 *"
                />
                <input
                  className="rounded-lg border-[1.5px] border-line bg-surface px-[14px] py-3 text-[13.5px] font-medium text-ink transition-all duration-200 ease-out placeholder:text-muted-light focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)]"
                  type="tel"
                  placeholder="手机号码 *"
                />
                <select
                  className="rounded-lg border-[1.5px] border-line bg-surface px-[14px] py-3 text-[13.5px] font-medium text-ink transition-all duration-200 ease-out focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    选择产品类型 *
                  </option>
                  {productTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
                <textarea
                  className="col-span-1 rounded-lg border-[1.5px] border-line bg-surface px-[14px] py-3 text-[13.5px] font-medium text-ink transition-all duration-200 ease-out placeholder:text-muted-light focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(232,120,26,0.08)] sm:col-span-2"
                  rows={2}
                  placeholder="应用场景 / 目标扭矩 / 年用量预估"
                />
                <div className="col-span-1 grid min-h-[68px] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-[#D1D1D6] bg-[#FAFAFB] text-[13px] font-semibold text-brand-700 transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 sm:col-span-2">
                  📁 上传图纸、图片、PDF 或 CAD 文件（可选）
                </div>
                <button
                  type="button"
                  className="col-span-1 mt-1.5 cursor-pointer rounded-lg bg-brand-500 px-[14px] py-3.5 text-[14.5px] font-bold tracking-[0.03em] text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] transition-all duration-[250ms] ease-out hover:bg-brand-700 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] sm:col-span-2"
                >
                  提交需求，获取选型方案 &rarr;
                </button>
              </div>
              <p className="mt-2.5 text-[11px] leading-[1.5] text-muted-light">
                提交即表示同意隐私政策。具体字段、文件大小限制和通知方式待最终确认后配置。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
