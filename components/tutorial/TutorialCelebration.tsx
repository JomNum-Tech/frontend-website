"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Users,
  Cloud
} from "lucide-react";

interface TutorialCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
}

const achievements = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Platform Explorer",
    description: "Learned to navigate the platform"
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Community Member",
    description: "Discovered community features"
  },
  {
    icon: <Cloud className="h-5 w-5" />,
    title: "Storage Master",
    description: "Understood file management"
  }
];

const confettiColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"
];

export function TutorialCelebration({ isOpen, onClose, onExplore }: TutorialCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleExplore = () => {
    onClose();
    onExplore();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blue tint and blur for better focus */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray backdrop-blur-xs"
          />

          {/* Confetti - blue themed */}
          {showConfetti && (
            <div className="fixed inset-0 z-51 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full shadow-lg"
                  style={{
                    backgroundColor: confettiColors[i % confettiColors.length],
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    boxShadow: "0 0 8px 2px rgba(59,130,246,0.15)",
                  }}
                  initial={{ y: -10, rotate: 0 }}
                  animate={{
                    y: window.innerHeight + 10,
                    rotate: 360,
                    x: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Celebration Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-52 w-full max-w-lg mx-4"
          >
            <Card className="shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden">
              {/* Header with celebration graphics */}
              <CardHeader className="text-center bg-gradient-to-r from-blue-100/80 via-blue-50 to-blue-200/60 relative pb-8 pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white"
                >
                  <Trophy className="h-10 w-10 text-white drop-shadow-lg" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CardTitle className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow-sm">
                    🎉 Congratulations!
                  </CardTitle>
                  <p className="text-blue-700/80 font-medium">
                    You&apos;ve successfully completed the platform tour!
                  </p>
                </motion.div>

                {/* Floating sparkles - blue accent */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${18 + (i * 8)}%`,
                        top: `${18 + (i % 3) * 22}%`,
                      }}
                      animate={{
                        y: [0, -12, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.25, 1],
                      }}
                      transition={{
                        duration: 2.2,
                        delay: i * 0.18,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-blue-300/60" />
                    </motion.div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-7 space-y-7">
                {/* Achievements */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-center mb-4 text-blue-700">
                    🏆 Achievements Unlocked
                  </h3>
                  
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-lg border border-blue-200 shadow-sm"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shadow">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            {achievement.title}
                          </span>
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-blue-600">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                

                

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    onClick={handleExplore}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition"
                  >
                    Start Exploring
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="px-6 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition"
                  >
                    Close
                  </Button>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="text-center"
                >
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                    🎓 Tutorial Graduate
                  </Badge>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}