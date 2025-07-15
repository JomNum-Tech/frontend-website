import { steps } from "@/types/featuredCourses";
import { ArrowRight } from "lucide-react";
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

const stepItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const arrowAnim = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const sectionTitle = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StepToJoinSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
            <div className="container mx-auto px-4 md:px-12">
                {/* Section Header */}
                <motion.div 
                    className="text-center mb-20"
                    variants={sectionTitle}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-blue-700 tracking-tight drop-shadow-sm">
                        How to Get Started
                    </h2>
                    <motion.p 
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Join many of students in just three simple steps
                    </motion.p>
                </motion.div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        className="relative flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-8"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={stepItem}
                                whileHover={{ y: -10 }}
                                className="flex-1 min-w-[260px] max-w-xs flex flex-col items-center text-center relative px-6 py-10 bg-white/90 rounded-3xl shadow-xl border border-blue-200 transition-all duration-300 hover:shadow-2xl overflow-visible mx-auto"
                            >
                                {/* Step Number with enhanced gradient ring and shadow */}
                                <motion.div 
                                    className="relative mb-7"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.div 
                                        className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-300 via-blue-100 to-white blur-2xl opacity-80 -z-10"
                                        animate={{ 
                                            rotate: [0, 360],
                                        }}
                                        transition={{
                                            duration: 15,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                    <div className="w-20 h-20 bg-blue-400 text-primary-foreground rounded-full flex items-center justify-center text-3xl font-extrabold shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-300 ring-4 ring-blue-100">
                                        {step.number}
                                    </div>
                                </motion.div>
                                
                                <h3 className="text-2xl font-extrabold mb-4 text-blue-800 group-hover:text-primary transition-colors duration-200 tracking-tight drop-shadow-sm">
                                    {step.title}
                                </h3>
                                
                                <p className="text-muted-foreground text-lg leading-relaxed mb-2 max-w-xs mx-auto">
                                    {step.description}
                                </p>

                                {/* Arrow connector for steps */}
                                {index < steps.length - 1 && (
                                    <motion.div 
                                        className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20"
                                        variants={arrowAnim}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                    >
                                        <ArrowRight className="w-10 h-10 text-blue-200 group-hover:text-primary transition-colors duration-200 drop-shadow-lg" />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}