"use client";

import { CheckCircle, Clock, Globe } from "lucide-react";
import { Badge } from "../ui/badge";
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

export default function HeroSection() {
    return (
        <motion.section 
            className="py-20 lg:py-32 bg-gradient-to-b from-blue-50 via-white to-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
        >
            <div className="container mx-auto px-12">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div variants={item}>
                        <Badge
                            variant="secondary"
                            className="mb-6 bg-blue-100 text-blue-700 border-blue-200"
                        >
                            Get in Touch
                        </Badge>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6"
                        variants={titleItem}
                    >
                        We are Here to{" "}
                        <motion.span 
                            className="text-blue-600 drop-shadow-sm"
                            variants={item}
                        >
                            Help You Succeed
                        </motion.span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-blue-900/80 mb-10 max-w-3xl mx-auto"
                        variants={item}
                        transition={{ delay: 0.2 }}
                    >
                        Have questions about our courses? Need technical support? Want to discuss partnerships? Our team is ready
                        to assist you every step of the way.
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-base font-medium"
                        variants={item}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div 
                            className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition"
                            variants={item}
                        >
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span className="text-blue-700">Live Chat</span>
                        </motion.div>
                        <motion.div 
                            className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition"
                            variants={item}
                        >
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                            <span className="text-blue-700">Email response</span>
                        </motion.div>
                        <motion.div 
                            className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition"
                            variants={item}
                        >
                            <Globe className="w-5 h-5 text-blue-500" />
                            <span className="text-blue-700">Local support</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}