import { Heart, Lightbulb, MessageCircle, Star, Target, Users, Video } from "lucide-react"

export const instructors = [
    {
        name: "Ing Davann",
        role: "Founder",
        experience: "8 years",
        specialties: ["React", "Next.js", "TypeScript"],
        bio: "Former Senior Developer at Google, passionate about making complex concepts accessible to everyone.",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        name: "Pov Sokny",
        role: "Co-Founder",
        experience: "10 years",
        specialties: ["Node.js", "Python", "AWS"],
        bio: "Ex-Netflix engineer who loves building scalable applications and mentoring the next generation.",
        image: "https://ijewzjgscgbar55p.public.blob.vercel-storage.com/image.JPG",
    },
    {
        name: "Sol Vathanak",
        role: "Co-Founder",
        experience: "6 years",
        specialties: ["Figma", "Design Systems", "User Research"],
        bio: "Design lead at Airbnb, focused on creating intuitive and beautiful user experiences.",
        image: "/placeholder.svg?height=200&width=200",
    },
    {
        name: "Seng Porkeat",
        role: "Member",
        experience: "12 years",
        specialties: ["Microservices", "Docker", "Kubernetes"],
        bio: "Principal Engineer at Stripe, specializing in scalable backend systems and cloud architecture.",
        image: "/placeholder.svg?height=200&width=200",
    },
]

export const values = [
    {
        icon: Heart,
        title: "Student-First Approach",
        description: "Every decision we make prioritizes student success and learning outcomes above all else.",
    },
    {
        icon: Target,
        title: "Practical Learning",
        description: "We focus on real-world skills and projects that directly translate to career success.",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Learning is better together. We foster a supportive community of learners and mentors.",
    },
    {
        icon: Lightbulb,
        title: "Innovation in Education",
        description: "We constantly evolve our teaching methods to provide the most effective learning experience.",
    },
]

export const milestones = [
    {
        year: "2020",
        title: "Founded JomNum-Tech",
        description: "Started with a vision to make quality tech education accessible through live, interactive classes.",
    },
    {
        year: "2021",
        title: "First 1,000 Students",
        description: "Reached our first major milestone with students from 25+ countries joining our live classes.",
    },
    {
        year: "2022",
        title: "Industry Partnerships",
        description: "Partnered with leading tech companies to provide direct pathways to employment for graduates.",
    },
    {
        year: "2023",
        title: "5,000+ Success Stories",
        description: "Celebrated over 5,000 students who successfully transitioned into tech careers.",
    },
    {
        year: "2024",
        title: "Global Expansion",
        description: "Expanded to serve students across all time zones with 24/7 live class availability.",
    },
]

export const stats = [
    { number: "50+", label: "Students Taught", icon: Users },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "24/7", label: "Community Support", icon: MessageCircle },
    { number: "Yes", label: "Online Classes", icon: Video },
]