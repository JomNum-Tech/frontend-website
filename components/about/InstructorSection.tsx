import { instructors } from "@/types/aboutUs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export default function InstructorSection() {
    return (
        <>
            <section className="py-24 bg-blue-50">
                <div className="container mx-auto px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight drop-shadow-sm">
                            Meet Our Core Team
                        </h2>
                        <p className="text-lg italic lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Learn from who have experience built products used by many users and are passionate about teaching
                        </p>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {instructors.map((instructor, index) => (
                            <Card
                                key={index}
                                className="group h-full flex flex-col items-center justify-between bg-white/95 border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-200 rounded-3xl p-8 relative overflow-hidden"
                            >
                                {/* Decorative gradient accent */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-30 rounded-full blur-2xl z-0 pointer-events-none" />
                                <CardHeader className="flex flex-col items-center z-10">
                                    <div className="relative mb-5">
                                        <Avatar className="w-24 h-24 border-4 border-blue-100 shadow-lg group-hover:border-blue-300 transition-all duration-200">
                                            <AvatarImage src={instructor.image || "/placeholder.svg"} alt={instructor.name} />
                                            <AvatarFallback>
                                                {instructor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-yellow-100 text-yellow-700 border-0 px-2 py-1 text-xs font-semibold shadow"
                                            >
                                                <span>🔥</span>
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-extrabold text-blue-800 mb-1 text-center drop-shadow-sm">
                                        {instructor.name}
                                    </CardTitle>
                                    <CardDescription className="text-blue-600 font-medium text-base mb-2 text-center">
                                        {instructor.role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between z-10 w-full">
                                    <p className="text-base text-gray-700 text-center leading-relaxed mb-4 min-h-[60px]">
                                        {instructor.bio}
                                    </p>

                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {instructor.specialties.map((specialty, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="text-xs px-2 py-1 border-blue-200 bg-blue-50 text-blue-700 font-medium"
                                            >
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Align experience info in a single horizontal line for better UX/UI */}
                                    <div className="flex justify-center gap-2 items-center mb-4">
                                        <div className="text-xl font-bold text-blue-700">{instructor.experience}</div>
                                        <div className="text-xs text-muted-foreground">Experience</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}