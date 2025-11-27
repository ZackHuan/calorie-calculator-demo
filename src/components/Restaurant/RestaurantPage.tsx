import React, { useState, useEffect } from 'react';
import { Ingredient, Food, FoodIngredient } from '../../types';
import { storageService } from '../../services/storageService';

const RestaurantPage: React.FC = () => {
  const [approvedIngredients, setApprovedIngredients] = useState<Ingredient[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodName, setFoodName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<FoodIngredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<string>('100');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApprovedIngredients(storageService.getApprovedIngredients());
    setFoods(storageService.getFoods());
  };

  const addIngredientToFood = () => {
    if (!currentIngredient || !currentQuantity) return;
    
    const ingredient = approvedIngredients.find(i => i.id === currentIngredient);
    if (!ingredient) return;

    const quantity = parseFloat(currentQuantity);
    const multiplier = quantity / 100;

    const foodIngredient: FoodIngredient = {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity: quantity,
      calories: Math.round(ingredient.calories * multiplier * 10) / 10,
      protein: Math.round(ingredient.protein * multiplier * 10) / 10,
      carbs: Math.round(ingredient.carbs * multiplier * 10) / 10,
      fats: Math.round(ingredient.fats * multiplier * 10) / 10,
    };

    setSelectedIngredients([...selectedIngredients, foodIngredient]);
    setCurrentIngredient('');
    setCurrentQuantity('100');
  };

  const removeIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return selectedIngredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + ing.calories,
        protein: acc.protein + ing.protein,
        carbs: acc.carbs + ing.carbs,
        fats: acc.fats + ing.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || selectedIngredients.length === 0) return;

    const totals = calculateTotals();
    const newFood: Food = {
      id: crypto.randomUUID(),
      name: foodName,
      ingredients: selectedIngredients,
      totalCalories: Math.round(totals.calories * 10) / 10,
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFats: Math.round(totals.fats * 10) / 10,
    };

    storageService.addFood(newFood);
    loadData();
    
    // Reset form
    setFoodName('');
    setSelectedIngredients([]);
  };

  const handleDeleteFood = (foodId: string) => {
    storageService.deleteFood(foodId);
    loadData();
  };

  const totals = calculateTotals();

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-slate-700 mb-1 text-2xl font-bold">Restaurant Dashboard</h1>
      <p className="text-gray-500 mb-8">Create foods using approved ingredients and calculate nutritional values</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">Create New Food</h2>
          <form onSubmit={handleCreateFood} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="foodName" className="font-medium text-gray-600">Food Name</label>
              <input
                type="text"
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
                placeholder="e.g., Grilled Chicken Salad"
                className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <h3 className="text-base text-slate-600 mb-2.5">Add Ingredients</h3>
              {approvedIngredients.length === 0 ? (
                <p className="text-gray-400 text-sm p-4 bg-gray-50 rounded-md">No approved ingredients available. Please wait for nutritionist approval.</p>
              ) : (
                <div className="flex gap-2.5 flex-wrap md:flex-nowrap">
                  <select
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    className="flex-[2] p-2.5 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select ingredient...</option>
                    {approvedIngredients.map(ing => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.calories} kcal/100g)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    min="1"
                    placeholder="Quantity (g)"
                    className="flex-1 p-2.5 border border-gray-300 rounded-md text-sm"
                  />
                  <button type="button" className="bg-blue-500 text-white border-none py-2.5 px-5 rounded-md cursor-pointer font-medium transition-colors hover:bg-blue-600" onClick={addIngredientToFood}>
                    + Add
                  </button>
                </div>
              )}
            </div>

            {selectedIngredients.length > 0 && (
              <div className="mt-2.5">
                <h3 className="text-base text-slate-600 mb-2.5">Selected Ingredients</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Ingredient</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Qty (g)</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Calories</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Protein</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Carbs</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm">Fats</th>
                      <th className="p-2.5 text-left border-b border-gray-200 bg-gray-50 text-gray-600 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIngredients.map((ing, index) => (
                      <tr key={index}>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.ingredientName}</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.quantity}g</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.calories}</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.protein}g</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.carbs}g</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">{ing.fats}g</td>
                        <td className="p-2.5 text-sm border-b border-gray-100">
                          <button 
                            type="button" 
                            className="bg-red-500 text-white border-none w-6 h-6 rounded-full cursor-pointer text-xs transition-colors hover:bg-red-600"
                            onClick={() => removeIngredient(index)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50">
                      <td className="p-2.5 text-sm border-b border-gray-100"><strong>Total</strong></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"><strong>{Math.round(totals.calories * 10) / 10}</strong></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"><strong>{Math.round(totals.protein * 10) / 10}g</strong></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"><strong>{Math.round(totals.carbs * 10) / 10}g</strong></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"><strong>{Math.round(totals.fats * 10) / 10}g</strong></td>
                      <td className="p-2.5 text-sm border-b border-gray-100"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <button 
              type="submit" 
              className="bg-green-600 text-white border-none py-3.5 px-6 rounded-md text-base cursor-pointer transition-colors hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!foodName || selectedIngredients.length === 0}
            >
              Create Food
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">My Foods</h2>
          {foods.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No foods created yet.</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {foods.map(food => (
                <div key={food.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-slate-700 text-lg">{food.name}</h3>
                    <button 
                      className="bg-transparent text-red-500 border border-red-500 py-1 px-3 rounded cursor-pointer text-sm transition-colors hover:bg-red-500 hover:text-white"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 mb-4">
                    <div className="bg-green-600 p-2.5 rounded-md text-center">
                      <span className="block text-xs text-white/80 uppercase">Calories</span>
                      <span className="block text-lg font-semibold text-white">{food.totalCalories}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-md text-center">
                      <span className="block text-xs text-gray-500 uppercase">Protein</span>
                      <span className="block text-lg font-semibold text-slate-700">{food.totalProtein}g</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-md text-center">
                      <span className="block text-xs text-gray-500 uppercase">Carbs</span>
                      <span className="block text-lg font-semibold text-slate-700">{food.totalCarbs}g</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-md text-center">
                      <span className="block text-xs text-gray-500 uppercase">Fats</span>
                      <span className="block text-lg font-semibold text-slate-700">{food.totalFats}g</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Ingredients: </span>
                    {food.ingredients.map((ing, i) => (
                      <span key={i} className="inline-block bg-gray-200 py-0.5 px-2 rounded m-0.5 text-xs">
                        {ing.ingredientName} ({ing.quantity}g)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
