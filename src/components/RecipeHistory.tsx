import React from "react";
import { Book, Clock, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type HistoryRecipe = {
  id: string;
  name: string;
  timestamp: string;
  imageUrl?: string;
};

interface RecipeHistoryProps {
  recipes: HistoryRecipe[];
  onSelectRecipe: (recipeId: string) => void;
  onClearHistory: () => void;
}

const RecipeHistory: React.FC<RecipeHistoryProps> = ({
  recipes,
  onSelectRecipe,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    const recipeDate = new Date(date);
    return new Intl.DateTimeFormat("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(recipeDate);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Book className="h-5 w-5" />
          Recipe History
        </h2>
        <div className="relative mt-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto">
            <div className="px-2">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  className="w-full p-3 text-left rounded-lg hover:bg-sidebar-accent transition-colors mb-1 flex items-start group"
                  onClick={() => onSelectRecipe(recipe.id)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-md mr-3 bg-muted flex-shrink-0 bg-cover bg-center",
                      recipe.imageUrl
                        ? "bg-no-repeat"
                        : "flex items-center justify-center"
                    )}
                    style={
                      recipe.imageUrl
                        ? { backgroundImage: `url(${recipe.imageUrl})` }
                        : {}
                    }
                  >
                    {!recipe.imageUrl && (
                      <Book className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{recipe.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(recipe.timestamp)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            <button
              className="w-full text-xs text-center py-2 px-3 text-muted-foreground hover:text-destructive flex items-center justify-center rounded-md border border-input hover:bg-destructive/5 transition-colors"
              onClick={onClearHistory}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear History
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
          <Book className="h-12 w-12 mb-2 opacity-20" />
          <h3 className="font-medium">No recipes found</h3>
          <p className="text-sm mt-1">
            {searchQuery
              ? "Try a different search term"
              : "Your recipe history will appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
