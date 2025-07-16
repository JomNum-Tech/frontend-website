import { Briefcase, GraduationCap, Headphones, Mail, MessageCircle, Phone, Users } from "lucide-react"

export const contactMethods = [
    {
        icon: MessageCircle,
        title: "Live Chat",
        description: "Get instant help from our support team",
        action: "Start Chat",
        available: "Local",
        response: "Immediate",
        color: "bg-green-500",
    },
    {
        icon: Mail,
        title: "Email Support",
        description: "Send us a detailed message",
        action: "contact@jomnumtech.com",
        available: "Always",
        response: "Within 2 hours",
        color: "bg-blue-500",
    },
    {
        icon: Phone,
        title: "Phone Support",
        description: "Speak directly with our team",
        action: "+1 (555) 123-4567",
        available: "Mon-Fri 9AM-6PM EST",
        response: "Immediate",
        color: "bg-purple-500",
    }
]

export const inquiryTypes = [
    {
        icon: GraduationCap,
        title: "Course Information",
        description: "Questions about curriculum, pricing, and enrollment",
        email: "courses@livelearn.com",
    },
    {
        icon: Headphones,
        title: "Technical Support",
        description: "Help with platform access, Google Meet, or technical issues",
        email: "support@livelearn.com",
    },
    {
        icon: Users,
        title: "Student Services",
        description: "Current student support, certificates, and progress tracking",
        email: "students@livelearn.com",
    },
    {
        icon: Briefcase,
        title: "Partnerships & Business",
        description: "Corporate training, partnerships, and business inquiries",
        email: "business@livelearn.com",
    },
]

export const faqs = [
    {
        question: "How do I join a live class?",
        answer:
            "After enrollment, you'll receive Google Meet links via email 30 minutes before each class. Simply click the link to join!",
    },
    {
        question: "What if I miss a live session?",
        answer:
            "All live sessions are recorded and available within 2 hours. You can catch up anytime through your student dashboard.",
    },
    {
        question: "Do you offer refunds?",
        answer: "Yes! We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
    },
    {
        question: "Can I switch courses after enrollment?",
        answer:
            "Contact our student services team within the first week to switch to a different course at no extra cost.",
    },
    {
        question: "What are the technical requirements?",
        answer:
            "You need a stable internet connection, a computer with a webcam/microphone, and a modern web browser. That's it!",
    },
    {
        question: "Do you provide job placement assistance?",
        answer:
            "Yes! We offer career coaching, resume reviews, interview prep, and direct connections to our hiring partners.",
    },
]

export const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST", type: "Full Support" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST", type: "Limited Support" },
    { day: "Sunday", hours: "12:00 PM - 4:00 PM EST", type: "Emergency Only" },
]