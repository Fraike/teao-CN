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
    title: "工程工具",
    links: [
      { label: "扭矩换算", href: "/convert/" },
    ],
  },
  {
    title: "联系",
    links: [
      { label: "联系我们", href: "/contacts/" },
      { label: "获取报价", href: "/contacts/" },
      { label: "常见问题", href: "/faq/" },
    ],
  },
];

const contactCells = [
  {
    label: "联系人",
    primary: contact.primaryName,
    secondary: contact.primaryMobile,
    href: telHref(contact.primaryMobile),
  },
  {
    label: "微信",
    primary: contact.wechat,
    secondary: `备用手机 ${contact.secondaryMobile}`,
    href: telHref(contact.secondaryMobile),
  },
  {
    label: "电话",
    primary: contact.phone,
    secondary: contact.email,
    href: telHref(contact.phone),
    secondaryHref: `mailto:${contact.email}`,
  },
  {
    label: "地址",
    primary: contact.address,
    secondary: "周一至周六 8:30–18:00",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-warm">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 py-14 lg:grid-cols-[1.05fr_1.95fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="特澳 TEAO 首页" className="relative block h-10 w-[106px]">
              <Image src="/images/logo-color.webp" alt="TEAO 特澳" fill sizes="106px" className="object-contain object-left" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              东莞市特澳电子科技有限公司，专注阻尼器与锁扣机构研发制造，产品广泛应用于汽车、家电、卫浴、医疗、工业等领域。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contacts/"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(232,120,26,0.22)] transition-all hover:-translate-y-0.5 hover:bg-brand-700"
              >
                获取报价
              </Link>
              <a
                href={telHref(contact.primaryMobile)}
                className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
              >
                电话咨询
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
              <Image
                src={contact.wechatQr}
                alt={`${contact.primaryName}微信二维码`}
                width={64}
                height={64}
                className="shrink-0 rounded-lg border border-line-soft bg-white p-1"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-700">微信</p>
                <p className="mt-0.5 text-sm font-bold text-ink">{contact.wechat}</p>
                <p className="text-[11px] text-muted-light">扫码添加 {contact.primaryName}</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map(group => (
              <div key={group.title}>
                <h3 className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-muted-light">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-soft transition-colors hover:text-brand-700"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="mb-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {contactCells.map(cell => (
            <div key={cell.label} className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-light">{cell.label}</p>
              {cell.href ? (
                <a href={cell.href} className="mt-1.5 block text-sm font-bold text-ink transition-colors hover:text-brand-700">{cell.primary}</a>
              ) : (
                <p className="mt-1.5 text-sm font-bold leading-snug text-ink">{cell.primary}</p>
              )}
              {cell.secondaryHref ? (
                <a href={cell.secondaryHref} className="mt-0.5 block text-[12px] text-muted transition-colors hover:text-brand-700">{cell.secondary}</a>
              ) : (
                <p className="mt-0.5 text-[12px] text-muted">{cell.secondary}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between lg:px-8">
          <p>&copy; {new Date().getFullYear()} 东莞市特澳电子科技有限公司 版权所有</p>
          <p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink-soft"
            >
              粤ICP备XXXXXXXX号
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
