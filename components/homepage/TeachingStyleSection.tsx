import { CheckCircle, Star, Users, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const testimonialAnim = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const starAnim = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export default function TeachingStyleSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-12">
                {/* Section Header */}
                <motion.div 
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-700 tracking-tight drop-shadow-sm">
                        Interactive Live Learning Experience
                    </h2>
                    <motion.p 
                        className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        We teach <span className="font-semibold text-blue-600">online</span> on Google Meet, interactively, with guidance explanation.
                    </motion.p>
                </motion.div>

                {/* Feature Cards */}
                <motion.div 
                    className="grid md:grid-cols-3 gap-10 mb-20"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div variants={item}>
                        <Card className="text-center shadow-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100/60 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden rounded-2xl">
                            <motion.div 
                                className="absolute -top-8 -left-8 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl z-0"
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 2 }}
                            />
                            <CardHeader className="relative z-10 pb-2">
                                <motion.div 
                                    className="flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition p-4 shadow-lg border-2 border-blue-200">
                                        <Video className="w-10 h-10 text-primary" />
                                    </span>
                                </motion.div>
                                <CardTitle className="text-xl font-extrabold text-blue-800 tracking-tight">Online Sessions</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 px-6 pb-6">
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    Real-time classes via <span className="italic text-blue-600 font-semibold">Google Meet</span> with screen sharing, live coding, and instant Q&amp;A.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="text-center shadow-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100/60 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden rounded-2xl">
                            <motion.div 
                                className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl z-0"
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 2 }}
                            />
                            <CardHeader className="relative z-10 pb-2">
                                <motion.div 
                                    className="flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition p-4 shadow-lg border-2 border-blue-200">
                                        <Users className="w-10 h-10 text-primary" />
                                    </span>
                                </motion.div>
                                <CardTitle className="text-xl font-extrabold text-blue-800 tracking-tight">Small Class Sizes</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 px-6 pb-6">
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    Maximum <span className="italic text-blue-600 font-semibold">20 students</span> per class, ensuring quality over quantity and more personalized attention.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="text-center shadow-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100/60 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden rounded-2xl">
                            <motion.div 
                                className="absolute -top-8 -right-8 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl z-0"
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 2 }}
                            />
                            <CardHeader className="relative z-10 pb-2">
                                <motion.div 
                                    className="flex items-center justify-center mb-4"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition p-4 shadow-lg border-2 border-blue-200">
                                        <CheckCircle className="w-10 h-10 text-primary" />
                                    </span>
                                </motion.div>
                                <CardTitle className="text-xl font-extrabold text-blue-800 tracking-tight">Hands-on Projects</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 px-6 pb-6">
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    Build <span className="italic text-blue-600 font-semibold">final projects</span> after class, with instructor guidance and peer collaboration for real-world experience.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                
            </div>
        </section>
    )
}