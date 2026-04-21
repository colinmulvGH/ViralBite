import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Ingredient {
  quantity: number;
  unit: string;
  name: string;
}

export interface MealSuggestion {
  mealType: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  benefits: string;
  imageSearchKeyword: string;
  baseServings: number;
}

export interface DayPlan {
  breakfast: MealSuggestion;
  lunch: MealSuggestion;
  dinner: MealSuggestion;
  snack: MealSuggestion;
  overallAdvice: string;
}

export async function generateDayPlan(
  feeling: string, 
  goals: string, 
  allergies: string, 
  avoidFoods: string
): Promise<DayPlan> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest a full day of meals (breakfast, lunch, dinner, and a snack) based on these parameters:
Feeling: ${feeling}
Goals: ${goals}
Allergies: ${allergies || 'None'}
Foods to Avoid: ${avoidFoods || 'None'}

Provide a structured response. For each meal, include:
[... same instructions as before but with structured ingredients ...]
2. A list of ingredients with 'quantity' (number), 'unit' (e.g., 'cups', 'units', 'grams'), and 'name' (e.g., 'oats', 'blueberries').
3. Step-by-step cooking instructions/directions.
4. Specific metabolic/wellness benefit.
5. A search keyword for a photo.
6. 'baseServings' (the number of people the provided ingredient quantities serve, usually 1 or 2).

Strictly adhere to the allergies and avoidance parameters.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakfast: {
            type: Type.OBJECT,
            properties: {
              mealType: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                  required: ["quantity", "unit", "name"]
                } 
              },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              benefits: { type: Type.STRING },
              imageSearchKeyword: { type: Type.STRING },
              baseServings: { type: Type.NUMBER },
            },
            required: ["mealType", "name", "description", "ingredients", "instructions", "benefits", "imageSearchKeyword", "baseServings"],
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              mealType: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                  required: ["quantity", "unit", "name"]
                }  
              },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              benefits: { type: Type.STRING },
              imageSearchKeyword: { type: Type.STRING },
              baseServings: { type: Type.NUMBER },
            },
            required: ["mealType", "name", "description", "ingredients", "instructions", "benefits", "imageSearchKeyword", "baseServings"],
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              mealType: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                  required: ["quantity", "unit", "name"]
                }  
              },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              benefits: { type: Type.STRING },
              imageSearchKeyword: { type: Type.STRING },
              baseServings: { type: Type.NUMBER },
            },
            required: ["mealType", "name", "description", "ingredients", "instructions", "benefits", "imageSearchKeyword", "baseServings"],
          },
          snack: {
            type: Type.OBJECT,
            properties: {
              mealType: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    name: { type: Type.STRING },
                  },
                  required: ["quantity", "unit", "name"]
                }  
              },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              benefits: { type: Type.STRING },
              imageSearchKeyword: { type: Type.STRING },
              baseServings: { type: Type.NUMBER },
            },
            required: ["mealType", "name", "description", "ingredients", "instructions", "benefits", "imageSearchKeyword", "baseServings"],
          },
          overallAdvice: { type: Type.STRING },
        },
        required: ["breakfast", "lunch", "dinner", "snack", "overallAdvice"],
      },
    },
  });

  return JSON.parse(response.text);
}
