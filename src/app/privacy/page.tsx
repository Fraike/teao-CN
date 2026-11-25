import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { container } from "@/components/live-site/container";
import { contact } from "@/content/live-site/contact";
import { LIVE_ORIGIN } from "@/lib/live-site";
import { pageOpenGraph } from "@/lib/metadata";

const title = "隐私政策 | 特澳 TEAO";
const description = "特澳隐私政策：说明官网询盘信息的收集范围、使用目的、保护方式与您的权利。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: LIVE_ORIGIN + "/privacy/" },
  robots: { index: true, follow: true },
  openGraph: pageOpenGraph({ title, description, path: "/privacy/" }),
};

function Section({ title: heading, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">{heading}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="法律信息"
        title="隐私政策"
        description="了解特澳如何收集、使用和保护您通过官网提交的信息。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "隐私政策" }]}
      />

      <section className={`${container} py-12 lg:py-16`}>
        <div className="mx-auto max-w-3xl text-body leading-8 text-ink-soft">
          <p className="mb-10 text-caption text-muted">生效日期：2026 年 11 月 25 日</p>

          <div className="space-y-10">
            <Section title="1. 适用范围">
              <p>本政策适用于您访问 <strong className="font-semibold text-ink">www.chinateao.com</strong> 及通过官网表单提交询盘、索取样品或技术资料时提供的信息。</p>
            </Section>

            <Section title="2. 我们收集的信息">
              <ul className="list-disc space-y-2 pl-5">
                <li>您主动填写的信息：姓名、公司名称、电话、邮箱、感兴趣的产品、预计年用量和需求描述。</li>
                <li>提交时自动记录的信息：提交时间、IP 地址及浏览器/设备基础信息，用于防止垃圾提交和保障网站安全。</li>
                <li>我们不会主动要求您提供身份证号、银行卡号等敏感个人信息。请勿在需求描述中填写与业务沟通无关的敏感信息。</li>
              </ul>
            </Section>

            <Section title="3. 使用目的">
              <ul className="list-disc space-y-2 pl-5">
                <li>回复询盘，提供选型建议、报价、样品和技术资料；</li>
                <li>跟进订单、售后和日常业务沟通；</li>
                <li>识别和防止垃圾提交、攻击等安全风险；</li>
                <li>履行法律法规要求的其他义务。</li>
              </ul>
              <p>我们不会将您的信息用于与上述目的无关的营销，也不会出售您的个人信息。</p>
            </Section>

            <Section title="4. 共享与委托处理">
              <ul className="list-disc space-y-2 pl-5">
                <li>我们不会出售、出租您的个人信息。</li>
                <li>为完成业务沟通，可能在必要范围内向邮件、云服务、物流等服务商提供信息，并要求其履行保密和安全义务。</li>
                <li>除法律法规、司法机关或监管部门依法要求外，我们不会向无关第三方披露您的个人信息。</li>
              </ul>
            </Section>

            <Section title="5. 保存期限">
              <p>我们会在业务沟通、报价、订单或售后服务所需的期限内保存您的信息；超过期限后将删除或匿名化处理。法律法规另有保存要求的，按法律法规执行。</p>
            </Section>

            <Section title="6. Cookie 与访问统计">
              <p>官网公开页面当前不使用第三方广告追踪 Cookie。后台登录使用必要的会话 Cookie。如未来接入访问统计工具，我们会更新本政策并说明其用途。</p>
            </Section>

            <Section title="7. 您的权利">
              <p>您可以联系我们查询、更正、补充或删除您提交的信息，也可以撤回同意或要求我们停止继续使用。我们会在合理期限内处理您的请求，法律法规另有规定的除外。</p>
              <p>联系方式：<a className="font-semibold text-brand-700 underline underline-offset-2" href={`mailto:${contact.email}`}>{contact.email}</a>，或致电 {contact.primaryMobile}。</p>
            </Section>

            <Section title="8. 信息安全">
              <p>我们通过 HTTPS 传输、访问控制、最小化收集等措施保护您的信息。互联网传输无法保证绝对安全；如发生个人信息安全事件，我们会依法采取补救措施并通知相关方。</p>
            </Section>

            <Section title="9. 未成年人">
              <p>本网站面向企业客户，不面向未成年人。若您为未成年人，请在监护人指导下使用本网站，或不要提交个人信息。</p>
            </Section>

            <Section title="10. 政策更新">
              <p>本政策可能根据业务或法律变化更新。更新后的政策将在本页发布，并标注生效日期。</p>
            </Section>

            <Section title="11. 联系我们">
              <p>东莞市特澳电子科技有限公司</p>
              <p>地址：{contact.address}</p>
              <p>电话：{contact.phone} / {contact.primaryMobile}</p>
              <p>邮箱：<a className="font-semibold text-brand-700 underline underline-offset-2" href={`mailto:${contact.email}`}>{contact.email}</a></p>
              <p>如需进一步沟通，也可以访问 <Link href="/contacts/" className="font-semibold text-brand-700 underline underline-offset-2">联系我们</Link>。</p>
              <p className="text-caption text-muted">
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-ink-soft">粤ICP备13044030号-2</a>
              </p>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}
