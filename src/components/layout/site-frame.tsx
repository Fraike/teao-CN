import type { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

export default function SiteFrame({ children }: { children: ReactNode }) {
  return <>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </>;
}
