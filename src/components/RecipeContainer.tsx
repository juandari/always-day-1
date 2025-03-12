
import React from 'react';
import { Check, ThumbsUp, ThumbsDown, Timer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Ingredient {
  name: string;
  confidence: number;
}

interface Step {
  text: string;
  time?: number;
}

const ingredients: Ingredient[] = [
  { name: 'Fresh Tomatoes', confidence: 95 },
  { name: 'Olive Oil', confidence: 88 },
  { name: 'Garlic', confidence: 92 },
];

const steps: Step[] = [
  { text: 'Dice tomatoes into small cubes', time: 5 },
  { text: 'Heat olive oil in a pan', time: 2 },
  { text: 'Add minced garlic and sauté until fragrant', time: 3 },
];

const RecipeContainer = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ingredients Panel */}
        <Card className="p-6 glass">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="fade-in flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{ingredient.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {ingredient.confidence}% match
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions Panel */}
        <Card className="p-6 glass">
          <h2 className="text-xl font-semibold mb-4">Cooking Instructions</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="fade-in p-4 rounded-lg bg-white/5 backdrop-blur-sm"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Step {index + 1}</span>
                  {step.time && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      <span>{step.time} mins</span>
                    </div>
                  )}
                </div>
                <p className="text-sm mb-3">{step.text}</p>
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
            ))}
          </div>
        </Card>
      </div>

      {/* Products Section */}
      <Card className="mt-8 p-6 glass">
        <Tabs defaultValue="exact" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="exact">Exact Matches</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="exact" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="loading-shimmer h-48 rounded-lg glass" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="alternatives" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="loading-shimmer h-48 rounded-lg glass" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tools" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="loading-shimmer h-48 rounded-lg glass" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RecipeContainer;
