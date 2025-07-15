"use client";

import { stats } from "@/types/aboutUs";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const headerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function StatSection() {
    return (
        <motion.section 
            className="py-20 bg-blue-50"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
        >
            <div className="container mx-auto px-12">
                <motion.div 
                    className="mb-12 text-center"
                    variants={container}
                >
                    <motion.h2 
                        className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight text-blue-700"
                        variants={headerItem}
                    >
                        Our Impact in Numbers
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-gray-500 max-w-2xl mx-auto"
                        variants={headerItem}
                        transition={{ delay: 0.1 }}
                    >
                        We are proud of the milestones we have achieved together with our students and community.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="group bg-white/80 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col items-center justify-center border border-blue-200 hover:border-blue-400"
                        >
                            <motion.div 
                                className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200"
                                
                            >
                                <stat.icon className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                            </motion.div>
                            <motion.div 
                                className="text-3xl lg:text-4xl font-extrabold mb-1 text-blue-700 group-hover:text-blue-800 transition-colors duration-200"
                                
                                transition={{ delay: 0.1 }}
                            >
                                {stat.number}
                            </motion.div>
                            <motion.div 
                                className="text-base text-blue-600 font-medium text-center"
                                
                                transition={{ delay: 0.2 }}
                            >
                                {stat.label}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}