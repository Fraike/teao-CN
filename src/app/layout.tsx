import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 特澳 TEAO — 汽车内饰阻尼器定制厂家",
    default: "特澳 TEAO — 汽车内饰阻尼器与锁扣定制厂家",
  },
  description:
    "特澳 TEAO 专注汽车内饰阻尼器、齿轮阻尼器、轴向阻尼器、手套箱阻尼器、Push-Push 锁扣及定制缓冲机构。IATF 16949认证，20+年制造经验，支持来图定制。",
  keywords: [
    "汽车阻尼器",
    "齿轮阻尼器",
    "轴向阻尼器",
    "手套箱阻尼器",
    "Push-Push锁扣",
    "汽车内饰锁扣",
    "TEAO",
    "特澳",
    "汽车零部件",
    "B2B",
    "定制阻尼器",
  ],
  openGraph: {
    title: "特澳 TEAO — 汽车内饰阻尼器与锁扣定制厂家",
    description:
      "IATF 16949认证，20+年制造经验，专注汽车内饰阻尼器与锁扣机构。",
    siteName: "特澳 TEAO",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
