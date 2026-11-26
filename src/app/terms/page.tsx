import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { container } from "@/components/live-site/container";
import { contact } from "@/content/live-site/contact";
import { LIVE_ORIGIN } from "@/lib/live-site";
import { pageOpenGraph } from "@/lib/metadata";

const title = "服务条款 | 特澳 TEAO";
const description = "特澳服务条款：说明本网站的使用规则、产品信息、知识产权与责任边界。";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: LIVE_ORIGIN + "/terms/" },
  robots: { index: true, follow: true },
  openGraph: pageOpenGraph({ title, description, path: "/terms/" }),
};

function Section({ title: heading, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">{heading}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="法律信息"
        title="服务条款"
        description="使用本网站前，请阅读以下条款。"
        breadcrumb={[{ label: "首页", href: "/" }, { label: "服务条款" }]}
      />

      <section className={`${container} py-12 lg:py-16`}>
        <div className="mx-auto max-w-3xl text-body leading-8 text-ink-soft">
          <p className="mb-10 text-caption text-muted">生效日期：2026 年 11 月 26 日</p>

          <div className="space-y-10">
            <Section title="1. 适用范围">
              <p>本条款适用于您访问和使用 <strong className="font-semibold text-ink">www.chinateao.com</strong> 及其提供的产品展示、技术资料、询盘和联系功能。</p>
              <p>您使用本网站，即表示您已阅读并同意本条款；如您不同意，请停止使用本网站。</p>
            </Section>

            <Section title="2. 网站内容与产品信息">
              <ul className="list-disc space-y-2 pl-5">
                <li>本网站展示的产品型号、图片、规格、扭矩、材料、尺寸和性能数据用于一般性介绍，不构成具有约束力的报价或要约。</li>
                <li>实际供货参数、价格、交期、认证和适配性以双方确认的报价单、技术协议或合同为准。</li>
                <li>我们尽力保持信息准确和及时，但不对内容的完整性、准确性或适用于特定用途作出明示或默示保证。</li>
                <li>产品图片可能因拍摄、显示设备或批次不同而存在色差，以实物和确认样品为准。</li>
              </ul>
            </Section>

            <Section title="3. 知识产权">
              <ul className="list-disc space-y-2 pl-5">
                <li>本网站的文字、图片、产品图、尺寸图、性能曲线、页面设计、商标和标识等，归东莞市特澳电子科技有限公司或相关权利人所有。</li>
                <li>未经书面许可，不得复制、转载、修改、分发、爬取或用于商业用途；不得删除或修改权利声明。</li>
                <li>您通过询盘提交的图纸、样品信息和其他资料，其权利仍归您或原权利人所有；我们仅在评估和完成业务沟通所必需的范围内使用。</li>
              </ul>
            </Section>

            <Section title="4. 使用规范">
              <p>您同意不利用本网站从事以下行为：</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>提交虚假、冒用他人身份或与业务无关的询盘；</li>
                <li>未经授权抓取、批量采集、镜像或干扰网站运行；</li>
                <li>攻击、探测漏洞、绕过访问控制或传播恶意代码；</li>
                <li>侵犯他人知识产权、隐私或其他合法权益；</li>
                <li>违反中华人民共和国法律法规的其他行为。</li>
              </ul>
              <p>如发现异常使用，我们有权限制访问、删除相关内容并保留追究法律责任的权利。</p>
            </Section>

            <Section title="5. 第三方链接">
              <p>本网站可能包含阿里巴巴国际站、1688 等第三方网站链接，仅为方便您了解我们的产品和服务。第三方网站由其运营者独立负责，我们不对其内容、隐私做法或可用性承担责任。</p>
            </Section>

            <Section title="6. 免责声明">
              <p>本网站按“现状”提供。在法律允许的最大范围内，我们不对因使用或无法使用本网站产生的间接、附带或后果性损失承担责任。因网络、设备、第三方服务或不可抗力导致的中断，我们会合理协助恢复，但不承担超出法律规定的责任。</p>
              <p>本条款不排除或限制依法不能排除或限制的责任。</p>
            </Section>

            <Section title="7. 隐私">
              <p>我们如何处理您提交的个人信息，请阅读 <Link href="/privacy/" className="font-semibold text-brand-700 underline underline-offset-2">《隐私政策》</Link>。隐私政策与本条款共同适用于您对本网站的使用。</p>
            </Section>

            <Section title="8. 适用法律与争议解决">
              <p>本条款适用中华人民共和国法律。因本网站使用或本条款产生的争议，双方应先友好协商；协商不成的，提交东莞市有管辖权的人民法院处理。</p>
            </Section>

            <Section title="9. 联系方式">
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
