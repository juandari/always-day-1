import { useState } from "react";
import {
  Check,
  ThumbsUp,
  ThumbsDown,
  Timer as TimerIcon,
  ExternalLink,
  CheckCircle2,
  Plus,
  Minus,
  Users,
  Info,
  ChefHat,
  PackageOpen,
  Utensils,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Timer from "./Timer";
import { useToast } from "@/components/ui/use-toast";
import { productList } from "@/mock/product-list";
import { useRecipe } from "@/context/recipe";

interface Ingredient {
  name: string;
  confidence: number;
  amount: string;
  baseAmount: string;
}

interface Step {
  text: string;
  time?: number;
}

interface Product {
  name: string;
  price: string;
  link: string;
  image: string;
  shopName: string;
  rating: string;
}

interface AlternativeDish {
  name: string;
  confidence: number;
  image: string;
}

interface RecipeContainerProps {
  imageUploaded: boolean;
}

const ingredients: Ingredient[] = [
  {
    name: "Fresh Tomatoes",
    confidence: 95,
    amount: "4 medium",
    baseAmount: "4 medium",
  },
  { name: "Olive Oil", confidence: 88, amount: "2 tbsp", baseAmount: "2 tbsp" },
  {
    name: "Garlic",
    confidence: 92,
    amount: "3 cloves",
    baseAmount: "3 cloves",
  },
];

const steps: Step[] = [
  { text: "Dice tomatoes into small cubes", time: 5 },
  { text: "Heat olive oil in a pan", time: 2 },
  { text: "Add minced garlic and sauté until fragrant", time: 3 },
];

const adjustIngredientAmount = (
  baseAmount: string,
  servings: number
): string => {
  const match = baseAmount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  if (!match) return baseAmount;

  const [, numStr, unit] = match;
  const baseNum = parseFloat(numStr);
  const adjustedNum = baseNum * servings;

  const formattedNum = Number.isInteger(adjustedNum)
    ? adjustedNum.toString()
    : adjustedNum.toFixed(1);

  return `${formattedNum} ${unit}`;
};

const RecipeContainer = ({ imageUploaded }: RecipeContainerProps) => {
  const { toast } = useToast();
  const { dish_name, match_percentage } = useRecipe();
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {}
  );
  const [servings, setServings] = useState(1);
  const [adjustedIngredients, setAdjustedIngredients] = useState([
    ...ingredients,
  ]);
  const mainDishConfidence = 92;

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

  const increaseServings = () => {
    if (servings < 10) {
      const newServings = servings + 1;
      setServings(newServings);
      updateIngredientAmounts(newServings);
    }
  };

  const decreaseServings = () => {
    if (servings > 1) {
      const newServings = servings - 1;
      setServings(newServings);
      updateIngredientAmounts(newServings);
    }
  };

  const updateIngredientAmounts = (newServings: number) => {
    const updated = ingredients.map((ingredient) => ({
      ...ingredient,
      amount: adjustIngredientAmount(ingredient.baseAmount, newServings),
    }));
    setAdjustedIngredients(updated);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {imageUploaded ? (
        <>
          <Card className="p-6 glass mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recognized Dish</h2>
              <div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 p-2 rounded-lg">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Primary Match</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <ChefHat className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{dish_name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${match_percentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {match_percentage}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 glass">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Predicted Ingredients</h2>
                <div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 p-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseServings}
                    disabled={servings <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 min-w-[80px] justify-center">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">
                      {servings} {servings === 1 ? "serving" : "servings"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseServings}
                    disabled={servings >= 10}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <ul className="space-y-3">
                {adjustedIngredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="fade-in flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm dark:bg-black/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{ingredient.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {ingredient.amount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {ingredient.confidence}% match
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

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
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
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
                                <Timer
                                  minutes={step.time}
                                  stepNumber={index + 1}
                                />
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleTimer(index)}
                                  className="w-full"
                                  disabled={completedSteps[index]}
                                >
                                  <TimerIcon className="w-4 h-4 mr-1" /> Start
                                  Timer
                                </Button>
                              )}
                            </div>
                          )}

                          <div className="flex items-center">
                            <Checkbox
                              id={`step-${index}`}
                              checked={completedSteps[index]}
                              onCheckedChange={() =>
                                toggleStepCompletion(index)
                              }
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
          </div>

          <Card className="mt-8 p-6 glass">
            <Tabs defaultValue="exact" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="exact">Recommended Ingredients</TabsTrigger>
                <TabsTrigger value="tools">Cooking Tools</TabsTrigger>
              </TabsList>
              <TabsContent value="exact" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productList.ingredients.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="tools" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productList.tools.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 glass flex flex-col items-center justify-center min-h-[300px]">
            <div className="p-4 rounded-full bg-primary/5 mb-4">
              <Utensils className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Waiting for Your Dish</h3>
            <p className="text-center text-muted-foreground max-w-md">
              Upload a photo of any dish and our AI will identify the
              ingredients with precise measurements for you to recreate it.
            </p>
          </Card>

          <Card className="p-6 glass flex flex-col items-center justify-center min-h-[300px]">
            <div className="p-4 rounded-full bg-primary/5 mb-4">
              <ChefHat className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Ready to Cook</h3>
            <p className="text-center text-muted-foreground max-w-md">
              After analyzing your dish photo, we'll provide detailed
              step-by-step cooking instructions with helpful timers.
            </p>
          </Card>

          <Card className="col-span-2 p-6 glass flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-4 rounded-full bg-primary/5 mb-4">
              <PackageOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Shop With Confidence</h3>
            <p className="text-center text-muted-foreground max-w-md">
              We'll suggest the exact ingredients and cooking tools you need to
              recreate the dish. Just upload a photo to get started.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="fade-in rounded-lg overflow-hidden glass border border-white/10 dark:border-white/5">
      <div className="h-72 mx-auto aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold">{product.price}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-xs">{product.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{product.shopName}</span>
        </div>
        <Button
          onClick={() => window.open(product.link, "_blank")}
          variant="outline"
          size="sm"
          className="w-full mt-3"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1" />
          View Product
        </Button>
      </div>
    </div>
  );
};

export default RecipeContainer;
