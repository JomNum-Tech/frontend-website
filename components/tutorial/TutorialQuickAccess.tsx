"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BookOpen, 
  MessageCircle, 
  X,
  ChevronRight,
  Sparkles,
  Clock,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "./TutorialProvider";

interface TutorialQuickAccessProps {
  variant?: "card" | "banner" | "compact";
  dismissible?: boolean;
  showStats?: boolean;
  className?: string;
}

export function TutorialQuickAccess({ 
  variant = "card",
  dismissible = true,
  showStats = true,
  className = ""
}: TutorialQuickAccessProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const handleStartTutorial = () => {
    startTutorial();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem("tutorialQuickAccessDismissed", "true");
  };

  // Check if already dismissed
  if (isDismissed || sessionStorage.getItem("tutorialQuickAccessDismissed")) {
    return null;
  }

  // Card variant - full featured card
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          {dismissible && (
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-xl text-white shadow-lg"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {hasSeenTutorial ? "🔄 Want a Refresher?" : "🚀 New Here? Take the Tour!"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {hasSeenTutorial 
                      ? "Retake our interactive tour to rediscover all the amazing features."
                      : "Get familiar with the platform in just 2 minutes with our interactive guide."
                    }
                  </p>
                </div>

                {/* Stats */}
                {showStats && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>2 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>1000+ completed</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Interactive
                    </Badge>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleStartTutorial}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {hasSeenTutorial ? "Retake Tour" : "Start Tour"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("/docs", "_blank")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Docs
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Banner variant - horizontal banner
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">
                {hasSeenTutorial ? "🔄 Retake the Interactive Tour" : "🚀 Take the Interactive Tour"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {hasSeenTutorial 
                  ? "Refresh your knowledge in 2 minutes"
                  : "Learn the platform in just 2 minutes"
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleStartTutorial}
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
            {dismissible && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant - minimal version
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg ${className}`}
      >
        <div className="p-1 bg-primary/20 rounded">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">
          {hasSeenTutorial ? "Retake Tour" : "Take Tour"}
        </span>
        <Button
          onClick={handleStartTutorial}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 ml-auto"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
        {dismissible && (
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </motion.div>
    );
  }

  return null;
}