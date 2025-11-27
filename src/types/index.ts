export type IngredientStatus = 'pending' | 'approved' | 'rejected';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  status: IngredientStatus;
}

export interface Food {
  id: string;
  name: string;
  ingredients: FoodIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface FoodIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
