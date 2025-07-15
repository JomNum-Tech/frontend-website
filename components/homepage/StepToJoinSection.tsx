import { steps } from "@/types/featuredCourses";
import { ArrowRight } from "lucide-react";

export default function StepToJoinSection() {
    return (
        <>
            <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-blue-700 tracking-tight drop-shadow-sm">
                            How to Get Started
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join many of students in just three simple steps
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="relative flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-8">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex-1 min-w-[260px] max-w-xs flex flex-col items-center text-center relative px-6 py-10 bg-white/90 rounded-3xl shadow-xl border border-blue-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group overflow-visible mx-auto"
                                >
                                    {/* Step Number with enhanced gradient ring and shadow */}
                                    <div className="relative mb-7">
                                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-300 via-blue-100 to-white blur-2xl opacity-80 -z-10" />
                                        <div className="w-20 h-20 bg-blue-400 text-primary-foreground rounded-full flex items-center justify-center text-3xl font-extrabold shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-300 ring-4 ring-blue-100">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-extrabold mb-4 text-blue-800 group-hover:text-primary transition-colors duration-200 tracking-tight drop-shadow-sm">{step.title}</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed mb-2 max-w-xs mx-auto">{step.description}</p>

                                    {/* Arrow connector for steps */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20">
                                            <ArrowRight className="w-10 h-10 text-blue-200 group-hover:text-primary transition-colors duration-200 drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}