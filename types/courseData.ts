export interface Course {
    id: string
    title: string
    description: string
    longDescription: string
    duration: string
    level: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Advanced"
    price: string
    originalPrice?: number
    students: number
    rating: number
    reviews: number
    nextClass: string
    instructor: {
        name: string
        role: string
        image: string
        bio: string
        experience: string
        specialties: string[]
    }
    prerequisites: string[]
    whatYouWillLearn: string[]
    curriculum: {
        module: string
        description: string
        duration: string
        lessons: {
            title: string
            duration: string
            type: "video" | "live" | "project" | "quiz"
            description: string
        }[]
    }[]
    tools: string[]
    certificate: boolean
    jobSupport: boolean
    schedule: {
        days: string[]
        time: string
        timezone: string
    }
    testimonials: {
        name: string
        role: string
        company: string
        image: string
        rating: number
        comment: string
    }[]
    faqs: {
        question: string
        answer: string
    }[]
}

export const courses: Course[] = [
    {
        id: "web-design",
        title: "Web Design Course",
        description: "Learn HTML, CSS, JavaScript, Tailwind, Git, GitHub and Vercel from scratch",
        longDescription:
            "Master fundamental of basic web development with our comprehensive courses. From basic HTML to advanced web applications with deployments, you'll build real-world projects and gain the skills needed to become a web developer career.",
        duration: "12 weeks",
        level: "Beginner",
        price: "Free",
        originalPrice: 399,
        students: 1250,
        rating: 4.9,
        reviews: 324,
        nextClass: "January 15, 2024",
        instructor: {
            name: "Pov Sokny",
            role: "Instructor",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Former Senior Developer at Google with 8 years of experience building scalable web applications. Passionate about making complex concepts accessible to everyone.",
            experience: "8 years",
            specialties: ["React", "Next.js", "TypeScript", "Node.js"],
        },
        prerequisites: ["Basic computer skills", "No programming experience required", "Willingness to learn and practice"],
        whatYouWillLearn: [
            "Build responsive websites with HTML, CSS, and JavaScript",
            "Create interactive web applications with React",
            "Develop backend APIs with Node.js and Express",
            "Work with databases (MongoDB and PostgreSQL)",
            "Deploy applications to production",
            "Use Git and GitHub for version control",
            "Implement authentication and security best practices",
            "Build and consume RESTful APIs",
        ],
        curriculum: [
            {
                module: "Web Fundamentals",
                description: "Master the building blocks of web development",
                duration: "3 weeks",
                lessons: [
                    {
                        title: "HTML Structure and Semantics",
                        duration: "2 hours",
                        type: "live",
                        description: "Learn proper HTML structure, semantic elements, and accessibility best practices",
                    },
                    {
                        title: "CSS Styling and Layouts",
                        duration: "2.5 hours",
                        type: "live",
                        description: "Master CSS selectors, flexbox, grid, and responsive design principles",
                    },
                    {
                        title: "JavaScript Fundamentals",
                        duration: "3 hours",
                        type: "live",
                        description: "Variables, functions, objects, arrays, and control structures",
                    },
                    {
                        title: "DOM Manipulation",
                        duration: "2 hours",
                        type: "live",
                        description: "Interactive web pages with JavaScript and the Document Object Model",
                    },
                    {
                        title: "Portfolio Website Project",
                        duration: "4 hours",
                        type: "project",
                        description: "Build your first responsive portfolio website from scratch",
                    },
                ],
            },
            {
                module: "Modern JavaScript",
                description: "Advanced JavaScript concepts and ES6+ features",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "ES6+ Features",
                        duration: "2 hours",
                        type: "live",
                        description: "Arrow functions, destructuring, modules, and template literals",
                    },
                    {
                        title: "Asynchronous JavaScript",
                        duration: "2.5 hours",
                        type: "live",
                        description: "Promises, async/await, and handling API calls",
                    },
                    {
                        title: "JavaScript Testing",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Unit testing with Jest and test-driven development",
                    },
                    {
                        title: "Weather App Project",
                        duration: "3 hours",
                        type: "project",
                        description: "Build a weather application using external APIs",
                    },
                ],
            },
            {
                module: "React Development",
                description: "Build modern user interfaces with React",
                duration: "4 weeks",
                lessons: [
                    {
                        title: "React Fundamentals",
                        duration: "2.5 hours",
                        type: "live",
                        description: "Components, JSX, props, and state management",
                    },
                    {
                        title: "React Hooks",
                        duration: "2 hours",
                        type: "live",
                        description: "useState, useEffect, and custom hooks",
                    },
                    {
                        title: "State Management",
                        duration: "2 hours",
                        type: "live",
                        description: "Context API and Redux for complex applications",
                    },
                    {
                        title: "React Router",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Client-side routing and navigation",
                    },
                    {
                        title: "E-commerce App Project",
                        duration: "6 hours",
                        type: "project",
                        description: "Build a complete e-commerce application with cart functionality",
                    },
                ],
            },
            {
                module: "Backend Development",
                description: "Server-side development with Node.js",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Node.js and Express",
                        duration: "2 hours",
                        type: "live",
                        description: "Server setup, routing, and middleware",
                    },
                    {
                        title: "Database Integration",
                        duration: "2.5 hours",
                        type: "live",
                        description: "Working with MongoDB and PostgreSQL",
                    },
                    {
                        title: "Authentication & Security",
                        duration: "2 hours",
                        type: "live",
                        description: "JWT tokens, password hashing, and security best practices",
                    },
                    {
                        title: "API Development",
                        duration: "2 hours",
                        type: "live",
                        description: "RESTful APIs and API documentation",
                    },
                ],
            },
            {
                module: "Full-Stack Project",
                description: "Capstone project combining all learned skills",
                duration: "1 week",
                lessons: [
                    {
                        title: "Project Planning",
                        duration: "1 hour",
                        type: "live",
                        description: "Requirements gathering and architecture design",
                    },
                    {
                        title: "Full-Stack Application",
                        duration: "8 hours",
                        type: "project",
                        description: "Build a complete social media application with authentication",
                    },
                    {
                        title: "Deployment",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Deploy your application to Vercel and Heroku",
                    },
                    {
                        title: "Code Review & Optimization",
                        duration: "1 hour",
                        type: "live",
                        description: "Performance optimization and code review session",
                    },
                ],
            },
        ],
        tools: ["VS Code", "Git", "GitHub", "Node.js", "React", "MongoDB", "PostgreSQL", "Vercel", "Heroku"],
        certificate: true,
        jobSupport: true,
        schedule: {
            days: ["Monday", "Wednesday", "Friday"],
            time: "7:00 PM - 9:00 PM",
            timezone: "EST",
        },
        testimonials: [
            {
                name: "Jessica Smith",
                role: "Frontend Developer",
                company: "TechCorp",
                image: "/placeholder.svg?height=60&width=60",
                rating: 5,
                comment:
                    "This bootcamp changed my life! I went from zero programming knowledge to landing my first developer job in just 4 months. The live format and personalized attention made all the difference.",
            },
            {
                name: "Michael Rodriguez",
                role: "Full-Stack Developer",
                company: "StartupXYZ",
                image: "/placeholder.svg?height=60&width=60",
                rating: 5,
                comment:
                    "The curriculum is incredibly comprehensive and up-to-date. Sarah is an amazing instructor who explains complex concepts in a way that's easy to understand.",
            },
        ],
        faqs: [
            {
                question: "Do I need any programming experience?",
                answer:
                    "No! This course is designed for complete beginners. We start with the basics and gradually build up to advanced concepts.",
            },
            {
                question: "What if I miss a live session?",
                answer:
                    "All sessions are recorded and available within 2 hours. You can catch up anytime, but we encourage live participation for the best learning experience.",
            },
            {
                question: "Will I be job-ready after this course?",
                answer:
                    "Yes! Our curriculum is designed to make you job-ready. We also provide career coaching, resume reviews, and interview preparation.",
            },
        ],
    },
    {
        id: "ui-ux-design-fundamentals",
        title: "UI/UX Design Fundamentals",
        description: "Master design principles, Figma, and create stunning user interfaces",
        longDescription:
            "Learn the fundamentals of user interface and user experience design. From design theory to practical application in Figma, you'll develop the skills to create beautiful, functional designs.",
        duration: "6 weeks",
        level: "Beginner",
        price: "Free",
        originalPrice: 249,
        students: 650,
        rating: 4.9,
        reviews: 142,
        nextClass: "January 29, 2024",
        instructor: {
            name: "Emily Johnson",
            role: "UI/UX Design Lead",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Design lead at Airbnb with 6 years of experience creating intuitive user experiences. Passionate about accessible design and user research.",
            experience: "6 years",
            specialties: ["Figma", "Design Systems", "User Research", "Prototyping"],
        },
        prerequisites: [
            "No design experience required",
            "Basic computer skills",
            "Creative mindset and attention to detail",
        ],
        whatYouWillLearn: [
            "Design principles and color theory",
            "Typography and layout fundamentals",
            "User research and persona development",
            "Wireframing and prototyping",
            "Figma mastery for design and collaboration",
            "Design systems and component libraries",
            "Usability testing and iteration",
            "Portfolio development and presentation",
        ],
        curriculum: [
            {
                module: "Design Fundamentals",
                description: "Core principles of visual design",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Design Principles",
                        duration: "2 hours",
                        type: "live",
                        description: "Balance, contrast, hierarchy, and visual composition",
                    },
                    {
                        title: "Color Theory and Psychology",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Color wheels, palettes, and emotional impact of colors",
                    },
                    {
                        title: "Typography Fundamentals",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Font selection, hierarchy, and readability principles",
                    },
                    {
                        title: "Layout and Grid Systems",
                        duration: "2 hours",
                        type: "live",
                        description: "Creating structured, balanced layouts",
                    },
                ],
            },
            {
                module: "User Experience Design",
                description: "Understanding users and their needs",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "User Research Methods",
                        duration: "2 hours",
                        type: "live",
                        description: "Interviews, surveys, and user observation techniques",
                    },
                    {
                        title: "Personas and User Journeys",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Creating user personas and mapping user experiences",
                    },
                    {
                        title: "Information Architecture",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Organizing content and navigation structures",
                    },
                    {
                        title: "Wireframing Techniques",
                        duration: "2 hours",
                        type: "live",
                        description: "Low-fidelity and high-fidelity wireframing",
                    },
                ],
            },
            {
                module: "Figma Mastery",
                description: "Professional design tools and workflows",
                duration: "1.5 weeks",
                lessons: [
                    {
                        title: "Figma Fundamentals",
                        duration: "2 hours",
                        type: "live",
                        description: "Interface, tools, and basic design operations",
                    },
                    {
                        title: "Components and Design Systems",
                        duration: "2 hours",
                        type: "live",
                        description: "Creating reusable components and maintaining consistency",
                    },
                    {
                        title: "Prototyping and Interactions",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Creating interactive prototypes and micro-interactions",
                    },
                    {
                        title: "Mobile App Design Project",
                        duration: "4 hours",
                        type: "project",
                        description: "Design a complete mobile app from wireframes to high-fidelity mockups",
                    },
                ],
            },
            {
                module: "Portfolio Development",
                description: "Showcase your design work professionally",
                duration: "0.5 weeks",
                lessons: [
                    {
                        title: "Portfolio Strategy",
                        duration: "1 hour",
                        type: "live",
                        description: "Selecting and presenting your best work",
                    },
                    {
                        title: "Case Study Development",
                        duration: "2 hours",
                        type: "live",
                        description: "Documenting your design process and decisions",
                    },
                    {
                        title: "Portfolio Review",
                        duration: "1 hour",
                        type: "live",
                        description: "Peer feedback and instructor review session",
                    },
                ],
            },
        ],
        tools: ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Miro", "Notion"],
        certificate: true,
        jobSupport: true,
        schedule: {
            days: ["Monday", "Wednesday"],
            time: "6:00 PM - 8:00 PM",
            timezone: "EST",
        },
        testimonials: [
            {
                name: "Sarah Kim",
                role: "UI Designer",
                company: "Design Studio",
                image: "/placeholder.svg?height=60&width=60",
                rating: 5,
                comment:
                    "Emily's teaching style is fantastic. She breaks down complex design concepts into easy-to-understand lessons. My portfolio improved dramatically!",
            },
        ],
        faqs: [
            {
                question: "Do I need design software before starting?",
                answer:
                    "No! We'll guide you through setting up Figma (which is free) and other necessary tools during the first week.",
            },
            {
                question: "Will I have a portfolio by the end?",
                answer:
                    "Yes! You'll complete several projects throughout the course and we'll help you compile them into a professional portfolio.",
            },
        ],
    },
    {
        id: "java",
        title: "Java Programming",
        description: "Learn Java from scratch with basic fundamental and hands-on projects for beginners.",
        longDescription:
            "Take your React skills to the next level with advanced patterns, Next.js features, and production-ready techniques. Perfect for developers who want to build scalable, performant web applications.",
        duration: "8 weeks",
        level: "Beginner",
        price: "Free",
        originalPrice: 329,
        students: 890,
        rating: 4.8,
        reviews: 187,
        nextClass: "January 22, 2024",
        instructor: {
            name: "Marcus Rodriguez",
            role: "Full-Stack Developer & Mentor",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Ex-Netflix engineer with 10 years of experience building scalable applications. Specializes in React ecosystem and modern web development practices.",
            experience: "10 years",
            specialties: ["React", "Next.js", "TypeScript", "Performance Optimization"],
        },
        prerequisites: [
            "Solid JavaScript fundamentals",
            "Basic React knowledge (components, props, state)",
            "Familiarity with HTML and CSS",
        ],
        whatYouWillLearn: [
            "Advanced React patterns and hooks",
            "Next.js 14 features and App Router",
            "Server-side rendering and static generation",
            "Performance optimization techniques",
            "TypeScript integration",
            "Testing strategies for React applications",
            "Deployment and CI/CD pipelines",
            "State management with Zustand and React Query",
        ],
        curriculum: [
            {
                module: "Advanced React Patterns",
                description: "Master complex React patterns and performance optimization",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Advanced Hooks and Custom Hooks",
                        duration: "2 hours",
                        type: "live",
                        description: "useCallback, useMemo, useRef, and building reusable custom hooks",
                    },
                    {
                        title: "Component Composition Patterns",
                        duration: "2 hours",
                        type: "live",
                        description: "Render props, compound components, and higher-order components",
                    },
                    {
                        title: "Performance Optimization",
                        duration: "2.5 hours",
                        type: "live",
                        description: "React.memo, lazy loading, and bundle optimization",
                    },
                    {
                        title: "Advanced State Management",
                        duration: "2 hours",
                        type: "live",
                        description: "Context optimization and external state libraries",
                    },
                ],
            },
            {
                module: "Next.js 14 Deep Dive",
                description: "Master the latest Next.js features and App Router",
                duration: "3 weeks",
                lessons: [
                    {
                        title: "App Router Architecture",
                        duration: "2.5 hours",
                        type: "live",
                        description: "File-based routing, layouts, and nested routes",
                    },
                    {
                        title: "Server Components vs Client Components",
                        duration: "2 hours",
                        type: "live",
                        description: "Understanding the new rendering paradigm",
                    },
                    {
                        title: "Data Fetching Strategies",
                        duration: "2 hours",
                        type: "live",
                        description: "Server-side rendering, static generation, and incremental regeneration",
                    },
                    {
                        title: "API Routes and Server Actions",
                        duration: "2 hours",
                        type: "live",
                        description: "Building APIs and handling form submissions",
                    },
                    {
                        title: "Blog Platform Project",
                        duration: "5 hours",
                        type: "project",
                        description: "Build a full-featured blog with dynamic routing and CMS integration",
                    },
                ],
            },
            {
                module: "TypeScript Integration",
                description: "Add type safety to your React applications",
                duration: "1.5 weeks",
                lessons: [
                    {
                        title: "TypeScript with React",
                        duration: "2 hours",
                        type: "live",
                        description: "Component typing, props interfaces, and event handling",
                    },
                    {
                        title: "Advanced TypeScript Patterns",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Generics, utility types, and conditional types",
                    },
                    {
                        title: "Type-Safe API Integration",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Typing external APIs and data validation",
                    },
                ],
            },
            {
                module: "Testing & Deployment",
                description: "Ensure code quality and deploy with confidence",
                duration: "1.5 weeks",
                lessons: [
                    {
                        title: "Testing React Components",
                        duration: "2 hours",
                        type: "live",
                        description: "Jest, React Testing Library, and testing best practices",
                    },
                    {
                        title: "E2E Testing with Playwright",
                        duration: "1.5 hours",
                        type: "live",
                        description: "End-to-end testing for complete user workflows",
                    },
                    {
                        title: "CI/CD and Deployment",
                        duration: "1.5 hours",
                        type: "live",
                        description: "GitHub Actions, Vercel deployment, and monitoring",
                    },
                    {
                        title: "Final Project Deployment",
                        duration: "2 hours",
                        type: "project",
                        description: "Deploy your project with proper CI/CD pipeline",
                    },
                ],
            },
        ],
        tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Jest", "Playwright", "GitHub Actions"],
        certificate: true,
        jobSupport: true,
        schedule: {
            days: ["Tuesday", "Thursday"],
            time: "8:00 PM - 10:00 PM",
            timezone: "EST",
        },
        testimonials: [
            {
                name: "Alex Johnson",
                role: "Senior Frontend Developer",
                company: "FinTech Solutions",
                image: "/placeholder.svg?height=60&width=60",
                rating: 5,
                comment:
                    "Marcus's expertise in React and Next.js is incredible. The course content is cutting-edge and immediately applicable to real-world projects.",
            },
        ],
        faqs: [
            {
                question: "Is this course suitable for beginners?",
                answer:
                    "This is an intermediate course. You should have basic React knowledge and JavaScript fundamentals before enrolling.",
            },
            {
                question: "Will we cover the latest Next.js features?",
                answer:
                    "Yes! We focus on Next.js 14 and the new App Router, covering all the latest features and best practices.",
            },
        ],
    },
    {
        id: "python",
        title: "Python Programming",
        description: "Learn Python from scratch with core fundamentals and hands-on projects for beginners.",
        longDescription:
            "Master Python programming from the ground up. This course covers everything from basic syntax and data structures to object-oriented programming and real-world projects. Perfect for aspiring developers, data analysts, and anyone looking to automate tasks or break into tech.",
        duration: "8 weeks",
        level: "Beginner",
        price: "Free",
        originalPrice: 329,
        students: 890,
        rating: 4.8,
        reviews: 187,
        nextClass: "January 22, 2024",
        instructor: {
            name: "Marcus Rodriguez",
            role: "Senior Software Engineer & Mentor",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Ex-Netflix engineer with 10 years of experience building scalable applications. Specializes in Python, automation, and modern software development practices.",
            experience: "10 years",
            specialties: ["Python", "Automation", "APIs", "Software Engineering"],
        },
        prerequisites: [
            "Basic computer skills",
            "No prior programming experience required",
            "Willingness to learn and practice",
        ],
        whatYouWillLearn: [
            "Python syntax and core programming concepts",
            "Data types, variables, and control flow",
            "Functions, modules, and packages",
            "Object-oriented programming in Python",
            "File handling and error management",
            "Working with external libraries (requests, pandas, etc.)",
            "Building and consuming REST APIs",
            "Testing, debugging, and deploying Python applications",
        ],
        curriculum: [
            {
                module: "Python Fundamentals",
                description: "Build a strong foundation in Python programming",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Introduction to Python & Setup",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Installing Python, using the REPL, and writing your first script",
                    },
                    {
                        title: "Variables, Data Types, and Operators",
                        duration: "2 hours",
                        type: "live",
                        description: "Numbers, strings, booleans, and basic operations",
                    },
                    {
                        title: "Control Flow: Conditionals and Loops",
                        duration: "2 hours",
                        type: "live",
                        description: "if/else statements, for and while loops, and best practices",
                    },
                    {
                        title: "Functions and Modules",
                        duration: "2 hours",
                        type: "live",
                        description: "Defining functions, arguments, return values, and importing modules",
                    },
                ],
            },
            {
                module: "Data Structures & File Handling",
                description: "Work with lists, dictionaries, and files in Python",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Lists, Tuples, and Sets",
                        duration: "2 hours",
                        type: "live",
                        description: "Storing and manipulating collections of data",
                    },
                    {
                        title: "Dictionaries and Advanced Data Structures",
                        duration: "2 hours",
                        type: "live",
                        description: "Key-value pairs, nested structures, and practical use cases",
                    },
                    {
                        title: "File Input/Output",
                        duration: "2 hours",
                        type: "live",
                        description: "Reading from and writing to files, working with CSV and JSON",
                    },
                    {
                        title: "Mini Project: Data Processing Script",
                        duration: "3 hours",
                        type: "project",
                        description: "Build a script to process and analyze data from files",
                    },
                ],
            },
            {
                module: "Object-Oriented Programming",
                description: "Learn OOP concepts and apply them in Python",
                duration: "1.5 weeks",
                lessons: [
                    {
                        title: "Classes and Objects",
                        duration: "2 hours",
                        type: "live",
                        description: "Defining classes, creating objects, and using attributes/methods",
                    },
                    {
                        title: "Inheritance and Polymorphism",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Extending classes and overriding methods",
                    },
                    {
                        title: "Error Handling and Exceptions",
                        duration: "1.5 hours",
                        type: "live",
                        description: "try/except blocks, custom exceptions, and debugging tips",
                    },
                ],
            },
            {
                module: "APIs, Libraries & Deployment",
                description: "Expand your Python skills with real-world tools and deployment",
                duration: "2 weeks",
                lessons: [
                    {
                        title: "Working with External Libraries",
                        duration: "2 hours",
                        type: "live",
                        description: "Using pip, requests, pandas, and other popular packages",
                    },
                    {
                        title: "Building and Consuming APIs",
                        duration: "2 hours",
                        type: "live",
                        description: "Making HTTP requests, parsing JSON, and simple Flask API",
                    },
                    {
                        title: "Testing and Debugging Python Code",
                        duration: "1.5 hours",
                        type: "live",
                        description: "Unit testing with unittest/pytest and debugging strategies",
                    },
                    {
                        title: "Final Project: Python Application Deployment",
                        duration: "3 hours",
                        type: "project",
                        description: "Build and deploy a Python application to the cloud (Heroku or similar)",
                    },
                ],
            },
        ],
        tools: ["Python", "pip", "VS Code", "Jupyter Notebook", "Flask", "pandas", "requests", "pytest", "GitHub"],
        certificate: true,
        jobSupport: true,
        schedule: {
            days: ["Tuesday", "Thursday"],
            time: "8:00 PM - 10:00 PM",
            timezone: "EST",
        },
        testimonials: [
            {
                name: "Alex Johnson",
                role: "Data Analyst",
                company: "FinTech Solutions",
                image: "/placeholder.svg?height=60&width=60",
                rating: 5,
                comment:
                    "Marcus's expertise in Python is incredible. The course content is practical and immediately applicable to real-world projects. I landed my first data analyst job thanks to this course!",
            },
        ],
        faqs: [
            {
                question: "Is this course suitable for beginners?",
                answer:
                    "Yes! This course is designed for complete beginners. No prior programming experience is required.",
            },
            {
                question: "Will we build real projects in this course?",
                answer:
                    "Absolutely! You'll work on hands-on projects throughout the course, including a final deployment project.",
            },
        ],
    },
]

export function getCourseById(id: string): Course | undefined {
    return courses.find((course) => course.id === id)
}

export function getAllCourses(): Course[] {
    return courses
}
