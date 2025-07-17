import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "7zg3rv0nfdklwx5q.public.blob.vercel-storage.com",
      "img.clerk.com",
      "randomuser.me"
    ]
  }
};

export default nextConfig;
