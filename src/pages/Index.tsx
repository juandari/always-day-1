import React, { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import RecipeContainer from "@/components/RecipeContainer";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Lock } from "lucide-react";
import { RecipeContext, RecipeProvider } from "@/context/recipe";

const Index = () => {
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleImageUpload = (uploaded: boolean) => {
    setImageUploaded(uploaded);
  };

  return (
    <RecipeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-12">
        <header className="w-full p-6 text-center relative">
          <div className="absolute right-6 top-6">
            <DarkModeToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2">Recipe Genie</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of any dish, and our AI will recognize it, list the
            ingredients, and provide step-by-step cooking instructions
          </p>
        </header>

        <main className="container mx-auto px-4">
          <ImageUpload onImageUpload={handleImageUpload} />
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>
              Your photos are processed locally - your privacy is protected
            </span>
          </div>
          <RecipeContainer imageUploaded={imageUploaded} />
        </main>
      </div>
    </RecipeProvider>
  );
};

export default Index;
