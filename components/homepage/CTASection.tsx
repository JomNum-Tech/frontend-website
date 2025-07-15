import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function CTASection() {
    return (
        <>
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative blurred background */}
                
                <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-blue-300/20 rounded-full blur-2xl z-0" />
                <div className="container mx-auto px-4 md:px-12 relative z-10">
                    <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-primary-foreground shadow-2xl border-0 rounded-3xl">
                        <CardContent className="p-12 md:p-16 text-center flex flex-col items-center">
                            <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight drop-shadow-sm">
                                Ready to Start Your Coding Journey?
                            </h2>
                            <p className="text-lg md:text-2xl opacity-95 mb-10 max-w-2xl mx-auto font-medium">
                                Join our online class and learn from experience experts in an interactive, supportive environment.<br />
                                <span className="font-semibold text-yellow-300">Limited seats available!</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
                                <Button
                                    size="lg"
                                    variant="default"
                                    className="text-lg px-12 py-5 rounded-lg border border-1 border-blue-400 font-bold bg-blue-400 hover:bg-blue-400 shadow-2xl transition-all duration-200 flex items-center justify-center focus:ring-2 focus:ring-white-500"
                                >
                                    <Globe className="mr-3 w-6 h-6" />
                                    <span className="tracking-wide">Browse Courses</span>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-12 py-5 rounded-lg border-1 border-yellow-300 text-yellow-300 bg-white/10 hover:bg-yellow-300 hover:text-primary font-bold shadow-2xl transition-all duration-200 focus:ring-2 focus:ring-yellow-200"
                                >
                                    <span className="tracking-wide">Contact For Learning</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    )
}