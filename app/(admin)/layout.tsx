import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

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
          
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
