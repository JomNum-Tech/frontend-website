import Navbar from "@/components/navbar/Navbar"
import HeaderSection from "@/components/header/HeaderSection"
import TeachingStyleSection from "@/components/homepage/TeachingStyleSection"
import FeaturedCoursesSection from "@/components/homepage/FeaturedCoursesSection"
import StepToJoinSection from "@/components/homepage/StepToJoinSection"
import CTASection from "@/components/homepage/CTASection"
import Footer from "@/components/footer/Footer"

export default function HomePage() {
  

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu Bar  */}
      <Navbar />

      {/* Hero Section */}
      <HeaderSection />

      {/* Teaching Style Section */}
      <TeachingStyleSection />

      {/* Featured Courses */}
      <FeaturedCoursesSection />

      {/* Steps to Join */}
      <StepToJoinSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
