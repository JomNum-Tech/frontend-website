import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { MaintenanceBanner } from "@/components/banner/MaintenanceBanner";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          <AdminSidebar />
          <main className="lg:ml-64">
            {children}
          </main>
          <div className="fixed z-50 bottom-0 left-0 right-0">
            <MaintenanceBanner />  
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
