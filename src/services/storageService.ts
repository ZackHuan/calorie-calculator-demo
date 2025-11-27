import { Ingredient, Food } from '../types';

const INGREDIENTS_KEY = 'calorie_calculator_ingredients';
const FOODS_KEY = 'calorie_calculator_foods';

export const storageService = {
  // Ingredients
  getIngredients(): Ingredient[] {
    const data = localStorage.getItem(INGREDIENTS_KEY);
    return data ? JSON.parse(data) : [];
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
