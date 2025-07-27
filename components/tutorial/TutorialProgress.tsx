"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TutorialStep {
  id: string;
  title: string;
  completed: boolean;
  current: boolean;
}

interface TutorialProgressProps {
  steps: TutorialStep[];
  currentStep: number;
  totalSteps: number;
}

export function TutorialProgress({ steps, currentStep, totalSteps }: TutorialProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Tutorial Progress</h3>
            <Badge variant="secondary">
              {currentStep + 1} of {totalSteps}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  step.current 
                    ? 'bg-primary/10 border border-primary/20' 
                    : step.completed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : step.current ? (
                    <Clock className="h-5 w-5 text-primary animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    step.current 
                      ? 'text-primary' 
                      : step.completed 
                      ? 'text-green-700' 
                      : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                </div>

                {step.current && (
                  <Badge variant="default" className="text-xs">
                    Current
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>

          {/* Completion Message */}
          {currentStep === totalSteps - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-700">
                Almost done! Complete this final step.
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}