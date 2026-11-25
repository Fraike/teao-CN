"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { CategoryPublic } from "@/lib/catalog-store";
import Header from "./header";
import Footer from "./footer";

export default function SiteFrame({ children, categories }: { children: ReactNode; categories: CategoryPublic[] }) {
  const pathname = usePathname();

  // 后台不使用前台 Header / Footer
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1 pt-[73px]">{children}</main>
      <Footer categories={categories} />
    </>
  );
}
