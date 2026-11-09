import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/about-us/", statusCode: 301 },
      { source: "/contact", destination: "/contacts/", statusCode: 301 },
      { source: "/torque-converter", destination: "/convert/", statusCode: 301 },
      { source: "/zh-hans/torque/:slug.html", destination: "/convert/", statusCode: 301 },
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
