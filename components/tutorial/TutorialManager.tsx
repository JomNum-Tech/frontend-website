"use client";

import { useState, useEffect } from "react";
import { InteractiveTutorial } from "./InteractiveTutorial";
import { WelcomeModal } from "./WelcomeModal";
import { FloatingTutorialButton } from "./FloatingTutorialButton";
import { TutorialCelebration } from "./TutorialCelebration";
import { useTutorial } from "./TutorialProvider";
import { toast } from "@/hooks/use-toast";

export function TutorialManager() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const {
    isTutorialActive,
    startTutorial,
    skipTutorial,
    completeTutorial,
    hasSeenTutorial,
  } = useTutorial();

  useEffect(() => {
    // Show welcome modal for first-time visitors
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
  };

  const handleStartTutorial = () => {
    setShowWelcomeModal(false);
    startTutorial();
  };

  const handleTutorialComplete = () => {
    completeTutorial();
    setShowCelebration(true);
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    toast({
      title: "Welcome to JomNum-Tech! 🎉",
      description: "You're all set to start your learning journey.",
      duration: 5000,
    });
  };

  const handleExplore = () => {
    setShowCelebration(false);
    // Navigate to courses or main content
    window.location.href = "/courses";
  };

  const handleTutorialSkip = () => {
    skipTutorial();
    toast({
      title: "Tutorial Skipped",
      description: "You can restart the tour anytime using the help button.",
      duration: 3000,
    });
  };

  return (
    <>
      {/* Welcome Modal for first-time visitors */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        onStartTutorial={handleStartTutorial}
      />

      {/* Interactive Tutorial */}
      {isTutorialActive && (
        <InteractiveTutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      {/* Floating Tutorial Button */}
      <FloatingTutorialButton />

      {/* Tutorial Completion Celebration */}
      <TutorialCelebration
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        onExplore={handleExplore}
      />
    </>
  );
}
