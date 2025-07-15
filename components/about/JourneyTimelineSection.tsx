"use client";

import { milestones } from "@/types/aboutUs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const connectorAnim = {
  hidden: { scaleY: 0, opacity: 0 },
  show: { 
    scaleY: 1, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      delay: 0.3
    }
  }
};

export default function JourneyTimelineSection() {
    return (
        <motion.section 
            className="py-24 bg-white"
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
                        Our Journey
                    </motion.h2>
                    <motion.p 
                        className="text-lg lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        variants={headerItem}
                        transition={{ delay: 0.1 }}
                    >
                        From a small idea to a global platform transforming tech education
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="relative max-w-4xl mx-auto"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {/* Timeline vertical line */}
                    <motion.div 
                        className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-100 rounded-full z-0 hidden sm:block"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    />
                    
                    <div className="space-y-12 relative z-10">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start space-x-6 relative group"
                                variants={item}
                            >
                                {/* Timeline dot and connector */}
                                <div className="flex flex-col items-center flex-shrink-0 z-10">
                                    <motion.div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-lg border-4 ${
                                            index === 0
                                                ? "bg-blue-600 text-white border-blue-300"
                                                : "bg-white text-blue-700 border-blue-200"
                                        } group-hover:scale-105 transition-transform duration-200`}
                                        
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {milestone.year}
                                    </motion.div>
                                    {/* Connector line below dot except for last item */}
                                    {index < milestones.length - 1 && (
                                        <motion.div 
                                            className="w-1 h-12 bg-blue-200 mt-1 mb-0 rounded-full hidden sm:block"
                                            variants={connectorAnim}
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                    >
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
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}