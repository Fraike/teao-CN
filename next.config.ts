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
