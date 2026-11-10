import type { Metadata } from "next";

export const SITE_URL = "https://www.chinateao.com";
export const SITE_NAME = "特澳 TEAO";

export interface OgImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export const OG_DEFAULT: OgImage = {
  url: "/images/og/default.jpg",
  width: 1200,
  height: 630,
  alt: "特澳 TEAO — 阻尼器与锁扣定制厂家",
};

/** 页级 openGraph 需要写全字段 —— Next 会用子级对象整体替换根布局的 openGraph。 */
export function pageOpenGraph({
  title,
  description,
  path,
  image = OG_DEFAULT,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: OgImage;
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: SITE_URL + path,
    siteName: SITE_NAME,
    locale: "zh_CN",
    type,
    images: [image],
  };
}
