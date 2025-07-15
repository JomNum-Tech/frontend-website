"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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
            className="py-24 bg-gradient-to-b from-background via-muted/40 to-background"
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
                            className="mb-8 px-4 py-2 rounded-full text-base font-medium tracking-wide bg-blue-100 text-blue-700 border-0 shadow-sm"
                        >
                            About JomNum-Tech
                        </Badge>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight"
                        variants={titleItem}
                    >
                        <motion.span 
                            className="text-blue-700 bg-blue-100 px-2 rounded"
                            
                        >
                            Moving Forward
                        </motion.span>
                        <br />
                        Together In the Age of Technology{" "}
                    </motion.h1>
                    
                    <motion.p 
                        className="text-lg lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                        variants={item}
                        transition={{ delay: 0.2 }}
                    >
                        Together, Everyone, Achieves, More
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={item}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 rounded-full font-semibold border-2 border-blue-200 bg-white/80 hover:bg-blue-50 text-blue-700 transition-all duration-200 shadow"
                        >
                            Meet Our Team
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}