"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  BookOpen, 
  Users, 
  Cloud, 
  Award,
  ArrowRight,
  Play,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Online Learning",
    description: "Engage with dynamic courses and hands-on tutorials",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Support",
    description: "Connect with fellow learners and expert instructors",
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "JomNum Drive",
    description: "Store and access your files from anywhere",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Blog",
    description: "Read and share insightful articles with the community",
    color: "bg-orange-500/10 text-orange-600"
  }
];

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

export function WelcomeModal({ isOpen, onClose, onStartTutorial }: WelcomeModalProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleStartTutorial = () => {
    onClose();
    onStartTutorial();
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border border-blue-200 bg-white">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-8 pb-5 bg-gradient-to-r from-blue-100 via-blue-50 to-white relative overflow-hidden border-b border-blue-200">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-4 left-4 text-4xl animate-pulse">🚀</div>
              <div className="absolute top-8 right-8 text-3xl animate-bounce">⭐</div>
              <div className="absolute bottom-4 left-8 text-2xl animate-pulse">💡</div>
              <div className="absolute bottom-6 right-4 text-3xl animate-bounce">🎯</div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-xl border-2 border-blue-400"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Rocket className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                    Welcome to JomNum-Tech! 🎉
                  </DialogTitle>
                  <p className="text-blue-700/80 mt-1 text-lg font-medium">
                    Your journey to mastering technology starts here ✨
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-8 space-y-8 bg-white">
            {/* Platform Overview */}
            <div className="text-center space-y-3">
              <div className="text-6xl animate-bounce">🌟</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
                Discover What Makes Us Special
              </h3>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: currentFeature === index ? 1.07 : 1
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3
                  }}
                >
                  <Card className={`h-full transition-all duration-300 rounded-xl border ${
                    currentFeature === index 
                      ? 'ring-2 ring-blue-500 shadow-xl border-blue-200 bg-blue-50/60'
                      : 'hover:shadow-lg border-blue-100 bg-white'
                  }`}>
                    <CardContent className="p-5 text-center space-y-3">
                      <div className={`w-12 h-12 rounded-lg ${feature.color.replace('primary', 'blue-500/10 text-blue-600')} flex items-center justify-center mx-auto shadow-sm`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">{feature.title}</h4>
                        <p className="text-sm text-blue-600/80">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <motion.div className="flex-1">
                  <Button
                    onClick={handleStartTutorial}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 text-lg shadow-lg rounded-lg border-2 border-blue-500 transition-all duration-200"
                  >
                    <Play className="h-5 w-5" />
                    Start Interactive Tour ✨
                  </Button>
                </motion.div>
                <motion.div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="w-full flex items-center justify-center gap-2 py-3 text-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-lg transition-all duration-200"
                  >
                    Skip for Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}