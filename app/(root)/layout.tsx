import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { MaintenanceBanner } from "@/components/banner/MaintenanceBanner";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "JomNum-Tech",
  description: "JomNum-Tech Website",
  keywords: [
    "JomNum-Tech",
    "Web Design",
    "Coding",
    "Online Classes",
    "UX/UI",
    "Programming",
    "Frontend",
    "Bootcamp",
    "Learn to code",
    "Cambodia"
  ],
  authors: [{ name: "JomNum-Tech Team", url: "https://jomnumtech.naktech.pro" }],
  creator: "JomNum-Tech Team",
  openGraph: {
    title: "JomNum-Tech | Master Web Design & Coding",
    description: "Master web design and coding with JomNum-Tech. Online classes, hands-on projects, and expert instructors.",
    url: "https://jomnumtech.naktech.pro",
    siteName: "JomNum-Tech",
    images: [
      {
        url: "https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/Screenshot%202025-07-15%20214359.png",
        width: 1200,
        height: 630,
        alt: "JomNum-Tech Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JomNum-Tech | Master Web Design & Coding",
    description: "Master web design and coding with JomNum-Tech. Online classes, hands-on projects, and expert instructors.",
    images: [
      "https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/Screenshot%202025-07-15%20214359.png"
    ],
    creator: "@jomnumtech"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  themeColor: "#2563eb"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={poppins.className}
        >
          <MaintenanceBanner />
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
