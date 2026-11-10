"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // 后台不使用前台 Header / Footer
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
