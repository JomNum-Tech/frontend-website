export const metadata = {
  title: "Online Coding Courses | JomNum Tech",
  description: "Master in-demand tech skills with our interactive live courses. Learn from industry experts and build real-world projects at JomNum Tech.",
  keywords: [
    "coding courses",
    "online courses",
    "learn to code",
    "JomNum Tech",
    "programming",
    "web development",
    "tech skills"
  ],
  openGraph: {
    title: "Online Coding Courses | JomNum Tech",
    description: "Master in-demand tech skills with our interactive live courses. Learn from industry experts and build real-world projects at JomNum Tech.",
    url: "https://jomnumtech.naktech.pro/courses",
    siteName: "JomNum Tech",
    images: [
      {
        url: "https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/courses-jomnumtech.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "JomNum Tech Online Coding Courses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Coding Courses | JomNum Tech",
    description: "Master in-demand tech skills with our interactive live courses. Learn from industry experts and build real-world projects at JomNum Tech.",
    images: ["https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/courses-jomnumtech.png"], // Replace with your actual image
  },
};

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import CourseGridSection from "@/components/course/CourseGridSection"
import CTASection from "@/components/homepage/CTASection"

import Link from "next/link"

export default function CoursesPage() {

    return (
        <div className="min-h-screen bg-background">

            {/* Breadcrumb */}
            <nav className="border-b bg-blue-50 shadow-sm">
                <div className="container mx-auto px-4 md:px-12 py-4">
                    <ol className="flex items-center gap-2 text-sm text-blue-700" aria-label="Breadcrumb">
                        <li>
                            <Link
                                href="/"
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                                aria-label="Home"
                            >
                                <span className="inline-block align-middle">Home</span>
                            </Link>
                        </li>
                        <li>
                            <span className="mx-1 text-blue-300">/</span>
                        </li>
                        <li>
                            <Link
                                href="/courses"
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold"
                                aria-label="Courses"
                            >
                                <span className="inline-block align-middle">Courses</span>
                            </Link>
                        </li>
                    
                    </ol>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center mb-14">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-blue-900">
                            Online <span className="text-blue-600">Coding Courses</span>
                        </h1>
                        <p className="text-xl text-gray-500 italic max-w-3xl mx-auto">
                            Master in-demand tech skills with our interactive live courses. Learn from industry experts and build
                            real-world projects.
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="max-w-4xl mx-auto mb-14">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                                <Input
                                    placeholder="Search courses..."
                                    className="pl-11 py-3 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-blue-900 placeholder:text-blue-400 shadow-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-[150px] rounded-lg border-blue-200 bg-blue-50 text-blue-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm">
                                        <Filter className="w-4 h-4 mr-2 text-blue-500" />
                                        <SelectValue placeholder="Level" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-100">
                                        <SelectItem value="all" className="text-blue-900 hover:bg-blue-50">All Levels</SelectItem>
                                        <SelectItem value="beginner" className="text-blue-900 hover:bg-blue-50">Beginner</SelectItem>
                                        <SelectItem value="intermediate" className="text-blue-900 hover:bg-blue-50">Intermediate</SelectItem>
                                        <SelectItem value="advanced" className="text-blue-900 hover:bg-blue-50">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-[150px] rounded-lg border-blue-200 bg-blue-50 text-blue-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-100">
                                        <SelectItem value="all" className="text-blue-900 hover:bg-blue-50">All Duration</SelectItem>
                                        <SelectItem value="short" className="text-blue-900 hover:bg-blue-50">1-4 weeks</SelectItem>
                                        <SelectItem value="medium" className="text-blue-900 hover:bg-blue-50">5-8 weeks</SelectItem>
                                        <SelectItem value="long" className="text-blue-900 hover:bg-blue-50">9+ weeks</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <CourseGridSection />

            {/* CTA Section */}
            <CTASection />
        </div>
    )
}
