"use client";

import { useState } from "react";
import { CheckCircle, ExternalLink, Mail, Send } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { inquiryTypes } from "@/types/contactUs";
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

export default function ContactFormSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        inquiryType: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({
                name: "",
                email: "",
                subject: "",
                inquiryType: "",
                message: "",
            })
        }, 3000)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <motion.section 
            className="py-20 bg-gradient-to-b from-blue-50 via-white to-white"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={container}
        >
            <div className="container mx-auto px-12">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <motion.div variants={container}>
                        <motion.div variants={titleItem}>
                            <h2 className="text-3xl font-extrabold mb-4 text-blue-700 drop-shadow-sm">Send Us a Message</h2>
                            <motion.p 
                                className="text-blue-900/80 mb-8"
                                variants={item}
                            >
                                Fill out the form below and we will get back to you within <span className="font-semibold text-blue-600">2 hours</span> during business hours.
                            </motion.p>
                        </motion.div>

                        {isSubmitted ? (
                            <motion.div variants={item}>
                                <Card className="border-blue-200 bg-blue-50 shadow-lg">
                                    <CardContent className="p-8 text-center">
                                        <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-blue-800 mb-2">Message Sent Successfully!</h3>
                                        <p className="text-blue-700">
                                            Thank you for contacting us. We will respond to your inquiry as soon as possible.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div variants={item}>
                                <Card className="border-blue-200 shadow-lg bg-white/90 rounded-2xl">
                                    <CardContent className="p-8">
                                        <form onSubmit={handleSubmit} className="space-y-7">
                                            <motion.div 
                                                className="grid md:grid-cols-2 gap-6"
                                                variants={container}
                                            >
                                                <motion.div className="space-y-2" variants={item}>
                                                    <Label htmlFor="name" className="text-blue-700 font-medium">Full Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                                        placeholder="Your full name"
                                                        required
                                                        className="focus:ring-2 focus:ring-blue-400 border-blue-200"
                                                    />
                                                </motion.div>
                                                <motion.div className="space-y-2" variants={item}>
                                                    <Label htmlFor="email" className="text-blue-700 font-medium">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        placeholder="your.email@example.com"
                                                        required
                                                        className="focus:ring-2 focus:ring-blue-400 border-blue-200"
                                                    />
                                                </motion.div>
                                            </motion.div>

                                            <motion.div className="space-y-2" variants={item}>
                                                <Label htmlFor="inquiryType" className="text-blue-700 font-medium">Inquiry Type *</Label>
                                                <Select
                                                    value={formData.inquiryType}
                                                    onValueChange={(value) => handleInputChange("inquiryType", value)}
                                                >
                                                    <SelectTrigger className="focus:ring-2 focus:ring-blue-400 border-blue-200">
                                                        <SelectValue placeholder="Select the type of inquiry" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="course">Course Information</SelectItem>
                                                        <SelectItem value="technical">Technical Support</SelectItem>
                                                        <SelectItem value="student">Student Services</SelectItem>
                                                        <SelectItem value="business">Business & Partnerships</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </motion.div>

                                            <motion.div className="space-y-2" variants={item}>
                                                <Label htmlFor="subject" className="text-blue-700 font-medium">Subject *</Label>
                                                <Input
                                                    id="subject"
                                                    value={formData.subject}
                                                    onChange={(e) => handleInputChange("subject", e.target.value)}
                                                    placeholder="Brief description of your inquiry"
                                                    required
                                                    className="focus:ring-2 focus:ring-blue-400 border-blue-200"
                                                />
                                            </motion.div>

                                            <motion.div className="space-y-2" variants={item}>
                                                <Label htmlFor="message" className="text-blue-700 font-medium">Message *</Label>
                                                <Textarea
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                                    placeholder="Please provide details about your inquiry..."
                                                    rows={6}
                                                    required
                                                    className="focus:ring-2 focus:ring-blue-400 border-blue-200"
                                                />
                                            </motion.div>

                                            <motion.div variants={item}>
                                                <Button
                                                    type="submit"
                                                    size="lg"
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition rounded-lg"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 w-4 h-4" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Inquiry Types */}
                    <motion.div variants={container}>
                        <motion.div variants={titleItem}>
                            <h2 className="text-3xl font-extrabold mb-4 text-blue-700 drop-shadow-sm">Direct Contact Options</h2>
                            <motion.p 
                                className="text-blue-900/80 mb-8"
                                variants={item}
                            >
                                For faster assistance, reach out directly to the right department:
                            </motion.p>
                        </motion.div>

                        <motion.div 
                            className="space-y-4"
                            variants={container}
                        >
                            {inquiryTypes.map((type, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card
                                        className="hover:shadow-xl transition-shadow border-blue-100 bg-white/90 rounded-2xl"
                                        style={{ borderWidth: 2 }}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <motion.div 
                                                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <type.icon className="w-6 h-6 text-blue-600" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1 text-blue-800">{type.title}</h3>
                                                    <p className="text-blue-900/80 mb-3">{type.description}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="w-4 h-4 text-blue-600" />
                                                        <a
                                                            href={`mailto:${type.email}`}
                                                            className="text-blue-700 hover:underline font-medium"
                                                        >
                                                            {type.email}
                                                        </a>
                                                        <ExternalLink className="w-3 h-3 text-blue-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}