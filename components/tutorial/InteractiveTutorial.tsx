"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  Users,
  BookOpen,
  Cloud,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  action?: "click" | "hover" | "scroll";
  icon: React.ReactNode;
  category: "navigation" | "features" | "account" | "learning";
  illustration?: string;
  tips?: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to JomNum-Tech! 🎉",
    description:
      "Let's take a quick tour to help you get started with our learning platform. This interactive guide will show you all the amazing features we have to offer!",
    target: "body",
    position: "top",
    icon: <Play className="h-5 w-5" />,
    category: "navigation",
    illustration: "🚀",
    tips: ["Takes only 2 minutes", "Skip anytime", "Interactive experience"],
  },
  {
    id: "logo",
    title: "🏠 JomNum-Tech Walkthrough",
    description:
      "Click on our logo anytime to return to the homepage. This is your starting point for all learning activities. Think of it as your home base!",
    target: "[data-tutorial='logo']",
    position: "bottom",
    action: "click",
    icon: <Target className="h-5 w-5" />,
    category: "navigation",
    illustration: "🏠",
    tips: ["Always accessible", "Quick navigation", "Your home base"],
  },
  {
    id: "courses",
    title: "📚 Explore Courses",
    description:
      "Browse our comprehensive course catalog with 50+ courses in programming, mathematics, and technology. From beginner to advanced levels!",
    target: "[data-tutorial='courses']",
    position: "bottom",
    action: "hover",
    icon: <BookOpen className="h-5 w-5" />,
    category: "learning",
    illustration: "📚",
    tips: [
      "Programming courses available",
      "Zero to programmer",
      "Multiple categories",
    ],
  },
  {
    id: "classes",
    title: "🎓 Interactive Classes",
    description:
      "Join live classes with expert instructors and engage with fellow students in real-time. Record sessions are also available for flexible learning!",
    target: "[data-tutorial='classes']",
    position: "bottom",
    action: "hover",
    icon: <Users className="h-5 w-5" />,
    category: "learning",
    illustration: "🎓",
    tips: ["Live sessions", "Expert instructors", "Recorded for later"],
  },
  {
    id: "community",
    title: "👥 Join Our Community",
    description:
      "Connect with 1000+ learners, share knowledge, get help, and participate in discussions. Our community has a 95% satisfaction rate!",
    target: "[data-tutorial='community']",
    position: "bottom",
    action: "hover",
    icon: <Users className="h-5 w-5" />,
    category: "features",
    illustration: "👥",
    tips: ["1000+ active learners", "95% satisfaction", "24/7 support"],
  },
  // {
  //   id: "docs",
  //   title: "📖 Documentation & Guides",
  //   description:
  //     "Access comprehensive guides, step-by-step tutorials, and detailed documentation. Everything you need to succeed is here!",
  //   target: "[data-tutorial='docs']",
  //   position: "bottom",
  //   action: "hover",
  //   icon: <BookOpen className="h-5 w-5" />,
  //   category: "features",
  //   illustration: "📖",
  //   tips: ["Step-by-step guides", "Video tutorials", "Always updated"],
  // },
  {
    id: "signin",
    title: "🔐 Create Your Account",
    description:
      "Sign up to unlock all features: save progress, upload files, join classes, earn certificates, and connect with the community!",
    target: "[data-tutorial='signin']",
    position: "left",
    action: "click",
    icon: <Settings className="h-5 w-5" />,
    category: "account",
    illustration: "🔐",
    tips: ["Free to join", "Secure & private", "Unlock all features"],
  },
  {
    id: "features",
    title: "✨ Key Features Overview",
    description:
      "Once signed in, you'll have access to cloud storage, progress tracking, certificates, assignments, and much more! Your learning journey starts here!",
    target: "body",
    position: "top",
    icon: <Cloud className="h-5 w-5" />,
    category: "features",
    illustration: "✨",
    tips: ["Cloud storage", "Progress tracking", "Earn certificates"],
  },
];

interface InteractiveTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function InteractiveTutorial({
  onComplete,
  onSkip,
}: InteractiveTutorialProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null
  );

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      // Delay to ensure page is loaded
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (isActive && currentTutorialStep) {
      highlightElement(currentTutorialStep.target);
    }
  }, [currentStep, isActive, currentTutorialStep]);

  const highlightElement = (selector: string) => {
    // Remove previous highlights and arrows
    document.querySelectorAll(".tutorial-highlight").forEach((el) => {
      el.classList.remove("tutorial-highlight");
    });
    document.querySelectorAll(".tutorial-arrow").forEach((el) => {
      el.remove();
    });

    if (selector === "body") {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(selector);
    if (element) {
      element.classList.add("tutorial-highlight");
      setHighlightedElement(element);

      // Add pointing arrow
      const rect = element.getBoundingClientRect();
      const arrow = document.createElement("div");
      arrow.className = "tutorial-arrow";
      arrow.style.position = "fixed";
      arrow.style.left = `${rect.left + rect.width / 2 - 15}px`;
      arrow.style.top = `${rect.top - 30}px`;
      arrow.style.zIndex = "46";
      document.body.appendChild(arrow);

      // Scroll element into view
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps((prev) => [...prev, currentTutorialStep.id]);
      setCurrentStep((prev) => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const handleElementInteraction = (element: Element) => {
    // Add a visual feedback when user interacts with highlighted element
    element.classList.add("tutorial-interacted");
    setTimeout(() => {
      element.classList.remove("tutorial-interacted");
    }, 1000);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCompletedSteps((prev) =>
        prev.filter((id) => id !== tutorialSteps[currentStep - 1].id)
      );
    }
  };

  const skipTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setIsActive(false);
    document.querySelectorAll(".tutorial-highlight").forEach((el) => {
      el.classList.remove("tutorial-highlight");
    });
    document.querySelectorAll(".tutorial-arrow").forEach((el) => {
      el.remove();
    });
    onSkip?.();
  };

  const completeTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setCompletedSteps((prev) => [...prev, currentTutorialStep.id]);
    setIsActive(false);
    document.querySelectorAll(".tutorial-highlight").forEach((el) => {
      el.classList.remove("tutorial-highlight");
    });
    document.querySelectorAll(".tutorial-arrow").forEach((el) => {
      el.remove();
    });
    onComplete?.();
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsActive(true);
  };

  if (!isActive) {
    return (
      <Button
        onClick={restartTutorial}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        Take Tour
      </Button>
    );
  }

  return (
    <>
      {/* Enhanced Overlay with blue-tinted blur and gradient */}
      <div className="fixed inset-0 z-40 bg-gray backdrop-blur-xs transition-all duration-300" />

      {/* Tutorial Card */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center w-full px-4"
        >
          <Card className="shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-lg rounded-2xl w-[60vw] flex flex-col">
            <CardHeader className="pb-4 flex flex-col items-center">
              <div className="flex flex-col items-center w-full gap-4">
                <div className="flex items-center gap-4 w-full justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100/80 to-blue-300/40 rounded-xl shadow-sm">
                      {currentTutorialStep.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-blue-800">
                        {currentTutorialStep.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1 bg-blue-100 text-blue-700 border-blue-300">
                        Step {currentStep + 1} of {tutorialSteps.length}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipTutorial}
                    className="text-blue-400 hover:text-blue-700 rounded-full transition-colors"
                    aria-label="Skip tutorial"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-blue-100 rounded-full h-2.5 mt-4 overflow-hidden shadow-inner">
                  <motion.div
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Category Badge */}
                <div className="flex justify-center mt-3 w-full">
                  <Badge
                    variant="outline"
                    className={`text-xs px-3 py-1 font-medium rounded-full shadow-sm border-0 ${
                      currentTutorialStep.category === "navigation"
                        ? "bg-blue-100 text-blue-700"
                        : currentTutorialStep.category === "learning"
                        ? "bg-blue-50 text-blue-600"
                        : currentTutorialStep.category === "features"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-blue-50 text-blue-500"
                    }`}
                  >
                    {currentTutorialStep.category === "navigation"
                      ? "🧭 Navigation"
                      : currentTutorialStep.category === "learning"
                      ? "📚 Learning"
                      : currentTutorialStep.category === "features"
                      ? "⚡ Features"
                      : "👤 Account"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 flex flex-col items-center">
              {/* Illustration */}
              {currentTutorialStep.illustration && (
                <div className="text-center w-full">
                  <div className="text-7xl mb-2 animate-bounce drop-shadow-lg text-blue-400">
                    {currentTutorialStep.illustration}
                  </div>
                </div>
              )}

              <p className="text-black leading-relaxed text-center text-base w-full">
                {currentTutorialStep.description}
              </p>

              {/* Tips */}
              {currentTutorialStep.tips && (
                <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-700">
                      Quick Tips:
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {currentTutorialStep.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="text-sm pl-6 text-gray-700 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 w-full gap-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm disabled:opacity-60 border-blue-200 text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 my-2 sm:my-0">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 shadow-sm ${
                        index === currentStep
                          ? "bg-blue-600"
                          : index < currentStep
                          ? "bg-blue-300"
                          : "bg-blue-100"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
                  {currentStep === tutorialSteps.length - 1 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Skip Option */}
              <div className="text-center pt-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTutorial}
                  className="text-blue-400 hover:text-blue-700 font-medium"
                >
                  Skip tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Tutorial Styles */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.7),
            0 0 0 8px rgba(59, 130, 246, 0.4), 0 0 24px rgba(59, 130, 246, 0.5);
          border-radius: 14px;
          animation: pulse-highlight 2s infinite;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          background: rgba(59, 130, 246, 0.08);
        }

        .tutorial-interacted {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.8),
            0 0 0 8px rgba(37, 99, 235, 0.4), 0 0 25px rgba(37, 99, 235, 0.6) !important;
          animation: success-pulse 0.8s ease-out;
          background: rgba(37, 99, 235, 0.12) !important;
        }

        @keyframes pulse-highlight {
          0%,
          100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.7),
              0 0 0 8px rgba(59, 130, 246, 0.4),
              0 0 24px rgba(59, 130, 246, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.9),
              0 0 0 16px rgba(59, 130, 246, 0.5),
              0 0 36px rgba(59, 130, 246, 0.7);
            transform: scale(1.03);
          }
        }

        @keyframes success-pulse {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.08);
          }
          75% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }

        .tutorial-spotlight {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
            transparent 120px,
            rgba(59, 130, 246, 0.25) 200px,
            rgba(30, 58, 138, 0.7) 400px
          );
          pointer-events: none;
          z-index: 44;
          animation: spotlight-pulse 3s ease-in-out infinite;
        }

        @keyframes spotlight-pulse {
          0%,
          100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }

        .tutorial-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 22px solid #2563eb;
          animation: bounce-arrow 1.5s ease-in-out infinite;
          z-index: 46;
          filter: drop-shadow(0 2px 8px rgba(59,130,246,0.3));
        }

        @keyframes bounce-arrow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}
