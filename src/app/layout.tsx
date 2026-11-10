import type { Metadata } from "next";
import SiteFrame from "@/components/layout/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chinateao.com"),
  title: {
    template: "%s | 特澳 TEAO — 阻尼器与锁扣定制厂家",
    default: "特澳 TEAO — 阻尼器与锁扣机构定制厂家",
  },
  description:
    "特澳 TEAO 专注阻尼器、齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制缓冲机构。IATF 16949认证，20+年制造经验，产品覆盖汽车、家电、卫浴、医疗、工业等领域，支持来图定制。",
  keywords: [
    "阻尼器",
    "齿轮阻尼器",
    "轴向阻尼器",
    "手套箱阻尼器",
    "Push-Push锁扣",
    "锁扣机构",
    "TEAO",
    "特澳",
    "阻尼器厂家",
    "B2B",
    "定制阻尼器",
    "缓冲机构",
  ],
  openGraph: {
    title: "特澳 TEAO — 阻尼器与锁扣机构定制厂家",
    description:
      "IATF 16949认证，20+年制造经验，专注阻尼器与锁扣机构，产品覆盖汽车、家电、卫浴、医疗、工业等领域。",
    url: "https://www.chinateao.com/",
    siteName: "特澳 TEAO",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/images/og/default.jpg", width: 1200, height: 630, alt: "特澳 TEAO — 阻尼器与锁扣定制厂家" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "特澳 TEAO — 阻尼器与锁扣机构定制厂家",
    description: "IATF 16949 认证，20+ 年制造经验，阻尼器与锁扣机构定制源头厂家。",
    images: ["/images/og/default.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col bg-surface text-ink pt-[73px]">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
