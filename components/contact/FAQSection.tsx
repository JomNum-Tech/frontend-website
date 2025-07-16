"use client";

import { faqs } from "@/types/contactUs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { HelpCircle, MessageCircle } from "lucide-react";
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

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const titleItem = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function FAQSection() {
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
                        Frequently Asked Questions
                    </h2>
                    <motion.p 
                        className="text-lg text-blue-900/80"
                        variants={item}
                    >
                        Quick answers to common questions. Can not find what you are looking for? Contact us!
                    </motion.p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        className="grid md:grid-cols-2 gap-8"
                        variants={container}
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={item}
                                whileHover={{ y: -5 }}
                            >
                                <Card
                                    className="border-blue-100 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                                    style={{ borderWidth: 2 }}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-start space-x-3 text-lg text-blue-800">
                                            <motion.span 
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-2 mt-0.5"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                            </motion.span>
                                            <span>{faq.question}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-blue-900/80">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        className="text-center mt-16"
                        variants={item}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.p 
                            className="text-blue-700 mb-4 text-lg font-medium"
                            variants={item}
                        >
                            Still have questions?
                        </motion.p>
                        <motion.div variants={item}>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
                                
                            >
                                <MessageCircle className="mr-2 w-5 h-5" />
                                Start Live Chat
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}