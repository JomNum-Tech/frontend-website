import HeroSection from "@/components/about/HeroSection"
import StatSection from "@/components/about/StatSection"
import StorySection from "@/components/about/StorySection"
import ValueSection from "@/components/about/ValueSection"
import InstructorSection from "@/components/about/InstructorSection"
import JourneyTimelineSection from "@/components/about/JourneyTimelineSection"
import TeachingMethodoloySection from "@/components/about/TeachingMethodology"
import CTASection from "@/components/homepage/CTASection"

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatSection />

      {/* Our Story Section */}
      <StorySection />

      {/* Our Values */}
      <ValueSection />

      {/* Meet Our Instructors */}
      <InstructorSection />

      {/* Our Journey Timeline */}
      <JourneyTimelineSection />

      {/* Teaching Methodology */}
      <TeachingMethodoloySection />
      
      {/* CTA Section */}
      <CTASection />
      
    </div>
  )
}
