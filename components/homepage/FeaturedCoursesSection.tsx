import { featuredCourses } from "@/types/featuredCourses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "../ui/button";

export default function FeaturedCoursesSection() {
    return (
        <>
            <section
                id="courses"
                className="py-24 bg-white"
            >
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl text-blue-600 font-extrabold mb-4 tracking-tight drop-shadow-sm">
                            Featured Courses
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose from our most popular live courses designed by industry experts
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredCourses.map((course) =>
                            course.comingSoon ? (
                                <Card
                                    key={course.id + "-coming-soon"}
                                    className="relative group border-0 shadow-xl rounded-2xl bg-gradient-to-br from-blue-200/80 via-blue-100/80 to-white/80 transition-all duration-300 overflow-hidden flex flex-col justify-center items-center min-h-[370px]"
                                    style={{
                                        minHeight: "370px",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-blue-900/70 flex flex-col justify-center items-center z-10">
                                        <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg mb-4 animate-pulse tracking-widest uppercase">
                                            Coming Soon
                                        </span>
                                        <CardTitle className="text-3xl font-extrabold text-white text-center drop-shadow-lg mb-2">
                                            {course.title}
                                        </CardTitle>
                                        <CardDescription className="text-base text-blue-100 text-center max-w-xs mb-6">
                                            {course.description}
                                        </CardDescription>
                                        <span className="px-4 py-2 rounded-full bg-blue-100/80 text-blue-800 font-semibold shadow text-sm">
                                            Stay Tuned for Updates
                                        </span>
                                    </div>
                                    {/* Decorative blurred background */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/30 rounded-full blur-2xl" />
                                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl" />
                                    </div>
                                </Card>
                            ) : (
                                <Card
                                    key={course.id}
                                    className="relative group border border-2 border-transparent shadow-lg hover:shadow-xl rounded-xl bg-white transition-all duration-300 hover:border-blue-500 overflow-hidden flex flex-col h-full"
                                    style={{
                                        minHeight: "370px",
                                    }}
                                >
                                    {/* Card Header with improved hierarchy */}
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <Badge
                                                variant="secondary"
                                                className="uppercase tracking-wide text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20"
                                            >
                                                {course.level}
                                            </Badge>
                                            
                                        </div>

                                        <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                                            {course.title}
                                        </CardTitle>

                                        <CardDescription className="text-sm text-gray-600 line-clamp-3">
                                            {course.description}
                                        </CardDescription>
                                    </CardHeader>

                                    {/* Card Content with better information grouping */}
                                    <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-4">
                                        <div className="space-y-4">
                                            {/* Course metadata */}
                                            <div className="grid grid-cols-1 gap-3 text-sm">
                                                <div className="flex gap-2 items-center space-x-2 bg-gray-50 p-4 rounded-lg">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <div className="text-xs text-gray-500">Duration</div>
                                                        <span className="font-medium text-gray-700">{course.duration}</span>
                                                    </div>
                                                </div>

                                                
                                            </div>

                                            
                                        </div>

                                        {/* Price and CTA section */}
                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Price</div>
                                                    <div className="text-xl font-extrabold text-green-500 flex items-center">
                                                        {course.price}
                                                        
                                                    </div>
                                                </div>

                                                <Button
                                                    className="font-semibold px-5 py-2 rounded-lg bg-blue-400 hover:bg-blue-600 shadow-sm hover:shadow-md text-white transition-all hover:translate-y-[-1px]"
                                                    size="lg"
                                                >
                                                    See More
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>

                                            
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>

                    <div className="text-center mt-16">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-primary text-primary font-bold px-8 py-3 rounded-full shadow hover:bg-primary/10 transition-all"
                        >
                            View All Courses
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}