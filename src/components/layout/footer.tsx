import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "产品",
    links: [
      { label: "齿轮阻尼器", href: "/products/gear-damper" },
      { label: "轴向阻尼器", href: "/products/axial-damper" },
      { label: "手套箱阻尼器", href: "/products/glove-box-damper" },
      { label: "Push-Push 锁扣", href: "/products/latch" },
      { label: "定制零部件", href: "/products/custom" },
    ],
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
  { label: "电话", value: "021-5768 4226" },
  { label: "邮箱", value: "karl@shanghaiteao.com" },
  { label: "地址", value: "上海市松江区车墩镇泖亭路199号" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-500 bg-[#1A1A1E] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_2fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/logo-color.webp"
                alt="TEAO 特澳"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="text-lg font-black tracking-[0.12em] text-brand-500">
                TEAO
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-muted-light">
              上海特澳汽车零部件有限公司，专注汽车内饰阻尼器与锁扣机构研发制造20余年。
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-6">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="mb-3 text-sm font-bold text-white">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-light transition-colors hover:text-brand-500"
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
            <h4 className="mb-3 text-sm font-bold text-white">联系方式</h4>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label} className="text-sm">
                  <span className="text-muted">{item.label}：</span>
                  <span className="text-muted-light">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} 上海特澳汽车零部件有限公司 版权所有
          </p>
          <p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-muted-light"
            >
              沪ICP备XXXXXXXX号
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
