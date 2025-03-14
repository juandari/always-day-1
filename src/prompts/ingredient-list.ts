export const ingredientListPrompt = (dishName: string) => `
Analyze the dish "${dishName}" and generate a list of core ingredients with exact measurements. Follow these rules:

1. Quantity Requirements:
   - Must be a SINGLE numeric value (integer or decimal)
   - NO ranges (e.g., "2-3" is forbidden)
   - NO approximations ("about", "approximately")
   - If typical recipes use varying amounts, choose the most common quantity

2. Unit Specifications:
   - Use standardized cooking units from this list:
     gram, kilogram, milliliter, liter, teaspoon, tablespoon, cup, piece, clove, pinch
   - Convert imperial to metric where appropriate
   - Use fractions only when essential (prefer 0.5 over 1/2)

3. Validation Rules:
   - Confidence score ≥ 75
   - Sort descending by confidence
   - Exclude optional/garnish items
   - Reject ingredients with unclear quantities
   - Do not include comments in the JSON

Return a JSON array formatted as:

[
  {
    "name": "flour", // singular form, no brand names
    "quantity": 250, // exact number only (no strings)
    "unit": "gram", // from approved unit list
    "confidence": 97 // probability score
  }
]

Invalid Examples to Avoid:
❌ "quantity": "2-3" 
❌ "quantity": "about 100"
❌ "unit": "handful"
❌ "unit": "handful"  // or milliliters for a soup
❌ "quantity": "several"
❌ "name": "spices" (too vague)
`;
