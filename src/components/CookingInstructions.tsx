import React, { useEffect, useState } from "react";
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
import Mock from "@/mock/cooking-instruction";
import { cleanJSON } from "@/lib/clean-json";

const CookingInstructions = () => {
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  // const [steps, setSteps] = useState(Mock.instructions);
  const [steps, setSteps] = useState([]);
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

  useEffect(() => {
    const createModel = async () => {
      const session = await window.ai.languageModel.create();
      const promptResult = await session.prompt(`
        Generate a step-by-step cooking guide for making Soto Ayam using only the specified ingredients.  
        Each step should include an estimated time in minutes.  

        ### Ingredients (Only Use These):
        - Chicken pieces  
        - Chicken stock or broth  
        - Onion (finely chopped)  
        - Garlic cloves (minced)  
        - Ginger (sliced or grated)  
        - Lemongrass (bruised)  

        ### Output Format:
        Return a valid JSON object with the following structure:
        {
          "ingredients": [
            "Chicken pieces",
            "Chicken stock or broth",
            "Onion, finely chopped",
            "Garlic cloves, minced",
            "Ginger, sliced or grated",
            "Lemongrass, bruised"
          ],
          "instructions": [
            {
              "step": "Step title here...", <-- without time minutes
              "description": "Step description here...",
              "time": 2 <-- in single numbers without range (e.g. 2, not 2-3)
            }
          ]
        }

        - Ensure the JSON is properly formatted.
        - Do **not** add extra ingredients or modify the cooking process.
        - Use a natural cooking sequence from preparation to serving.  
      `);
      // console.log('#promp result:', promptResult);

      try {
        const cleanResult = cleanJSON(promptResult);
        // console.log('#clean result:', cleanResult);
        setIsLoading(false);
        const parsedResult = JSON.parse(cleanResult);
        setSteps(parsedResult.instructions);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    createModel();
  }, []);

  // console.log(steps);

  return (
    <Card className="p-6 glass">
      <h2 className="text-xl font-semibold mb-4">
        Suggested Cooking Instructions
      </h2>
      <div className="space-y-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          steps.map((step, index) => (
            <div
              key={index}
              className={`fade-in relative ${
                index < steps.length - 1 ? "pb-8" : "pb-4"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
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
                    <span className="font-medium">
                      Step {index + 1}: {step.step}
                    </span>
                    {step.time && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TimerIcon className="w-4 h-4" />
                        <span>{step.time} mins</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm mb-3">{step.description}</p>
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default CookingInstructions;
