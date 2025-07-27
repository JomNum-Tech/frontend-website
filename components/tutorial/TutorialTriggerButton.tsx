"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Play, 
  HelpCircle, 
  Rocket,
  Sparkles,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import { useTutorial } from "./TutorialProvider";

interface TutorialTriggerButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
  style?: "minimal" | "prominent" | "floating" | "badge";
  position?: "fixed" | "relative";
  location?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  icon?: "lightbulb" | "play" | "help" | "rocket" | "sparkles" | "book";
  pulse?: boolean;
  glow?: boolean;
}

const iconMap = {
  lightbulb: Lightbulb,
  play: Play,
  help: HelpCircle,
  rocket: Rocket,
  sparkles: Sparkles,
  book: BookOpen,
};

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

export function TutorialTriggerButton({
  variant = "default",
  size = "default",
  className = "",
  showText = true,
  style = "minimal",
  position = "relative",
  location = "bottom-right",
  icon = "lightbulb",
  pulse = false,
  glow = false,
}: TutorialTriggerButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const IconComponent = iconMap[icon];

  const handleClick = () => {
    startTutorial();
  };

  // Minimal style - simple button
  if (style === "minimal") {
    return (
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className} ${
          position === "fixed" ? `fixed ${positionClasses[location]} z-50` : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconComponent className="h-4 w-4" />
        {showText && (
          <span>{hasSeenTutorial ? "Take Tour Again" : "Start Tour"}</span>
        )}
      </Button>
    );
  }

  // Badge style - small badge-like button
  if (style === "badge") {
    return (
      <Badge
        onClick={handleClick}
        className={`cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-1 ${className} ${
          position === "fixed" ? `fixed ${positionClasses[location]} z-50` : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconComponent className="h-3 w-3" />
        {showText && <span className="text-xs">Tour</span>}
      </Badge>
    );
  }

  // Floating style - floating action button
  if (style === "floating") {
    return (
      <motion.div
        className={`${
          position === "fixed" ? `fixed ${positionClasses[location]} z-50` : ""
        } ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={pulse ? { duration: 2, repeat: Infinity } : {}}
      >
        <Button
          onClick={handleClick}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 ${
            glow ? "shadow-primary/25 hover:shadow-primary/40" : ""
          } bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IconComponent className="h-6 w-6 text-white" />
        </Button>
        
        {/* Tooltip */}
        {isHovered && showText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          >
            {hasSeenTutorial ? "Take Tour Again" : "Start Interactive Tour"}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Prominent style - eye-catching button
  if (style === "prominent") {
    return (
      <motion.div
        className={`${
          position === "fixed" ? `fixed ${positionClasses[location]} z-50` : ""
        } ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={pulse ? { scale: [1, 1.02, 1] } : {}}
        transition={pulse ? { duration: 2, repeat: Infinity } : {}}
      >
        <Button
          onClick={handleClick}
          size={size}
          className={`relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
            glow ? "shadow-primary/25 hover:shadow-primary/40" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {showText && (
              <span>
                {hasSeenTutorial ? "🔄 Retake Tour" : "🚀 Start Tour"}
              </span>
            )}
            {!hasSeenTutorial && (
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                New
              </Badge>
            )}
          </div>
        </Button>
      </motion.div>
    );
  }

  return null;
}