import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Timer as TimerIcon,
  CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Timer from "./Timer";
import { Card } from "@/components/ui/card";

const CookingInstructions = ({ steps }) => {
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
      {}
    );
  const toggleTimer = (stepIndex: number) => {
    setActiveTimers((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  return (
    <Card className="p-6 glass">
      <h2 className="text-xl font-semibold mb-4">
        Suggested Cooking Instructions
      </h2>
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`fade-in relative ${
              index < steps.length - 1 ? "pb-8" : "pb-4"
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            )}

            <div className="relative p-4 rounded-lg bg-white/5 backdrop-blur-sm dark:bg-black/20">
              <div className="absolute -left-3 top-4 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground z-10">
                {completedSteps[index] ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              <div className="ml-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Step {index + 1}</span>
                  {step.time && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TimerIcon className="w-4 h-4" />
                      <span>{step.time} mins</span>
                    </div>
                  )}
                </div>
                <p className="text-sm mb-3">{step.text}</p>

                <div className="flex items-center gap-2 mb-3">
                  {step.time && (
                    <div
                      className={`flex-1 ${
                        !completedSteps[index] ? "block" : "hidden"
                      }`}
                    >
                      {activeTimers[index] ? (
                        <Timer minutes={step.time} stepNumber={index + 1} />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTimer(index)}
                          className="w-full"
                          disabled={completedSteps[index]}
                        >
                          <TimerIcon className="w-4 h-4 mr-1" /> Start Timer
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center">
                    <Checkbox
                      id={`step-${index}`}
                      checked={completedSteps[index]}
                      onCheckedChange={() => toggleStepCompletion(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`step-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      Mark Complete
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not helpful
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CookingInstructions;
