import Link from "next/link";
import Image from "next/image";
import { liveCategories, liveHref } from "@/lib/live-site";
import { contact, telHref } from "@/content/live-site/contact";

const footerLinks = [
  {
    title: "产品",
    links: liveCategories.map(category => ({ label: category.label, href: category.path })),
  },
  {
    title: "关于",
    links: [
      { label: "关于我们", href: "/about-us/" },
      { label: "应用领域", href: liveHref("/applications/") },
      { label: "质量认证", href: "/quality-control/" },
      { label: "新闻", href: "/news/" },
    ],
  },
  {
    title: "支持",
    links: [
      { label: "常见问题", href: "/faq/" },
      { label: "扭矩换算", href: "/convert/" },
      { label: "联系我们", href: "/contacts/" },
      { label: "网站地图", href: "/sitemap/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-warm">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 py-12 lg:grid-cols-[1.05fr_1.6fr] lg:gap-16">
          {/* Brand + primary contact */}
          <div>
            <Link href="/" aria-label="特澳 TEAO 首页" className="relative block h-10 w-[106px]">
              <Image src="/images/logo-color.webp" alt="TEAO 特澳" fill sizes="106px" className="object-contain object-left" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              东莞市特澳电子科技有限公司，专注阻尼器与锁扣机构研发制造。
            </p>

            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
              <Image
                src={contact.wechatQr}
                alt={`${contact.primaryName}微信二维码`}
                width={84}
                height={84}
                className="shrink-0 rounded-lg border border-line-soft bg-white p-1"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">销售工程师</p>
                <p className="mt-0.5 text-lg font-black text-ink">{contact.primaryName}</p>
                <a
                  href={telHref(contact.primaryMobile)}
                  className="block text-sm font-semibold text-ink-soft transition-colors hover:text-brand-700"
                >
                  {contact.primaryMobile}
                </a>
                <p className="text-[13px] text-muted">微信 {contact.wechat}</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pt-2">
            {footerLinks.map(group => (
              <div key={group.title}>
                <h3 className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-muted-light">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-brand-700">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between lg:px-8">
          <p>&copy; {new Date().getFullYear()} 东莞市特澳电子科技有限公司 版权所有</p>
          <div className="flex items-center gap-4">
            <Link href="/sitemap/" className="transition-colors hover:text-brand-700">网站地图</Link>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink-soft"
            >
              粤ICP备13044030号-2
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
