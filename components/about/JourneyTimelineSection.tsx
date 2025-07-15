import { milestones } from "@/types/aboutUs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function JourneyTimelineSection() {
    return (
        <>
            <section className="py-24 bg-white">
                <div className="container mx-auto px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight drop-shadow-sm">
                            Our Journey
                        </h2>
                        <p className="text-lg lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            From a small idea to a global platform transforming tech education
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline vertical line */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-100 rounded-full z-0 hidden sm:block" />
                        <div className="space-y-12 relative z-10">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-6 relative group"
                                >
                                    {/* Timeline dot and connector */}
                                    <div className="flex flex-col items-center flex-shrink-0 z-10">
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-lg border-4 ${
                                                index === 0
                                                    ? "bg-blue-600 text-white border-blue-300"
                                                    : "bg-white text-blue-700 border-blue-200"
                                            } group-hover:scale-105 transition-transform duration-200`}
                                        >
                                            {milestone.year}
                                        </div>
                                        {/* Connector line below dot except for last item */}
                                        {index < milestones.length - 1 && (
                                            <div className="w-1 h-12 bg-blue-200 mt-1 mb-0 rounded-full hidden sm:block" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Card className="bg-white/95 border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-200 rounded-3xl p-6">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-2xl font-bold text-blue-800 mb-1 drop-shadow-sm">
                                                    {milestone.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-base text-gray-700 leading-relaxed">
                                                    {milestone.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}