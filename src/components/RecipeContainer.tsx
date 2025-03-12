import React, { useState } from 'react';
import { Check, ThumbsUp, ThumbsDown, Timer as TimerIcon, ExternalLink, CheckCircle2, Plus, Minus, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Timer from './Timer';

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
  id: number;
  name: string;
  image: string;
  price: string;
  store: string;
  rating: number;
  updatedAt: string;
}

const ingredients: Ingredient[] = [
  { name: 'Fresh Tomatoes', confidence: 95, amount: '4 medium', baseAmount: '4 medium' },
  { name: 'Olive Oil', confidence: 88, amount: '2 tbsp', baseAmount: '2 tbsp' },
  { name: 'Garlic', confidence: 92, amount: '3 cloves', baseAmount: '3 cloves' },
];

const steps: Step[] = [
  { text: 'Dice tomatoes into small cubes', time: 5 },
  { text: 'Heat olive oil in a pan', time: 2 },
  { text: 'Add minced garlic and sauté until fragrant', time: 3 },
];

const exactProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Organic Tomatoes',
    image: 'https://images.unsplash.com/photo-1546470427-f5e71c3f370a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$4.99',
    store: 'Whole Foods',
    rating: 4.8,
    updatedAt: '2h ago',
  },
  {
    id: 2,
    name: 'Extra Virgin Olive Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$12.99',
    store: 'Amazon',
    rating: 4.5,
    updatedAt: '1h ago',
  },
  {
    id: 3,
    name: 'Organic Garlic Bulbs',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$2.49',
    store: 'Trader Joe\'s',
    rating: 4.7,
    updatedAt: '3h ago',
  },
];

const alternativeProducts: Product[] = [
  {
    id: 4,
    name: 'Canned Diced Tomatoes',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$1.99',
    store: 'Target',
    rating: 4.0,
    updatedAt: '5h ago',
  },
  {
    id: 5,
    name: 'Avocado Oil',
    image: 'https://images.unsplash.com/photo-1620705991715-13c1ae782530?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$8.99',
    store: 'Sprouts',
    rating: 4.3,
    updatedAt: '8h ago',
  },
  {
    id: 6,
    name: 'Garlic Powder',
    image: 'https://images.unsplash.com/photo-1635190155342-01329fab3ae7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$3.49',
    store: 'Kroger',
    rating: 4.1,
    updatedAt: '12h ago',
  },
];

const toolsProducts: Product[] = [
  {
    id: 7,
    name: 'Chef\'s Knife',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$49.99',
    store: 'Williams Sonoma',
    rating: 4.9,
    updatedAt: '1d ago',
  },
  {
    id: 8,
    name: 'Non-Stick Frying Pan',
    image: 'https://images.unsplash.com/photo-1574269252556-89926e7f2177?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$34.99',
    store: 'Bed Bath & Beyond',
    rating: 4.6,
    updatedAt: '2d ago',
  },
  {
    id: 9,
    name: 'Kitchen Timer',
    image: 'https://images.unsplash.com/photo-1628883087021-f3f118fdf087?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: '$9.99',
    store: 'Amazon',
    rating: 4.2,
    updatedAt: '6h ago',
  },
];

const adjustIngredientAmount = (baseAmount: string, servings: number): string => {
  const match = baseAmount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  
  if (!match) return baseAmount;
  
  const [, numStr, unit] = match;
  const baseNum = parseFloat(numStr);
  const adjustedNum = baseNum * servings;
  
  const formattedNum = Number.isInteger(adjustedNum) ? adjustedNum.toString() : adjustedNum.toFixed(1);
  
  return `${formattedNum} ${unit}`;
};

const RecipeContainer = () => {
  const [activeTimers, setActiveTimers] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [servings, setServings] = useState(1);
  const [adjustedIngredients, setAdjustedIngredients] = useState([...ingredients]);
  
  const toggleTimer = (stepIndex: number) => {
    setActiveTimers(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };
  
  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
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
    const updated = ingredients.map(ingredient => ({
      ...ingredient,
      amount: adjustIngredientAmount(ingredient.baseAmount, newServings)
    }));
    setAdjustedIngredients(updated);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 glass">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ingredients</h2>
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
                <span className="font-medium">{servings} {servings === 1 ? 'serving' : 'servings'}</span>
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
                  <span className="text-sm font-medium">{ingredient.amount}</span>
                  <span className="text-sm text-muted-foreground">
                    {ingredient.confidence}% match
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 glass">
          <h2 className="text-xl font-semibold mb-4">Cooking Instructions</h2>
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`fade-in relative ${index < steps.length - 1 ? 'pb-8' : 'pb-4'}`}
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
                        <div className={`flex-1 ${!completedSteps[index] ? 'block' : 'hidden'}`}>
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
      </div>

      <Card className="mt-8 p-6 glass">
        <Tabs defaultValue="exact" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="exact">Exact Matches</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="exact" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exactProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="alternatives" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alternativeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tools" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {toolsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="fade-in rounded-lg overflow-hidden glass border border-white/10 dark:border-white/5">
      <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="text-sm">Product Image</span>
          </div>
        )}
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
          <span>{product.store}</span>
          <span>Updated {product.updatedAt}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-3">
          <ExternalLink className="w-3.5 h-3.5 mr-1" />
          View Product
        </Button>
      </div>
    </div>
  );
};

export default RecipeContainer;
