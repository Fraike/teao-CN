import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "后台管理 | 特澳 TEAO" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mt-[73px] min-h-screen bg-surface">{children}</div>;
}
