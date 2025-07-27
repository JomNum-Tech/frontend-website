import { ArrowRight, Book, Play } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

import Link from "next/link";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const statsAnim = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function HeaderSection() {
  return (
    <section className="py-24 lg:py-36 bg-gradient-to-br from-blue-50 via-white to-blue-100/60">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div 
            className="space-y-10"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Title Heading */}
            <motion.div className="space-y-5" variants={container}>
              <motion.div variants={item}>
                <Badge variant="secondary" className="w-fit px-4 py-2 text-base bg-white text-primary border-primary/20 font-semibold shadow-sm animate-pulse">
                  <span className="mr-2">✨</span> Online Classes Teaching
                </Badge>
              </motion.div>
              <motion.h1 
                variants={item}
                className="text-4xl lg:text-6xl font-extrabold tracking-tight text-blue-700 drop-shadow-sm leading-tight"
              >
                Master Web Design &amp; Coding with <br/><span className="text-primary underline decoration-4 decoration-blue-300 underline-offset-4">JomNum-Tech</span>
              </motion.h1>
              <motion.p 
                variants={item}
                className="text-lg md:text-2xl text-muted-foreground max-w-xl"
              >
                Taught by experience instructor. <span className="font-semibold text-blue-700">Learn by doing</span> with online sessions and guidance explanation.
              </motion.p>
            </motion.div>

            {/* Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center"
              variants={container}
            >
              <motion.div variants={item}>
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-5 rounded-md font-bold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transition-all duration-200"
                  
                  >
                    View Courses
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={item}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-5 rounded-md border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold shadow"
                  
                >
                  <Book className="mr-2 w-5 h-5" />
                  Visit Documentation
                </Button>
              </motion.div>
            </motion.div>

            
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div 
            className="relative flex justify-center items-center"
            
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl z-0" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl z-0" />
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                alt="Live online learning"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl border-4 border-white relative z-10"
                priority
              />
            </motion.div>
            <motion.div 
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/95 p-4 rounded-xl shadow-xl border border-blue-100 flex items-center gap-3 z-20 min-w-[370px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-900">New Course Teaching: <span className="text-primary font-bold">UX/UI & Web Design</span></span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}