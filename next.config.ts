import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        // The original post described a "Bun 2.0" that never shipped; it now covers Bun 1.2.
        source: "/article/bun-2-ships-native-sql-and-hot-reload",
        destination: "/article/bun-1-2-built-in-postgres-s3-text-lockfile",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
