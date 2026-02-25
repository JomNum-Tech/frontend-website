"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TutorialContextType {
  isTutorialActive: boolean;
  startTutorial: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  hasSeenTutorial: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);

  useEffect(() => {
    // Check if user has seen tutorial before
    const seen = localStorage.getItem("hasSeenTutorial");
    setHasSeenTutorial(!!seen);
    
    // Auto-start tutorial for new users after a delay
    if (!seen) {
      const timer = setTimeout(() => {
        setIsTutorialActive(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTutorial = () => {
    setIsTutorialActive(true);
  };

  const skipTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setIsTutorialActive(false);
    setHasSeenTutorial(true);
  };

  const completeTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setIsTutorialActive(false);
    setHasSeenTutorial(true);
  };

  return (
    <TutorialContext.Provider
      value={{
        isTutorialActive,
        startTutorial,
        skipTutorial,
        completeTutorial,
        hasSeenTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}