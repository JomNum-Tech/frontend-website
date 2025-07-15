"use client";

import { Coffee } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const imageItem = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

export default function StorySection() {
    return (
        <motion.section 
            className="py-24 bg-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
        >
            <div className="container mx-auto px-12">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div variants={container}>
                        <motion.h2 
                            className="text-4xl lg:text-5xl font-extrabold mb-8 text-blue-800 tracking-tight"
                            variants={item}
                        >
                            Our Story
                        </motion.h2>
                        
                        <motion.div 
                            className="space-y-7 text-lg lg:text-xl text-gray-600 leading-relaxed"
                            variants={container}
                        >
                            <motion.p variants={item}>
                                <span className="font-semibold text-blue-700">JomNum-Tech</span> was born from a simple observation: traditional online courses were not working. Students
                                were struggling with pre-recorded videos, feeling isolated, and lacking the real-time guidance needed
                                to truly master complex technical skills.
                            </motion.p>
                            <motion.p variants={item}>
                                As experienced developers who had mentored countless junior engineers, we knew there had to be a
                                better way. We envisioned a platform where learning could be as interactive and engaging as working
                                with a senior developer on your team.
                            </motion.p>
                            <motion.p variants={item}>
                                Today, we are proud to have created a learning environment where students do not just watch coding
                                happen—they code alongside industry experts, ask questions in real-time, and build projects that
                                matter.
                            </motion.p>
                        </motion.div>
                        
                        <motion.div 
                            className="mt-10 flex flex-col sm:flex-row gap-4"
                            variants={item}
                            transition={{ delay: 0.2 }}
                        >
                            <Button
                                size="lg"
                                className="rounded-full px-8 py-6 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold shadow-lg transition-all duration-200"
                            >
                                <Coffee className="mr-3 w-6 h-6" />
                                Chat with Founders
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="relative flex justify-center"
                        variants={imageItem}
                    >
                        <div className="relative">
                            <motion.div >
                                <Image
                                    src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                                    alt="Our team working together"
                                    width={600}
                                    height={500}
                                    className="rounded-3xl shadow-2xl border-4 border-blue-100"
                                    priority
                                />
                            </motion.div>
                            
                            <motion.div 
                                className="absolute -bottom-8 -right-8 bg-white/90 p-7 rounded-xl shadow-xl border-2 border-blue-100 flex flex-col items-center min-w-[120px]"
                                
                                transition={{ delay: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-3xl font-extrabold text-blue-700 mb-1">2025</div>
                                <div className="text-base text-gray-500 font-medium">Founded</div>
                            </motion.div>
                            
                            {/* Decorative gradient blob for visual interest */}
                            <motion.div 
                                className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60 z-[-1]"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ 
                                    scale: 1,
                                    opacity: 0.6,
                                    rotate: [0, 360]
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}