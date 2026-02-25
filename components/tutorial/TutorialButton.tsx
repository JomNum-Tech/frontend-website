"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Play } from "lucide-react";
import { useTutorial } from "./TutorialProvider";

interface TutorialButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
}

export function TutorialButton({ 
  variant = "outline", 
  size = "sm", 
  className = "",
  showText = true 
}: TutorialButtonProps) {
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const handleClick = () => {
    startTutorial();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      {hasSeenTutorial ? (
        <Lightbulb className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      {showText && (
        <span>
          {hasSeenTutorial ? "Take Tour Again" : "Start Tour"}
        </span>
      )}
    </Button>
  );
}