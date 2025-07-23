import { Poppins } from "next/font/google";
import "@/styles/globals.css";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
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
          className={poppins.className}
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
