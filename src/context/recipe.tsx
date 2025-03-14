import { createContext, useContext, useState } from "react";

export const RecipeContext = createContext({
  dish_name: "",
  ingredients: [],
  match_percentage: 0,
  setIngredients: (ing: string[]) => {},
  setData: (data: { dish_name: string; match_percentage: number }) => {},
});

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [dish_name, setDish_name] = useState("");
  const [match_percentage, setMatch_percentage] = useState(0);
  const [ingredients, setIngredients] = useState<string[]>([]);

  return (
    <RecipeContext.Provider
      value={{
        dish_name,
        match_percentage,
        ingredients,
        setIngredients,
        setData: (data) => {
          setDish_name(data.dish_name);
          setMatch_percentage(data.match_percentage);
        },
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
