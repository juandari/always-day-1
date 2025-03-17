export const getMockProductList = (ingredients: string[], tools: string[]) => {
  return {
    ingredients: ingredients.map((ingredient) => ({
      name: ingredient,
      link: new URL(`https://www.tokopedia.com/find/${ingredient}`),
    })),
    tools: tools.map((tool) => ({
      name: tool,
      link: new URL(`https://www.tokopedia.com/find/${tool}`),
    })),
  };
};
