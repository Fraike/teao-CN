import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/about-us/", statusCode: 301 },
      { source: "/contact", destination: "/contacts/", statusCode: 301 },
      { source: "/torque-converter", destination: "/convert/", statusCode: 301 },
      { source: "/zh-hans/torque/:slug.html", destination: "/convert/", statusCode: 301 },
      // RD-V127 两个重复页合并：旧路径 301 到保留页
      {
        source: "/Glove%20Box%20Dampers/rd-v127-shiyongyuqicheshoutaoxiang-shounahe.html",
        destination: "/Glove%20Box%20Dampers/gear-rotary-vane-damper-RD-V127.html",
        statusCode: 301,
      },
      // 老站 RD-T170 的页面误挂在 RD-T138 路径下，301 到正确地址
      {
        source:
          "/axial-dampers/RD-T138%E9%80%82%E7%94%A8%E4%BA%8E%E8%A1%A3%E5%B8%BD%E9%92%A9%E3%80%81%20%E6%89%AB%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA%E3%80%81%E6%B1%BD%E8%BD%A6%E9%98%BB%E5%B0%BC%E5%99%A8%E3%80%81%E5%AE%B6%E7%94%A8%E7%94%B5%E5%99%A8.html",
        destination: "/axial-dampers/axial-barrel-damper-RD-T170.html",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        // 字体分片按内容哈希命名，可安全长缓存
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Preserve the live site's directory slashes and .html URLs verbatim.
  // Do not impose one global slash convention on the existing development routes.
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
