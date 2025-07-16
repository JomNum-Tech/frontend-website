"use client";

import { contactMethods } from "@/types/contactUs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
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

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const titleItem = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function ContactMethodSection() {
    return (
        <motion.section 
            className="py-20 bg-gradient-to-b from-blue-50 via-white to-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
        >
            <div className="container mx-auto px-12">
                <motion.div className="text-center mb-14" variants={titleItem}>
                    <h2 className="text-4xl font-extrabold mb-3 text-blue-700 drop-shadow-sm">
                        Choose Your Preferred Contact Method
                    </h2>
                    <motion.p 
                        className="text-lg text-blue-900/80"
                        variants={item}
                    >
                        We offer multiple ways to get in touch based on your needs
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                >
                    {contactMethods.map((method, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                        >
                            <Card
                                className="hover:shadow-xl transition-shadow border-blue-100 bg-white/90 rounded-2xl"
                                style={{ borderWidth: 2 }}
                            >
                                <CardHeader className="text-center">
                                    <motion.div
                                        className={`w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <method.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <CardTitle className="text-xl text-blue-800 font-semibold">{method.title}</CardTitle>
                                    <CardDescription className="text-blue-700/80">{method.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-blue-700">Available:</span>{" "}
                                            <span className="text-blue-900">{method.available}</span>
                                        </div>                                       
                                    </div>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
                                        variant="default"
                                    >
                                        {method.action}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}