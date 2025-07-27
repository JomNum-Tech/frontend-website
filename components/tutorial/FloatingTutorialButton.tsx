"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";
import { useTutorial } from "./TutorialProvider";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingTutorialButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { startTutorial, hasSeenTutorial, isTutorialActive } = useTutorial();

  useEffect(() => {
    // Show the floating button for users who have seen the tutorial
    // but only after they've been on the page for a while
    if (hasSeenTutorial && !isTutorialActive && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000); // Show after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, isTutorialActive, isDismissed]);

  const handleStartTutorial = () => {
    setIsVisible(false);
    startTutorial();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem("tutorialButtonDismissed", "true");
  };

  useEffect(() => {
    // Check if button was dismissed in this session
    const dismissed = sessionStorage.getItem("tutorialButtonDismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  if (!hasSeenTutorial || isTutorialActive) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-primary/10 rounded">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-sm">Need help?</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              Take the interactive tour again to explore feature of this platform.
            </p>
            
            <Button
              onClick={handleStartTutorial}
              size="sm"
              className="w-full"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Restart Tour
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}