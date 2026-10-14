import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve the live site's directory slashes and .html URLs verbatim.
  // Do not impose one global slash convention on the existing development routes.
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
