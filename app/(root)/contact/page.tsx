"use client"

import type React from "react"
import HeroSection from "@/components/contact/HeroSection"
import ContactMethodSection from "@/components/contact/ContactMethod"
import LocationSection from "@/components/contact/LocationSection"
import FAQSection from "@/components/contact/FAQSection"
import ContactFormSection from "@/components/contact/ContactFormSection"

export default function ContactPage() {
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Contact Methods */}
      <ContactMethodSection />

      {/* Contact Form and Inquiry Types */}
      <ContactFormSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Location/Virtual Presence */}
      <LocationSection />

      {/* Footer */}
      <footer />
    </div>
  )
}
