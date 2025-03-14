import { createContext, useContext, useState } from "react";

export const RecipeContext = createContext({
  dish_name: "",
	inggredients: "",
  match_percentage: 0,
	setIngredients: (ing: string) => {},
  setData: (data: { dish_name: string; match_percentage: number }) => {},
});

export const useRecipe = () => {
  return useContext(RecipeContext);
};

export const RecipeProvider = ({ children }) => {
  const [dish_name, setDish_name] = useState("");
  const [match_percentage, setMatch_percentage] = useState(0);
	const [inggredients, setIngredients] = useState("");

  return (
    <RecipeContext.Provider
      value={{
        dish_name,
        match_percentage,
				inggredients,
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
