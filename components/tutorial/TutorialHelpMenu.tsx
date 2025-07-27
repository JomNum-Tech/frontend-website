"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  MessageCircle, 
  FileText,
  ExternalLink,
  Lightbulb,
  Video,
  Mail,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "./TutorialProvider";

interface TutorialHelpMenuProps {
  variant?: "dropdown" | "popup" | "sidebar";
  trigger?: "button" | "icon" | "text";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

export function TutorialHelpMenu({ 
  variant = "dropdown",
  trigger = "button",
  position = "bottom-right",
  className = ""
}: TutorialHelpMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const handleStartTutorial = () => {
    startTutorial();
    setIsOpen(false);
  };

  const helpItems = [
    {
      icon: <Play className="h-4 w-4" />,
      title: hasSeenTutorial ? "Retake Interactive Tour" : "Start Interactive Tour",
      description: "2-minute guided walkthrough",
      action: handleStartTutorial,
      badge: !hasSeenTutorial ? "New" : null,
      color: "text-primary"
    },
    // {
    //   icon: <BookOpen className="h-4 w-4" />,
    //   title: "Documentation",
    //   description: "Comprehensive guides and tutorials",
    //   action: () => window.open("/docs", "_blank"),
    //   color: "text-blue-600"
    // },
    // {
    //   icon: <Video className="h-4 w-4" />,
    //   title: "Video Tutorials",
    //   description: "Step-by-step video guides",
    //   action: () => window.open("/tutorials", "_blank"),
    //   color: "text-purple-600"
    // },
    // {
    //   icon: <MessageCircle className="h-4 w-4" />,
    //   title: "Community Support",
    //   description: "Get help from other learners",
    //   action: () => window.open("/community", "_blank"),
    //   color: "text-green-600"
    // },
    // {
    //   icon: <Mail className="h-4 w-4" />,
    //   title: "Contact Support",
    //   description: "Email our support team",
    //   action: () => window.open("mailto:support@jomnumtech.com", "_blank"),
    //   color: "text-orange-600"
    // }
  ];

  // Dropdown variant
  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-2 ${className}`}
          >
            {trigger === "icon" ? (
              <HelpCircle className="h-4 w-4" />
            ) : trigger === "text" ? (
              "Help"
            ) : (
              <>
                <HelpCircle className="h-4 w-4" />
                Help
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Need Help?
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {helpItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50"
            >
              <div className={`p-1 rounded ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Popup variant
  if (variant === "popup") {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <HelpCircle className="h-4 w-4" />
          {trigger !== "icon" && "Help"}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsOpen(false)}
              />

              {/* Popup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-51 w-full max-w-md mx-4"
              >
                <Card className="shadow-2xl">
                  <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      How Can We Help? 🤝
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {helpItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          onClick={item.action}
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 hover:bg-muted/50"
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                              {item.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.title}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="w-full"
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Need Help?
        </h3>
        {helpItems.map((item, index) => (
          <Button
            key={index}
            onClick={item.action}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-auto p-2"
          >
            <div className="flex items-center gap-2 w-full">
              <div className={`${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    );
  }

  return null;
}