export interface Instruction {
  description: string;
  step: string;
  time: number;
}

interface Unit {
  name: string;
  quantity: number;
  unit: string;
  confidence: number;
}

export type Ingredient = Unit;
export type Tool = Unit;

export interface Recipe {
  id: string;
  name: string;
  image: Blob;
  confidence: number;
  timestamp: string;
  ingredients: Ingredient[];
  tools: Tool[];
  instructions: Instruction[];
}
