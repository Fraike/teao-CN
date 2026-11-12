import Link from "next/link";
import Image from "next/image";
import { liveCategories, liveHref } from "@/lib/live-site";

const ALIBABA_INTL_URL = "https://teaodamper.en.alibaba.com/index.html?spm=a2700.shop_cp.88.3.3c3166e8H8zAXQ&biz=cpscoupon&promotionCode=AB13&xp=Sez8PLFEziUprGY6uJO4hsylJyekhw1tgalUJqPIWm-9p6hqavyvjfsrDlaz_bsiJtkaDeNmMLiMcXQmA9rO6V5Rk_6DeFDDqFgCrDIvzKosMbeanHAIqwcTEART57S-&cps_sk=jnsdjomm&bm=cps&src=saf&pid=accio";
const ALIBABA_CN_URL = "https://chinateao1688.1688.com/?spm=a261y.7663282.shopNavigation.2.165364a2Mi71w9&offerId=1009140776330&td_page_id=PC-UNLOGIN-DEFAULT-2026";

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
            <p className="mt-4 max-w-sm text-body leading-7 text-muted">
              东莞市特澳电子科技有限公司，专注阻尼器与锁扣机构研发制造。
            </p>

            <div className="mt-5">
              <p className="text-micro font-medium uppercase tracking-[0.14em] text-muted-light">关注我们</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={ALIBABA_INTL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  阿里巴巴国际站
                </a>
                <a
                  href={ALIBABA_CN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  阿里巴巴国内站 1688
                </a>
              </div>
            </div>
            <Link
              href="/contacts/"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-body font-semibold text-white shadow-[0_10px_24px_rgba(232,120,26,0.22)] transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            >
              获取报价
            </Link>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pt-2">
            {footerLinks.map(group => (
              <div key={group.title}>
                <h3 className="mb-4 text-micro font-medium uppercase tracking-[0.14em] text-muted-light">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-body text-ink-soft transition-colors hover:text-brand-700">
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
