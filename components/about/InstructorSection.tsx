"use client";

import { instructors } from "@/types/aboutUs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const headerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function InstructorSection() {
    return (
        <motion.section 
            className="py-24 bg-blue-50"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="container mx-auto px-12">
                <motion.div 
                    className="text-center mb-20"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <motion.h2 
                        className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight drop-shadow-sm"
                        variants={headerItem}
                    >
                        Meet Our Core Team
                    </motion.h2>
                    <motion.p 
                        className="text-lg italic lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        variants={headerItem}
                        transition={{ delay: 0.1 }}
                    >
                        Learn from who have experience built products used by many users and are passionate about teaching
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {instructors.map((instructor, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -10 }}
                        >
                            <Card
                                className="group h-full flex flex-col items-center justify-between bg-white/95 border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-200 rounded-3xl p-8 relative overflow-hidden"
                            >
                                {/* Animated decorative gradient accent */}
                                <motion.div 
                                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-30 rounded-full blur-2xl z-0 pointer-events-none"
                                    
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                />
                                
                                <CardHeader className="flex flex-col items-center z-10">
                                    <motion.div 
                                        className="relative mb-5"
                                        
                                    >
                                        <Avatar className="w-24 h-24 border-4 border-blue-100 shadow-lg group-hover:border-blue-300 transition-all duration-200">
                                            <AvatarImage src={instructor.image || "/placeholder.svg"} alt={instructor.name} />
                                            <AvatarFallback>
                                                {instructor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <motion.div 
                                            className="absolute -bottom-2 -right-2"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="bg-yellow-100 text-yellow-700 border-0 px-2 py-1 text-xs font-semibold shadow"
                                            >
                                                <span>🔥</span>
                                            </Badge>
                                        </motion.div>
                                    </motion.div>
                                    
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

                                    <motion.div 
                                        className="flex flex-wrap gap-2 justify-center mb-4"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        viewport={{ once: true }}
                                    >
                                        {instructor.specialties.map((specialty, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="text-xs px-2 py-1 border-blue-200 bg-blue-50 text-blue-700 font-medium"
                                            >
                                                {specialty}
                                            </Badge>
                                        ))}
                                    </motion.div>

                                    <motion.div 
                                        className="flex justify-center gap-2 items-center mb-4"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="text-xl font-bold text-blue-700">{instructor.experience}</div>
                                        <div className="text-xs text-muted-foreground">Experience</div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}