"use client";

import Link from "next/link";
import Image from "next/image";
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const logoAnim = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const quoteAnim = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
};

const copyrightAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Footer() {
    return (
        <footer className="border-t bg-gradient-to-br from-blue-50 via-white to-blue-100/60 py-16">
            <div className="container mx-auto px-4 md:px-12">
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-10"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Brand & Description */}
                    <div>
                        <motion.div 
                            className="flex items-center space-x-4 mb-6"
                            variants={logoAnim}
                        >
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl bg-white/80 border border-blue-100">
                                <Image
                                    src="https://7zg3rv0nfdklwx5q.public.blob.vercel-storage.com/jomnum-tech/JomNumTech-El1XBQ46OC1eci4SAFFyiOAM6nikG1.png"
                                    height={64}
                                    width={64}
                                    alt="Logo"
                                    className="rounded-xl"
                                />
                            </div>
                            <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">JomNum-Tech</span>
                        </motion.div>
                        <motion.blockquote 
                            className="border-l-4 border-blue-400 pl-4 italic text-blue-900 bg-blue-50/80 py-3 pr-3 rounded-lg shadow max-w-xs text-base leading-relaxed"
                            variants={quoteAnim}
                        >
                            <span className="font-semibold">Moving Forward</span>
                            <br />
                            <span>Together In the Age of Technology</span>
                        </motion.blockquote>
                    </div>

                    {/* Courses */}
                    <motion.div variants={item}>
                        <h4 className="font-semibold mb-5 text-blue-800 tracking-wide uppercase text-xs letter-spacing-wider">Courses</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Web Design
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    UI/UX Design
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Java Programming
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Python Programming
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Support */}
                    <motion.div variants={item}>
                        <h4 className="font-semibold mb-5 text-blue-800 tracking-wide uppercase text-xs letter-spacing-wider">Support</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Company */}
                    <motion.div variants={item}>
                        <h4 className="font-semibold mb-5 text-blue-800 tracking-wide uppercase text-xs letter-spacing-wider">Team</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-blue-600 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="border-t mt-12 pt-8 text-center text-muted-foreground text-sm"
                    variants={copyrightAnim}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <p>
                        &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">JomNum-Tech</span>. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer;