import Link from "next/link";
import Image from "next/image";
import { liveCategories } from "@/lib/live-site";

const footerLinks = [
  {
    title: "产品",
    links: liveCategories.map(category => ({ label: category.label, href: category.path })),
  },
  {
    title: "关于",
    links: [
      { label: "关于我们", href: "/about" },
      { label: "应用领域", href: "/applications" },
      { label: "制造实力", href: "/#factory" },
      { label: "质量认证", href: "/#quality" },
    ],
  },
  {
    title: "联系",
    links: [
      { label: "联系我们", href: "/contact" },
      { label: "获取报价", href: "/contact" },
    ],
  },
];

const contactInfo = [
  { label: "电话", value: "0769-82937929" },
  { label: "手机", value: "18617094202" },
  { label: "邮箱", value: "karl@shanghaiteao.com" },
  { label: "地址", value: "广东省东莞市黄江镇黄江北三街2号" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-500 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_2fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/logo-color.webp"
                alt="TEAO 特澳"
                width={44}
                height={44}
                className="rounded"
              />
              <span className="text-lg font-black tracking-[0.12em] text-brand-500">
                TEAO
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-muted">
              东莞市特澳电子科技有限公司，专注阻尼器与锁扣机构研发制造，产品广泛应用于汽车、家电、卫浴、医疗、工业等领域。
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-6">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-bold text-ink">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-brand-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-ink">联系方式</h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label} className="text-sm">
                  <span className="text-muted">{item.label}：</span>
                  <span className="text-ink-soft">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} 东莞市特澳电子科技有限公司 版权所有
          </p>
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
