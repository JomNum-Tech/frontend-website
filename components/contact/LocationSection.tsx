"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
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

const titleItem = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function LocationSection() {
    return (
        <motion.section 
            className="py-20 bg-gradient-to-b from-blue-50 via-white to-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
        >
            <div className="container mx-auto px-12">
                <motion.div 
                    className="text-center mb-16"
                    variants={titleItem}
                >
                    <h2 className="text-4xl font-extrabold mb-3 text-blue-700 drop-shadow-sm">
                        Our Location
                    </h2>
                    <motion.p 
                        className="text-lg text-blue-900/80"
                        variants={item}
                    >
                        We are proudly based in Cambodia, with our office located in Phnom Penh city.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="flex justify-center"
                    variants={item}
                >
                    <Card 
                        className="text-center max-w-md w-full border-blue-100 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-shadow" 
                        style={{ borderWidth: 2 }}
                        
                    >
                        <CardHeader>
                            <motion.div 
                                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                            >
                                <MapPin className="w-8 h-8 text-white" />
                            </motion.div>
                            <CardTitle className="text-2xl text-blue-800 font-semibold">Office</CardTitle>
                            <CardDescription className="text-blue-700/80">Phnom Penh, Cambodia</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <motion.p 
                                className="text-blue-900/80 mb-4"
                                variants={item}
                            >
                                Our team operates from Phnom Penh, serving students across Cambodia with dedicated local support.
                            </motion.p>
                            <motion.div 
                                className="text-sm"
                                variants={item}
                            >
                                <div className="font-medium text-blue-700">Support Hours:</div>
                                <div className="text-blue-900/80">8 AM - 8 PM (Cambodia Time)</div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.section>
    )
}