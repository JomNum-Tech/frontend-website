"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-blue max-w-none">
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
              
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information (email address)</li>
                <li>Account credentials</li>
                <li>Profile information</li>
                <li>Educational progress and performance data</li>
              </ul>

              <h3 className="text-lg font-semibold text-blue-600 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Device information and identifiers</li>
                <li>Usage data and analytics</li>
                <li>Log files and technical data</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Personalize your learning experience</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">5. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">6. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">7. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">8. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">9. International Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the Last updated date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold">JomNum-Tech</p>
                <p>Email: [email]</p>
                <p>Address: [address]</p>
                <p>Privacy Officer: [name]</p>
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
            href="/terms"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}