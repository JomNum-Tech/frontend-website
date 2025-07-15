"use client"

import { values } from "@/types/aboutUs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

export default function ValueSection() {
    return (
        <motion.section 
            className="py-24 bg-gradient-to-b from-muted/60 via-white to-muted/40"
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
                        className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight"
                        variants={headerItem}
                    >
                        Our Values
                    </motion.h2>
                    <motion.p 
                        className="text-lg lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        variants={headerItem}
                        transition={{ delay: 0.1 }}
                    >
                        These core principles guide everything we do and shape the learning experience we create.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {values.map((value, index) => (
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
                                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-full blur-2xl z-0 pointer-events-none"
                                    
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                />
                                
                                <CardHeader className="flex flex-col items-center z-10">
                                    <motion.div 
                                        className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 group-hover:from-blue-200 group-hover:to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg transition-colors duration-200 border-2 border-white"
                                        
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <value.icon className="w-9 h-9 text-blue-700 group-hover:scale-110 group-hover:text-blue-900 transition-transform duration-200" />
                                    </motion.div>
                                    
                                    <CardTitle className="text-2xl font-extrabold text-blue-800 mb-2 text-center drop-shadow-sm">
                                        {value.title}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="flex-1 flex items-center z-10">
                                    <p className="text-base text-gray-700 text-center leading-relaxed px-2">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}