import React, { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import RecipeContainer from "@/components/RecipeContainer";
import DarkModeToggle from "@/components/DarkModeToggle";
import readFromIndexedDB from "@/repository/indexed-db/read";
import { Lock, Menu } from "lucide-react";
import { RecipeContext, RecipeProvider } from "@/context/recipe";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import RecipeHistory, { HistoryRecipe } from "@/components/RecipeHistory";
import useHistory from "@/usecase/useHistory";
import type { Recipe } from "@/entity/recipe/types";

const Index = () => {
  const { navigateToRecipeDetail, resetHistory } = useHistory();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [recipeHistory, setRecipeHistory] = useState<HistoryRecipe[]>([]);

  const handleSelectRecipe = (recipeId: string) => {
    const recipe = recipeHistory.find((r) => r.id === recipeId);
    if (recipe) {
      console.log({
        title: "Recipe Selected",
        description: `You selected: ${recipe.name}`,
      });
      // Future implementation: actually load the recipe
      navigateToRecipeDetail(recipeId);
    }
  };

  const handleClearHistory = () => {
    setRecipeHistory([]);
    console.log({
      title: "History Cleared",
      description: "Your recipe history has been cleared.",
    });

    resetHistory();
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleImageUpload = (uploaded: boolean) => {
    setImageUploaded(uploaded);
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        readFromIndexedDB<Recipe[]>({})
          .then((response) => {
            setRecipeHistory(response);
          })
          .catch((repoError) => console.log("[ERROR] repoError: ", repoError));
      } catch (e) {
        console.log("[ERROR] failed loading history: ", e);
      }
    };

    getHistory();
  }, []);

  return (
    <SidebarProvider>
      <RecipeProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-b from-gray-40 to-gray-90 dark:from-gray-800 dark:to-gray-700">
          {showSidebar && (
            <Sidebar>
              <SidebarContent>
                <RecipeHistory
                  recipes={recipeHistory}
                  onSelectRecipe={handleSelectRecipe}
                  onClearHistory={handleClearHistory}
                />
              </SidebarContent>
            </Sidebar>
          )}

          <SidebarInset>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-12">
              <header className="w-full p-6 text-center relative">
                <div className="absolute left-6 top-6">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute right-6 top-6">
                  <DarkModeToggle />
                </div>
                <h1 className="text-4xl font-bold mb-2">Recipe Genie</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Upload a photo of any dish, and our AI will recognize it, list
                  the ingredients, and provide step-by-step cooking instructions
                </p>
              </header>

              <main className="container mx-auto px-4">
                <ImageUpload onImageUpload={handleImageUpload} />
                <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>
                    Your photos are processed locally - your privacy is
                    protected
                  </span>
                </div>
                <RecipeContainer
                  imageUploaded={imageUploaded}
                  setImageUploaded={setImageUploaded}
                />
              </main>
            </div>
          </SidebarInset>
        </div>
      </RecipeProvider>
    </SidebarProvider>
  );
};

export default Index;
