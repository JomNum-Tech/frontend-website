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
    title: "Interactive Learning",
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
    title: "Cloud Storage",
    description: "Store and access your files from anywhere",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Certificates",
    description: "Earn recognized certificates upon completion",
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-4xl animate-pulse">🚀</div>
              <div className="absolute top-8 right-8 text-3xl animate-bounce">⭐</div>
              <div className="absolute bottom-4 left-8 text-2xl animate-pulse">💡</div>
              <div className="absolute bottom-6 right-4 text-3xl animate-bounce">🎯</div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg"
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
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Welcome to JomNum-Tech! 🎉
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1 text-lg">
                    Your journey to mastering technology starts here ✨
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Platform Overview */}
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🌟</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover What Makes Us Special
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
                Join <span className="font-semibold text-primary">1000+</span> learners who are advancing their careers with our 
                comprehensive courses in programming, mathematics, and technology. 🚀
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: currentFeature === index ? 1.05 : 1
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3
                  }}
                >
                  <Card className={`h-full transition-all duration-300 ${
                    currentFeature === index 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}>
                    <CardContent className="p-4 text-center space-y-3">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 py-6 border-t border-b bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  50+ 📚
                </div>
                <div className="text-sm text-muted-foreground font-medium">Courses</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  1000+ 👥
                </div>
                <div className="text-sm text-muted-foreground font-medium">Students</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  95% ⭐
                </div>
                <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-xl font-bold mb-2">Ready to Get Started?</h4>
                <p className="text-muted-foreground">
                  Take a quick <span className="font-semibold text-primary">2-minute interactive tour</span> to learn how to navigate the platform and discover all amazing features! 🚀
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.div className="flex-1">
                  <Button
                    onClick={handleStartTutorial}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold py-3 text-lg shadow-lg"
                    
                    
                  >
                    <Play className="h-5 w-5" />
                    Start Interactive Tour ✨
                  </Button>
                </motion.div>
                <motion.div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="w-full flex items-center justify-center gap-2 py-3 text-lg border-2 hover:bg-muted/50"
                    
                  >
                    Skip for Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200">
                  ⏱️ Takes only 2 minutes • 🎮 Interactive • 🎯 Personalized
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Skip anytime • No registration required for tour
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}