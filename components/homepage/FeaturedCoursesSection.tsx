import { featuredCourses } from "@/types/featuredCourses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const comingSoonCard = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const sectionTitle = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function FeaturedCoursesSection() {
    return (
        <section id="courses" className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-12">
                {/* Section Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="show"
                    variants={sectionTitle}
                    viewport={{ once: true, margin: "-50px" }}
                >
                    <h2 className="text-4xl lg:text-5xl text-blue-600 font-extrabold mb-4 tracking-tight drop-shadow-sm">
                        Featured Courses
                    </h2>
                    <motion.p 
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Choose from our most popular live courses designed by industry experts
                    </motion.p>
                </motion.div>

                {/* Courses Grid */}
                <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {featuredCourses.map((course, index) =>
                        course.comingSoon ? (
                            <motion.div
                                key={course.id + "-coming-soon"}
                                variants={comingSoonCard}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Card
                                    className="relative group border-0 shadow-xl rounded-2xl bg-gradient-to-br from-blue-200/80 via-blue-100/80 to-white/80 transition-all duration-300 overflow-hidden flex flex-col justify-center items-center min-h-[370px]"
                                    style={{ minHeight: "370px" }}
                                >
                                    <div className="absolute inset-0 bg-blue-900/70 flex flex-col justify-center items-center z-10">
                                        <motion.span 
                                            className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg mb-4 animate-pulse tracking-widest uppercase"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            Coming Soon
                                        </motion.span>
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key={course.id}
                                variants={cardItem}
                                whileHover={{ y: -5 }}
                                custom={index}
                            >
                                <Card
                                    className="relative group border border-2 border-transparent shadow-lg hover:shadow-xl rounded-xl bg-white transition-all duration-300 hover:border-blue-500 overflow-hidden flex flex-col h-full"
                                    style={{ minHeight: "370px" }}
                                >
                                    {/* Card Header with improved hierarchy */}
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="uppercase tracking-wide text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20"
                                                >
                                                    {course.level}
                                                </Badge>
                                            </motion.div>
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
                                            <motion.div 
                                                className="grid grid-cols-1 gap-3 text-sm"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                viewport={{ once: true }}
                                            >
                                                <div className="flex gap-2 items-center space-x-2 bg-gray-50 p-4 rounded-lg">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <div className="text-xs text-gray-500">Duration</div>
                                                        <span className="font-medium text-gray-700">{course.duration}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Price and CTA section */}
                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <motion.div
                                                    whileHover={{ scale: 1.03 }}
                                                >
                                                    <div className="text-xs text-gray-500 mb-1">Price</div>
                                                    <div className="text-xl font-extrabold text-green-500 flex items-center">
                                                        {course.price}
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        className="font-semibold px-5 py-2 rounded-lg bg-blue-400 hover:bg-blue-600 shadow-sm hover:shadow-md text-white transition-all"
                                                        size="lg"
                                                    >
                                                        See More
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    )}
                </motion.div>

                {/* View All Button */}
                <motion.div 
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-primary text-primary font-bold px-8 py-3 rounded-full shadow hover:bg-primary/10 transition-all"
                        
                    >
                        View All Courses
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}