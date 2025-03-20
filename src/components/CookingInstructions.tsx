import React, { useEffect, useState, useCallback } from "react";
import {
  Info,
  MessageCircle,
  Timer as TimerIcon,
  CheckCircle2,
  Send,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Timer from "./Timer";
import { Card } from "@/components/ui/card";
import { LoadingList } from "@/components/ui/loading-skeleton";
import { useRecipe } from "@/context/recipe";
import { cleanJSON } from "@/lib/clean-json";
import useHistory from "@/usecase/useHistory";
import { answerToQuestion } from "@/prompts/step-qna";

interface Question {
  text: string;
  answer: string;
}

function generatePrompt(dish_name: string, ingredients: string[]) {
  return `
        Generate a step-by-step cooking guide for making ${dish_name} using only the specified ingredients.  
        Each step should include an estimated time in minutes.  

        ### Ingredients (Only Use These):
        ${ingredients.map((ing) => `- ${ing}`).join("\n")}  

        ### Output Format:
        Return a valid JSON object with the following structure:
        {
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
      `;
}

const CookingInstructions = () => {
  const {
    updateRecipeInstructions,
    getRecipeDetail,
    isPrefillExpected,
    updateRecipeQuestions,
  } = useHistory();
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});
  const [isPrefillFinished, setIsPrefillFinished] = useState(false);
  const [isGetInstructionsTriggered, setIsGetInstructionsTriggered] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const { ingredients, dish_name } = useRecipe();
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {}
  );
  // Questions
  const [stepQuestions, setStepQuestions] = useState<
    Record<number, Question[]>
  >({});
  const [askingQuestion, setAskingQuestion] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const submitQuestion = useCallback(
    async (stepIndex: number) => {
      if (currentQuestion.trim() === "") return;
      setIsQuestionLoading(true);
      const session = await window.ai.languageModel.create();

      const generatedPrompt = answerToQuestion({
        dishName: dish_name,
        stepTitle: steps[stepIndex].step,
        stepDescription: steps[stepIndex].description,
        question: currentQuestion,
      });

      const promptResult = await session.prompt(generatedPrompt);

      const newQuestion: Question = {
        text: currentQuestion,
        answer: promptResult,
      };

      setStepQuestions((prev) => ({
        ...prev,
        [stepIndex]: [...(prev[stepIndex] || []), newQuestion],
      }));

      setAskingQuestion(null);
      setCurrentQuestion("");
      setIsQuestionLoading(false);
      updateRecipeQuestions({
        ...stepQuestions,
        [stepIndex]: [...(stepQuestions[stepIndex] || []), newQuestion],
      });
    },
    [currentQuestion, dish_name, stepQuestions, steps, updateRecipeQuestions]
  );

  const cancelQuestion = () => {
    setAskingQuestion(null);
    setCurrentQuestion("");
  };

  const startAskingQuestion = (stepIndex: number) => {
    setAskingQuestion(stepIndex);
    setCurrentQuestion("");
  };

  const toggleTimer = (stepIndex: number) => {
    setActiveTimers((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  //console.log(ingredients);

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  useEffect(() => {
    const createModel = async () => {
      const session = await window.ai.languageModel.create();
      const generatedPrompt = generatePrompt(dish_name, ingredients);

      //console.log('#generatedPrompt', generatedPrompt);

      const promptResult = await session.prompt(generatedPrompt);

      //console.log('#promptResult', promptResult);

      try {
        const cleanResult = cleanJSON(promptResult);
        setIsLoading(false);
        const parsedResult = JSON.parse(cleanResult);
        updateRecipeInstructions(parsedResult.instructions);
        setSteps(parsedResult.instructions);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    if (
      ingredients &&
      ingredients.length > 0 &&
      !isGetInstructionsTriggered &&
      !isPrefillExpected()
    ) {
      setIsGetInstructionsTriggered(true);
      createModel();
    }
  }, [
    ingredients,
    dish_name,
    updateRecipeInstructions,
    isPrefillExpected,
    isGetInstructionsTriggered,
  ]);

  useEffect(() => {
    const handlePrefill = async () => {
      const detail = await getRecipeDetail();

      setSteps(detail.instructions);
      setStepQuestions(detail.questions || {});
      setIsLoading(false);
    };
    if (isPrefillExpected() && !isPrefillFinished) {
      handlePrefill();
      setIsPrefillFinished(true);
    }
  }, [getRecipeDetail, isPrefillExpected, isPrefillFinished]);

  return (
    <Card className="p-6 glass">
      <h2 className="text-xl font-semibold mb-4">
        Suggested Cooking Instructions
      </h2>
      <div className="space-y-0">
        {isLoading ? (
          <LoadingList className="mt-4" />
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
                  <div className="flex gap-2">
                    {askingQuestion === index ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <Textarea
                          value={currentQuestion}
                          onChange={(e) => setCurrentQuestion(e.target.value)}
                          placeholder="Type your question about this step..."
                          className="min-h-[100px] text-sm"
                          disabled={isQuestionLoading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                              submitQuestion(index);
                            }
                          }}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isQuestionLoading}
                            onClick={cancelQuestion}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={isQuestionLoading}
                            onClick={() => submitQuestion(index)}
                          >
                            <Send className="h-4 w-4 mr-1" /> Submit
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startAskingQuestion(index)}
                        className="w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Ask a question
                      </Button>
                    )}
                  </div>

                  {stepQuestions[index] && stepQuestions[index].length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-medium">Questions & Answers</p>
                      {stepQuestions[index].map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="bg-secondary/10 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="bg-primary/20 p-1 rounded-full">
                              <MessageCircle className="w-3 h-3 text-primary" />
                            </div>
                            <p className="text-sm font-medium">{q.text}</p>
                          </div>
                          <div className="flex items-start gap-2 ml-4">
                            <div className="bg-secondary/20 p-1 rounded-full">
                              <Info className="w-3 h-3 text-secondary-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {q.answer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
