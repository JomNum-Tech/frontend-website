import { courses } from "@/types/courseData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Clock, Star } from "lucide-react";
import { Button } from "../ui/button";

import Image from "next/image";

import Link from "next/link";

export default function CourseGridSection() {
    return (
        <>
            <section className="py-20 bg-blue-50">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="hover:shadow-2xl transition-shadow group border border-2 transition-all ease-in-out hover:border-blue-500 border-gray-100 bg-white rounded-2xl overflow-hidden relative"
                                style={{ boxShadow: "0 4px 24px 0 rgba(37, 99, 235, 0.08)" }}
                            >
                                {(course.id === "java" || course.id === "python") ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                                        <span className="text-2xl font-bold text-blue-900">{course.title}</span>
                                        <span className="bg-yellow-400 text-white text-lg font-bold px-6 py-2 rounded-full shadow-md">
                                            Coming Soon
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge className="bg-blue-500 text-white border-0 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {course.level}
                                                </Badge>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-semibold text-blue-900">{course.rating} / </span>
                                                    <span className="text-xs text-blue-400">({course.reviews}) reviews</span>
                                                </div>
                                            </div>
                                            <Link href={`/courses/${course.id}`}>
                                                <CardTitle className="text-lg md:text-xl text-blue-900 group-hover:text-blue-700 transition-colors cursor-pointer hover:underline">
                                                    {course.title}
                                                </CardTitle>
                                            </Link>
                                            <CardDescription className="line-clamp-3 text-gray-500 mt-1 text-sm">
                                                {course.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-0">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-3 text-sm mt-2">
                                                    <div className="flex-shrink-0">
                                                        <Image
                                                            height={100}
                                                            width={100}
                                                            src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/profile_placeholder.png"
                                                            alt={course.instructor.name}
                                                            className="w-8 h-8 rounded-full border border-blue-100 object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-blue-900">{course.instructor.name}</div>
                                                        <div className="text-xs text-gray-500 italic">{course.instructor.role}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-blue-500">
                                                    <div className="flex items-center space-x-1 font-bold">
                                                        <Clock className="w-4 h-4 text-blue-400 " />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center space-x-2">
                                                    {course.originalPrice && (
                                                        <span className="text-sm text-blue-400 line-through">${course.originalPrice}</span>
                                                    )}
                                                    <span className="text-xl md:text-2xl font-bold text-blue-700">{course.price}</span>
                                                </div>
                                                <Link href={`/courses/${course.id}`}>
                                                    <Button className="bg-white hover:bg-blue-700 border border-1 border-gray-200 text-blue-500 hover:bg-blue-100 font-semibold px-4 py-2 rounded-lg flex items-center transition-colors text-sm">
                                                        View Details
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}