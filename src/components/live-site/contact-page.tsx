import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-head";
import { contact, telHref } from "@/content/live-site/contact";
import { container } from "./container";
import ContactForm from "./contact-form";

const AMAP_EMBED_SRC =
  "https://www.amap.com/ssr/embed/place?id=B0LGOC7Y8N&name=%E4%B8%9C%E8%8E%9E%E5%B8%82%E7%89%B9%E6%BE%B3%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&lng=113.996607&lat=22.881794&address=%E9%BB%84%E6%B1%9F%E9%95%87%E9%BB%84%E6%B1%9F%E5%8C%97%E4%B8%89%E8%A1%972%E5%8F%B7&zoom=16&source=poi_detail&platform=pc";
const AMAP_PLACE_URL = `https://uri.amap.com/marker?position=113.996607,22.881794&name=${encodeURIComponent("东莞市特澳电子科技有限公司")}&src=teao&coordinate=gaode&callnative=0`;

const heroPoints = ["24 小时内响应", "支持图纸与样品评估", "可安排打样验证"];

const steps = [
  "我们会在 24 小时内确认您的需求。",
  "工程团队评估扭矩、方向与安装空间的可行性。",
  "给出选型建议、报价与交期。",
  "必要时先打样验证,再进入量产。",
];

const contactFaq = [
  {
    q: "如何获取报价?",
    a: "填写本页表单,或直接电话/微信联系罗小姐。提供产品型号或图纸、目标扭矩、预估年用量,销售团队会给出选型建议与报价。",
  },
  {
    q: "快速报价需要提供哪些信息?",
    a: "目标扭矩(N·m 或 gf·cm)、阻尼方向(单向/双向)、安装空间与方式、工作温度、预估年用量,以及图纸或样品参考。信息越完整,报价越快。",
  },
  {
    q: "有最小起订量吗?",
    a: "标准平台产品的起订量比较灵活;需要新开模的定制项目会先做工程评审。把预估用量告诉我们,会给出可行方案。",
  },
  {
    q: "量产前可以打样吗?",
    a: "可以。特澳提供原型样与量产前样品用于装配验证。标准平台样品一般 2-3 周;定制设计需工程评审与开模周期。",
  },
  {
    q: "开模与生产周期多久?",
    a: "新开模通常 4-8 周。模具验证完成后的首批量产一般 4-6 周,复购订单因模具已就位会更快。",
  },
  {
    q: "可以按我们的扭矩要求定制吗?",
    a: "可以。扭矩调校是特澳的核心工程能力,提供目标值与公差带即可评估。",
  },
];

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "联系我们 | 特澳 TEAO",
  url: "https://www.chinateao.com/contacts/",
  mainEntity: {
    "@type": "Organization",
    name: "东莞市特澳电子科技有限公司",
    alternateName: "特澳 TEAO",
    url: "https://www.chinateao.com/",
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "广东省",
      addressLocality: "东莞市",
      streetAddress: "黄江镇黄江北三街2号",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        name: contact.primaryName,
        telephone: contact.primaryMobile,
        email: contact.email,
        areaServed: "CN",
        availableLanguage: ["zh-CN"],
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: contactFaq.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="border-b border-line bg-surface-warm">
        <div className={`${container} grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-start lg:py-20`}>
          <div>
            <span className="inline-flex items-center gap-2 text-micro font-medium uppercase tracking-[0.14em] text-brand-700 before:content-[''] before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500">
              联系我们
            </span>
            <h1 className="mt-4 max-w-[620px] text-[clamp(32px,4vw,50px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              联系销售工程团队<br />
              <span className="text-brand-700">获取专业选型建议</span>
            </h1>
            <p className="mt-4 max-w-[560px] text-body-lg leading-relaxed text-muted lg:text-body-lg">
              无论标准品选型还是非标定制,提交图纸、样品信息或应用场景描述,工程师会在 24 小时内响应。
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-caption font-semibold text-ink-soft">
              {heroPoints.map(point => (
                <span key={point} className="flex items-center gap-1.5">
                  <Check size={15} className="text-brand-700" strokeWidth={3} />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <Reveal>
            <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_16px_44px_rgba(30,30,32,0.06)] lg:p-7">
              <p className="text-micro font-medium uppercase tracking-[0.14em] text-brand-700">直接联系</p>
              <p className="mt-1.5 text-2xl font-semibold text-ink">{contact.primaryName}</p>
              <p className="text-caption font-semibold text-muted">销售工程师</p>

              <div className="mt-4 space-y-2.5">
                <a href={telHref(contact.primaryMobile)} className="flex items-center gap-3 rounded-xl border border-line bg-surface-warm px-4 py-3 transition-colors hover:border-brand-500/40 hover:bg-white">
                  <Phone size={17} className="shrink-0 text-brand-700" />
                  <span className="text-body font-semibold text-ink">{contact.primaryMobile}</span>
                </a>
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-warm px-4 py-3">
                  <MessageCircle size={17} className="shrink-0 text-brand-700" />
                  <span className="text-body font-semibold text-ink">微信 {contact.wechat}</span>
                </div>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface-warm px-4 py-3 transition-colors hover:border-brand-500/40 hover:bg-white">
                  <Mail size={17} className="shrink-0 text-brand-700" />
                  <span className="break-all text-body font-semibold text-ink">{contact.email}</span>
                </a>
                <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-warm px-4 py-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-brand-700" />
                  <span className="text-caption font-semibold leading-relaxed text-ink">{contact.address}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className={`${container} py-14 lg:py-20`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_4px_24px_rgba(30,30,32,0.03)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink lg:text-3xl">发起询盘</h2>
            <p className="mb-7 mt-2 text-body leading-relaxed text-muted">
              填写应用场景、目标扭矩与年用量,工程师会在 24 小时内给出选型建议。
            </p>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-4">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_36px_rgba(30,30,32,0.06)]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/images/company/contactUs.webp"
                    alt="特澳销售与工程支持团队"
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-micro font-medium uppercase tracking-[0.1em] text-brand-700 backdrop-blur">
                    B2B 工程支持
                  </span>
                  <p className="absolute inset-x-4 bottom-4 text-caption font-semibold leading-snug text-white">
                    从选型、打样到量产,一个工程团队跟到底
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div id="wechat" className="flex items-center gap-4 rounded-3xl border border-line bg-white p-4">
                <Image
                  src={contact.wechatQr}
                  alt={`${contact.primaryName}微信二维码`}
                  width={96}
                  height={96}
                  className="shrink-0 rounded-xl border border-line-soft bg-white p-1"
                />
                <div className="min-w-0">
                  <p className="text-micro font-medium uppercase tracking-[0.14em] text-brand-700">微信咨询</p>
                  <p className="mt-0.5 text-body-lg font-semibold text-ink">{contact.primaryName}</p>
                  <p className="text-caption text-muted">微信 {contact.wechat}</p>
                  <p className="mt-1 text-micro text-muted-light">扫码添加,获取选型建议与报价</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="rounded-3xl border border-line bg-surface-warm p-5">
                <h3 className="text-body font-semibold text-ink">接下来会发生什么?</h3>
                <ol className="mt-4 space-y-3">
                  {steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-caption leading-relaxed text-muted">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-micro font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-line bg-surface-warm">
        <div className={`${container} py-14 lg:py-16`}>
          <SectionHead eyebrow="常见问题" title="询盘与选型答疑" description="关于报价、打样与生产周期的常见问题。" />
          <div className="divide-y divide-line-soft rounded-2xl border border-line bg-white">
            {contactFaq.map(item => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-body font-semibold text-ink">
                  {item.q}
                  <span className="shrink-0 text-brand-700 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-body leading-7 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Location map */}
      <section className="bg-white">
        <div className={`${container} py-14`}>
          <SectionHead eyebrow="公司位置" title="到访特澳" description="广东省东莞市黄江镇黄江北三街2号。来访前请提前联系销售团队,以便安排接待与产线参观。" />
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
            <p className="text-body text-muted">{contact.address}</p>
            <a
              href={AMAP_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-5 py-2.5 text-body font-semibold text-ink-soft transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
            >
              在高德地图中查看 →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
