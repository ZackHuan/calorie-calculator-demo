import { Ingredient, Food, IngredientStatus } from '../types';

const INGREDIENTS_KEY = 'calorie_calculator_ingredients';
const FOODS_KEY = 'calorie_calculator_foods';

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Lamb Mince', category: 'Meat', calories: 808, protein: 23.9, carbs: 3.2, fats: 12.2, status: 'pending' as IngredientStatus },
  { id: '2', name: 'Beef Cubes', category: 'Meat', calories: 620, protein: 19.1, carbs: 7.1, fats: 10.1, status: 'pending' as IngredientStatus },
  { id: '3', name: 'Shish Tawook Chicken', category: 'Meat', calories: 399, protein: 6.5, carbs: 9.8, fats: 8.8, status: 'pending' as IngredientStatus },
  { id: '4', name: 'Chicken Liver', category: 'Meat', calories: 293, protein: 13.3, carbs: 4.4, fats: 7.6, status: 'pending' as IngredientStatus },
  { id: '5', name: 'Beef Shawarma Strips', category: 'Meat', calories: 700, protein: 13.3, carbs: 8.2, fats: 9.4, status: 'pending' as IngredientStatus },
  { id: '6', name: 'Okra', category: 'Vegetable', calories: 897, protein: 23.9, carbs: 1.3, fats: 11.2, status: 'pending' as IngredientStatus },
  { id: '7', name: 'Eggplant', category: 'Vegetable', calories: 461, protein: 19.1, carbs: 5.5, fats: 6.1, status: 'pending' as IngredientStatus },
  { id: '8', name: 'Zucchini', category: 'Vegetable', calories: 782, protein: 6.5, carbs: 2.9, fats: 4.4, status: 'pending' as IngredientStatus },
  { id: '9', name: 'Tomatoes', category: 'Vegetable', calories: 268, protein: 13.3, carbs: 7.6, fats: 2.3, status: 'pending' as IngredientStatus },
  { id: '10', name: 'Cucumbers', category: 'Vegetable', calories: 778, protein: 13.3, carbs: 9.1, fats: 3.3, status: 'pending' as IngredientStatus },
  { id: '11', name: 'Pita Bread', category: 'Bread', calories: 161, protein: 23.9, carbs: 4.8, fats: 1.1, status: 'approved' as IngredientStatus },
  { id: '12', name: 'Saj Bread', category: 'Bread', calories: 178, protein: 19.1, carbs: 6.7, fats: 5.5, status: 'approved' as IngredientStatus },
  { id: '13', name: 'Labneh', category: 'Dairy', calories: 99, protein: 6.5, carbs: 8.4, fats: 7.7, status: 'approved' as IngredientStatus },
  { id: '14', name: 'Halloumi Cheese', category: 'Dairy', calories: 575, protein: 13.3, carbs: 2.2, fats: 9.9, status: 'rejected' as IngredientStatus },
  { id: '15', name: 'Feta Cheese', category: 'Dairy', calories: 135, protein: 13.3, carbs: 5.9, fats: 10.0, status: 'rejected' as IngredientStatus },
];

export const storageService = {
  // Ingredients
  getIngredients(): Ingredient[] {
    const data = localStorage.getItem(INGREDIENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with default ingredients if no data exists
    this.saveIngredients(INITIAL_INGREDIENTS);
    return INITIAL_INGREDIENTS;
  },

  saveIngredients(ingredients: Ingredient[]): void {
    localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients));
  },

  addIngredient(ingredient: Ingredient): void {
    const ingredients = this.getIngredients();
    ingredients.push(ingredient);
    this.saveIngredients(ingredients);
  },

  updateIngredient(updatedIngredient: Ingredient): void {
    const ingredients = this.getIngredients();
    const index = ingredients.findIndex(i => i.id === updatedIngredient.id);
    if (index !== -1) {
      ingredients[index] = updatedIngredient;
      this.saveIngredients(ingredients);
    }
  },

  getApprovedIngredients(): Ingredient[] {
    return this.getIngredients().filter(i => i.status === 'approved');
  },

  getPendingIngredients(): Ingredient[] {
    return this.getIngredients().filter(i => i.status === 'pending');
  },

  // Foods
  getFoods(): Food[] {
    const data = localStorage.getItem(FOODS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveFoods(foods: Food[]): void {
    localStorage.setItem(FOODS_KEY, JSON.stringify(foods));
  },

  addFood(food: Food): void {
    const foods = this.getFoods();
    foods.push(food);
    this.saveFoods(foods);
  },

  deleteFood(foodId: string): void {
    const foods = this.getFoods().filter(f => f.id !== foodId);
    this.saveFoods(foods);
  },
};
