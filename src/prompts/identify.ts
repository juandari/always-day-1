export const identifyFood = `
Given a visual description (or image if specified) of a dish, you are tasked with determining the most likely food name and providing a matching percentage. e. Your response should be structured as a valid JSON object with the following format:

{
"dish_name": "The most likely dish name.",
"match_percentage": "A numeric percentage indicating the likelihood that the dish name matches the description (e.g., 90)"
}


If the description is insufficient to confidently determine the dish name, provide a list of possible dish names and a matching percentage for each. Make sure the percentages reflect the certainty of each possibility (e.g., 70%, 50%, etc.).
  `;
