import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { contact, telHref } from "@/content/live-site/contact";

// 高德地图「分享 → 嵌入地图 → 地点模式」生成,免 Key。POI ID: B0LGOC7Y8N
const AMAP_EMBED_SRC =
  "https://www.amap.com/ssr/embed/place?id=B0LGOC7Y8N&name=%E4%B8%9C%E8%8E%9E%E5%B8%82%E7%89%B9%E6%BE%B3%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&lng=113.996607&lat=22.881794&address=%E9%BB%84%E6%B1%9F%E9%95%87%E9%BB%84%E6%B1%9F%E5%8C%97%E4%B8%89%E8%A1%972%E5%8F%B7&zoom=16&source=poi_detail&platform=pc";
const AMAP_PLACE_URL = `https://uri.amap.com/marker?position=113.996607,22.881794&name=${encodeURIComponent("东莞市特澳电子科技有限公司")}&src=teao&coordinate=gaode&callnative=0`;

const productTypes = [
  "齿轮阻尼器",
  "轴向阻尼器",
  "手套箱阻尼器",
  "锁扣",
  "定制零部件",
  "不确定 / 需要推荐",
];

const contactItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: `主要联系人 · ${contact.primaryName}`,
    value: contact.primaryMobile,
    href: telHref(contact.primaryMobile),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    label: "备用手机",
    value: contact.secondaryMobile,
    href: telHref(contact.secondaryMobile),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "业务热线",
    value: contact.phone,
    href: telHref(contact.phone),
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "邮箱",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "地址",
    value: contact.address,
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-white border-b border-line">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] py-16">
          <SectionHead
            eyebrow="联系我们"
            title={
              <>
                联系销售工程团队
                <b className="font-black text-brand-700">获取专业选型建议</b>
              </>
            }
            description="无论您是标准品选型还是非标定制需求，提交图纸、样品信息或应用场景描述，工程师将在 2 小时内响应。"
          />
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_440px]">
            {/* ── Left: Contact Info ── */}
            <div>
              <Reveal>
                <h1 className="text-[32px] font-bold leading-[1.25] tracking-[-0.01em] text-ink">
                  联系我们
                </h1>
                <p className="mt-4 max-w-[580px] text-[15px] leading-[1.8] text-muted">
                  特澳 TEAO 专注阻尼器与锁扣机构研发制造 20
                  余年，产品广泛应用于汽车、家电、卫浴、医疗、工业等多个领域。无论您是主机厂一级供应商、系统集成商还是渠道合作伙伴，我们的销售工程团队都将为您提供快速、专业的技术响应。
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {contactItems.map((item, i) => (
                  <Reveal key={item.label} delay={((i % 2) + 1) as 1 | 2}>
                    <ContactCard item={item} />
                  </Reveal>
                ))}
              </div>

              <Reveal delay={2}>
                <div id="wechat" className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center">
                  <Image
                    src={contact.wechatQr}
                    alt={`${contact.primaryName}微信二维码`}
                    width={132}
                    height={132}
                    className="shrink-0 rounded-xl border border-line-soft bg-white p-1.5"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-700">微信咨询</p>
                    <p className="mt-2 text-xl font-black text-ink">{contact.primaryName} · 销售工程师</p>
                    <p className="mt-2 text-sm text-muted">
                      微信 <span className="font-bold text-ink-soft">{contact.wechat}</span>
                      <span className="mx-2 text-line">|</span>
                      手机 <a href={telHref(contact.primaryMobile)} className="font-bold text-ink-soft hover:text-brand-700">{contact.primaryMobile}</a>
                    </p>
                    <p className="mt-2 text-xs text-muted-light">扫码添加微信,获取选型建议与报价。</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── Right: Inquiry Form Card ── */}
            <Reveal delay={1}>
              <div className="rounded-[14px] border-t-[3px] border-brand-500 bg-white p-[30px] text-ink shadow-[0_20px_60px_rgba(0,0,0,0.08)] sticky top-28">
                <h3 className="text-center text-xl font-bold">
                  获取选型与报价建议
                </h3>
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
                    rows={3}
                    placeholder="需求描述：应用场景 / 扭矩要求 / 年用量预估"
                  />
                  <div className="col-span-1 grid min-h-[68px] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-line bg-surface py-4 text-[13px] font-semibold text-brand-700 transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 sm:col-span-2">
                    <span>
                      &#x1F4C1; 上传图纸、图片、PDF 或 CAD 文件（可选）
                    </span>
                  </div>
                  <button
                    type="button"
                    className="col-span-1 mt-1.5 cursor-pointer rounded-lg bg-brand-500 px-[14px] py-3.5 text-[14.5px] font-bold tracking-[0.03em] text-white shadow-[0_4px_16px_rgba(232,120,26,0.18)] transition-all duration-[250ms] ease-out hover:bg-brand-700 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(232,120,26,0.28)] sm:col-span-2"
                  >
                    提交需求，获取选型方案 &rarr;
                  </button>
                </div>
                <p className="mt-2.5 text-[11px] leading-[1.5] text-muted-light">
                  提交即表示同意隐私政策。我们不会将您的信息用于询盘以外的用途。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Location map */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] py-16 lg:py-20">
          <SectionHead
            eyebrow="公司位置"
            title="到访特澳"
            description="广东省东莞市黄江镇黄江北三街2号。来访前请提前联系销售团队,以便安排接待与产线参观。"
          />
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
              <iframe
                src={AMAP_EMBED_SRC}
                title="东莞市特澳电子科技有限公司位置地图"
                className="block h-[320px] w-full border-0 sm:h-[420px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Reveal>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">广东省东莞市黄江镇黄江北三街2号</p>
            <a
              href={AMAP_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink-soft transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
            >
              在高德地图中查看 →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  item,
}: {
  item: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string | null;
  };
}) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink">{item.label}</p>
        <p className="mt-0.5 text-[14px] leading-[1.5] text-muted break-all">
          {item.value}
        </p>
      </div>
    </>
  );

  const cardClasses =
    "flex items-start gap-3.5 rounded-[12px] border border-line-soft bg-white p-5 transition-all duration-[250ms] hover:border-brand-500/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]";

  if (item.href) {
    return (
      <a
        href={item.href}
        className={`${cardClasses} group cursor-pointer`}
        rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {content}
      </a>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
