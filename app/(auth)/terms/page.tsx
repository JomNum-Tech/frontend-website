"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TermsOfService() {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  // Redirect if user is already signed in
  useEffect(() => {
    if (userLoaded && isSignedIn) {
      router.push("/");
    }
  }, [userLoaded, isSignedIn, router]);

  // Show loading while checking authentication
  if (!userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is signed in (will redirect)
  if (isSignedIn) {
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-4xl bg-white/90 shadow-xl rounded-2xl p-8 border border-blue-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full p-3 mb-2">
            <Image
              src="https://ijewzjgscgbar55p.public.blob.vercel-storage.com/admin-uploads/JomNumTech-Logo.png"
              height={200}
              width={200}
              alt="Jomnum-Tech"
              className="w-24 h-16"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-blue max-w-none">
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using JomNum-Tech&apos;s services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">2. Description of Service</h2>
              <p className="mb-4">
                JomNum-Tech provides educational technology services, including but not limited to online learning platforms, educational content, and related digital services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">3. User Accounts</h2>
              <p className="mb-4">
                To access certain features of our service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to use our services to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Interfere with or disrupt our services</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">5. Intellectual Property</h2>
              <p className="mb-4">
                All content, features, and functionality of our services are owned by JomNum-Tech and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">6. Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">7. Limitation of Liability</h2>
              <p className="mb-4">
                JomNum-Tech shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">8. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">9. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our service. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">10. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">JomNum-Tech</p>
                <p>Email: [email]</p>
                <p>Address: [address]</p>
              </div>
            </section>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-blue-100 flex justify-between items-center">
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Register
          </Link>
          <Link
            href="/privacy"
            className="text-blue-600 font-semibold hover:underline"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}