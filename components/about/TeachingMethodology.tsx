import { Award, Code, Laptop, Users } from "lucide-react";
import Image from "next/image";

export default function TeachingMethodoloySection() {
    return (
        <>
            <section className="py-24 bg-gradient-to-b from-blue-50 via-white to-blue-100">
                <div className="container mx-auto px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight drop-shadow-sm">
                            Our Teaching Methodology
                        </h2>
                        <p className="text-lg lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            We have refined our approach based on thousands of hours of live teaching and student feedback.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            {[
                                {
                                    icon: <Code className="w-7 h-7 text-blue-700 group-hover:text-blue-900 transition-colors duration-200" />,
                                    title: "Online Teaching Sessions",
                                    desc: "Watch instructors code in real-time, see their thought process, and learn debugging techniques that you can’t get from pre-recorded videos.",
                                    accent: "from-blue-100 via-blue-200 to-blue-300"
                                },
                                {
                                    icon: <Users className="w-7 h-7 text-blue-700 group-hover:text-blue-900 transition-colors duration-200" />,
                                    title: "Interactive Q&A",
                                    desc: "Ask questions the moment they arise. Our instructors pause to address every question, ensuring no one gets left behind.",
                                    accent: "from-green-100 via-green-200 to-blue-200"
                                },
                                {
                                    icon: <Laptop className="w-7 h-7 text-blue-700 group-hover:text-blue-900 transition-colors duration-200" />,
                                    title: "Hands-on Projects",
                                    desc: "Build real applications during class with guidance. Every project is designed to reinforce concepts and build your portfolio.",
                                    accent: "from-yellow-100 via-yellow-200 to-blue-200"
                                },
                                {
                                    icon: <Award className="w-7 h-7 text-blue-700 group-hover:text-blue-900 transition-colors duration-200" />,
                                    title: "Personalized Feedback",
                                    desc: "Get individual code reviews and career guidance. Our small class sizes ensure everyone receives personalized attention.",
                                    accent: "from-pink-100 via-pink-200 to-blue-200"
                                }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group flex items-start space-x-5 bg-white/90 border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-200 rounded-2xl p-6 relative overflow-hidden"
                                >
                                    {/* Decorative gradient accent */}
                                    <div className={`absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br ${item.accent} opacity-30 rounded-full blur-2xl z-0 pointer-events-none`} />
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 group-hover:from-blue-200 group-hover:to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white z-10 transition-colors duration-200">
                                        {item.icon}
                                    </div>
                                    <div className="z-10">
                                        <h3 className="text-2xl font-bold mb-2 text-blue-800 drop-shadow-sm">{item.title}</h3>
                                        <p className="text-base text-gray-700 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative flex justify-center items-center">
                            <div className="relative">
                                <Image
                                    src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                                    alt="Live coding session"
                                    width={600}
                                    height={500}
                                    className="rounded-3xl shadow-2xl border-4 border-blue-100"
                                    priority
                                />
                                <div className="absolute -top-7 -left-7 bg-white/95 p-4 rounded-xl shadow-xl border border-blue-200 flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-base font-semibold text-blue-700">Online Teaching</span>
                                </div>
                                {/* Decorative floating accent */}
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-30 rounded-full blur-2xl z-0 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}