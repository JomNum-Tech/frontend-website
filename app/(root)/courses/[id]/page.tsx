import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  FileText,
  Award,
  Calendar,
  Globe,
  HelpCircle,
  Briefcase,
  Code,
  Video,
} from "lucide-react"
import Link from "next/link"
import { getCourseById, getAllCourses } from "@/types/courseData"
import { notFound } from "next/navigation"

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  const course = getCourseById(id)

  if (!course) {
    notFound()
  }

  const allCourses = getAllCourses()
  const relatedCourses = allCourses.filter((c) => c.id !== course.id).slice(0, 2)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "live":
        return <Video className="w-4 h-4 text-red-500" />
      case "project":
        return <Code className="w-4 h-4 text-blue-500" />
      case "quiz":
        return <FileText className="w-4 h-4 text-green-500" />
      default:
        return <Play className="w-4 h-4 text-gray-500" />
    }
  }

  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0)

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
            <li>
              <span className="mx-1 text-blue-300">/</span>
            </li>
            <li aria-current="page">
              <span className="text-blue-900 font-bold block">{course.title}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Course Header */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Course Info */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary" className="text-xs px-4 py-1 rounded-full tracking-wide uppercase bg-blue-100 text-blue-700 border-blue-300">
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1 ml-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-base text-blue-900">{course.rating}</span>
                      <span className="text-blue-400 text-sm">({course.reviews} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-blue-900 drop-shadow-sm">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                    {course.longDescription}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                  <div className="flex items-center space-x-2 bg-blue-100/70 rounded-md px-3 py-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100/70 rounded-md px-3 py-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100/70 rounded-md px-3 py-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>
                      <span className="font-medium text-blue-900">Next class:</span>{" "}
                      <span className="text-blue-500">{course.nextClass}</span>
                    </span>
                  </div>
                </div>

                {/* Instructor Info */}
                <Card className="border-1 border-gray-200 mt-10 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-8">
                      <Avatar className="w-24 h-24 ring-2 ring-blue-500 ring-offset-2 shadow-lg">
                        <AvatarImage
                          src={course.instructor.image || "/placeholder.svg"}
                          alt={course.instructor.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                          {course.instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-2xl truncate text-blue-900">{course.instructor.name}</h3>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">
                            Instructor
                          </span>
                        </div>
                        <p className="text-blue-700 font-medium text-sm">{course.instructor.role}</p>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed line-clamp-3">
                          {course.instructor.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {course.instructor.specialties.map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-blue-50 border border-blue-200 text-blue-700"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-1 border-gray-200 rounded-2xl bg-white">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Price Section */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        {course.originalPrice && (
                          <span className="text-lg text-blue-400 line-through">${course.originalPrice}</span>
                        )}
                        <span className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">${course.price}</span>
                      </div>
                      
                    </div>

                    {/* Enroll Button */}
                    <Button
                      size="lg"
                      className="w-full text-lg py-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white shadow-xl transition-all duration-200"
                    >
                      Enroll Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>

                    <div className="text-center text-xs text-green-700 font-medium bg-green-50 rounded-lg py-2 border border-green-100">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        14-day money-back guarantee
                      </span>
                    </div>

                    <Separator className="my-4" />

                    {/* Course Includes */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-base text-blue-900">This course includes:</h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                          <Video className="w-5 h-5 text-blue-600" />
                          <span>
                            <span className="font-semibold text-blue-900">{totalLessons}</span> live sessions
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-900">Hands-on projects</span>
                        </li>
                        {course.certificate && (
                          <li className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-900">Certificate of completion</span>
                          </li>
                        )}
                        {course.jobSupport && (
                          <li className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-900">Job placement support</span>
                          </li>
                        )}
                        <li className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-900">Lifetime access</span>
                        </li>
                      </ul>
                    </div>

                    <Separator className="my-4" />

                    {/* Schedule */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-blue-900">Schedule:</h4>
                      <div className="text-sm text-blue-700 flex flex-col items-start gap-0.5">
                        <span>
                          <Calendar className="inline-block w-4 h-4 mr-1 text-blue-600" />
                          {course.schedule.days.join(", ")}
                        </span>
                        <span>
                          <Clock className="inline-block w-4 h-4 mr-1 text-blue-600" />
                          {course.schedule.time} <span className="uppercase">{course.schedule.timezone}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="pb-20">
        <div className="container mx-auto px-12 sm:px-8 md:px-12">
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 p-1 mb-6 shadow-sm">
              <TabsTrigger
                value="curriculum"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-semibold rounded-lg transition-colors"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-semibold rounded-lg transition-colors"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-semibold rounded-lg transition-colors"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 font-semibold rounded-lg transition-colors"
              >
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="mt-10">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 via-blue-100/60 to-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold tracking-tight text-blue-900">Course Curriculum</CardTitle>
                  <CardDescription className="text-base text-blue-700 mt-1">
                    <span className="font-medium">{course.curriculum.length} modules</span>
                    <span className="mx-2 text-blue-400">•</span>
                    <span className="font-medium">{totalLessons} lessons</span>
                    <span className="mx-2 text-blue-400">•</span>
                    <span className="font-medium">{course.duration} total</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.curriculum.map((module, moduleIndex) => (
                      <AccordionItem
                        key={moduleIndex}
                        value={`module-${moduleIndex}`}
                        className="border-b-0 rounded-xl mb-4 shadow-md bg-white/90"
                      >
                        <AccordionTrigger className="text-left px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-semibold text-lg text-blue-900">{module.module}</div>
                              <div className="text-sm text-blue-700 mt-0.5">{module.description}</div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                              {module.lessons.length} lessons
                              <span className="mx-1 text-blue-300">•</span>
                              <Clock className="w-4 h-4 mr-1 text-blue-500" />
                              {module.duration}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 border border-blue-100 hover:shadow-lg transition-shadow"
                              >
                                <div className="flex-shrink-0 mt-1">{getTypeIcon(lesson.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-base text-blue-900">{lesson.title}</h4>
                                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                      {lesson.duration}
                                    </span>
                                  </div>
                                  <p className="text-sm text-blue-700 mt-1">{lesson.description}</p>
                                  
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-md border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-blue-900">What You will Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-blue-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-md border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {course.prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                            <span className="text-sm text-blue-800">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Tools & Technologies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {course.tools.map((tool, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 border-0 font-medium"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="shadow-md border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-blue-900">Student Reviews</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-blue-900">{course.rating}</span>
                    </div>
                    <div className="text-blue-700">Based on {course.reviews} reviews</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {course.testimonials.map((testimonial, index) => (
                      <div key={index} className="border-b border-blue-100 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                            <AvatarFallback>
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-blue-900">{testimonial.name}</h4>
                              <div className="flex items-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-blue-700 mb-2">
                              {testimonial.role} at {testimonial.company}
                            </p>
                            <p className="text-sm text-blue-900">{testimonial.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <Card className="shadow-md border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-blue-900">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="rounded-lg mb-2 bg-blue-50">
                        <AccordionTrigger className="text-left px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-blue-900">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-blue-700 pl-8">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses.length > 0 && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Related Courses</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedCourses.map((relatedCourse) => (
                <Card
                  key={relatedCourse.id}
                  className="hover:shadow-2xl transition-shadow border border-blue-100 bg-white rounded-xl"
                  style={{ boxShadow: "0 4px 24px 0 rgba(37, 99, 235, 0.08)" }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-700 border-0">{relatedCourse.level}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-blue-900">{relatedCourse.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-blue-900 hover:text-blue-700 transition-colors cursor-pointer">
                      {relatedCourse.title}
                    </CardTitle>
                    <CardDescription className="text-blue-700">{relatedCourse.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-blue-700">${relatedCourse.price}</span>
                      <Link href={`/courses/${relatedCourse.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg flex items-center transition-colors shadow-sm">
                          View Course
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
