import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "7zg3rv0nfdklwx5q.public.blob.vercel-storage.com",
      "img.clerk.com",
      "randomuser.me",
      "ijewzjgscgbar55p.public.blob.vercel-storage.com",
      "utfs.io",
      "avatars.githubusercontent.com",
      "images.unsplash.com"
    ]
  }
};

export default nextConfig;
