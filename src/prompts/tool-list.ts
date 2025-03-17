export const toolListPrompt = (dishName: string) => `
Analyze the dish "${dishName}" and generate a list of cooking and serving tools that useful in the proccess of preparing the dish. Follow these rules:

1. Quantity Requirements:
  - Make it always 1

2. Validation Rules:
  - Confidence score ≥ 60
  - Provide clear descriptive name
  - Sort descending by confidence
  - Provide 15 or more tools
  - Do not include comments in the JSON

3. Criteria Rules:
  - Do not organic items
  - Do not include ingredients
  - Include basic kitchen tooling
  - Include supportive cooking tools
  - Include optional cooking tools
  - Include kitchen storage tools
  - Include dish serving tools

Return a JSON array formatted as:

[
  {
    "name": "frying pan", // singular form, 2 words minimum, no brand names
    "quantity": 1, // exact number only (no strings)
    "unit": "piece", // from approved unit list
    "confidence": 97 // probability score
  }
]

Invalid Examples to Avoid:
❌ "quantity": "2-3" 
❌ "quantity": "about 100"
❌ "quantity": "several"
❌ "name": "pan"
❌ "name": "knife"
❌ "name": "pot"

Valid Examples to Avoid:
✅ "quantity": "1" 
✅ "name": "frying pan"
✅ "name": "kichen knife"
✅ "name": "stewpan"
✅ "name": "steamer"
`;
