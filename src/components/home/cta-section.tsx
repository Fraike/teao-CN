import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { contact, telHref } from "@/content/live-site/contact";

const ctaBenefits = [
  "提交图纸获取选型建议",
  "发送样品信息安排打样",
  "描述应用场景获取方案",
];

export function CTASection() {
  return (
    <section id="contact" className="section border-t border-line bg-gradient-to-b from-surface-warm to-white py-20">
      <div className="mx-auto w-[min(1240px,calc(100%-48px))]">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <Reveal>
              <p className="mb-2 inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-brand-700
                before:content-[''] before:block before:h-[2px] before:w-[22px] before:rounded before:bg-brand-500">
                快速询盘
              </p>
              <h2 className="max-w-[620px] text-[36px] font-bold leading-[1.22] tracking-[-0.01em] text-ink">
                发图纸或描述需求<br />
                <b className="font-black text-brand-700">我们先帮你判断结构和扭矩方向</b>
              </h2>
              <p className="mt-4 max-w-[620px] text-[14.5px] leading-[1.8] text-muted">
                无论是标准品选型还是非标定制，提交以下任一信息即可启动工程师评估流程。也可直接电话、微信或邮件联系销售工程师。
              </p>
            </Reveal>

            <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {ctaBenefits.map(benefit => (
                <Reveal key={benefit}>
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-white p-4 text-[13px] font-semibold text-ink-soft transition-all duration-250 hover:border-brand-500/40 hover:bg-brand-50">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-black text-brand-700">✓</span>
                    {benefit}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={1}>
            <div className="rounded-3xl border border-line bg-white p-7 shadow-[0_20px_50px_rgba(30,30,32,0.08)]">
              <div className="flex items-center gap-4">
                <Image
                  src={contact.wechatQr}
                  alt={`${contact.primaryName}微信二维码`}
                  width={96}
                  height={96}
                  className="shrink-0 rounded-xl border border-line-soft bg-white p-1"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">销售工程师</p>
                  <p className="mt-1 text-2xl font-black text-ink">{contact.primaryName}</p>
                  <a href={telHref(contact.primaryMobile)} className="mt-1 block text-sm font-semibold text-muted transition-colors hover:text-brand-700">
                    {contact.primaryMobile}
                  </a>
                  <p className="text-sm text-muted">微信 {contact.wechat}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href={telHref(contact.primaryMobile)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(232,120,26,0.22)] transition-all hover:-translate-y-0.5 hover:bg-brand-700"
                >
                  电话咨询
                </a>
                <Link
                  href="/contacts/"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  在线留言
                </Link>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-muted-light">
                也可以到联系页查看公司地址与地图,或直接扫码添加微信。
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
