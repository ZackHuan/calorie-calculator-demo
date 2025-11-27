import React, { useState, useEffect } from 'react';
import { Ingredient, Food, FoodIngredient } from '../../types';
import { storageService } from '../../services/storageService';
import './Restaurant.css';

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
    <div className="restaurant-container">
      <h1>Restaurant Dashboard</h1>
      <p className="description">Create foods using approved ingredients and calculate nutritional values</p>

      <div className="content-wrapper">
        <div className="form-section">
          <h2>Create New Food</h2>
          <form onSubmit={handleCreateFood} className="food-form">
            <div className="form-group">
              <label htmlFor="foodName">Food Name</label>
              <input
                type="text"
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>

            <div className="add-ingredient-section">
              <h3>Add Ingredients</h3>
              {approvedIngredients.length === 0 ? (
                <p className="no-ingredients">No approved ingredients available. Please wait for nutritionist approval.</p>
              ) : (
                <div className="ingredient-selector">
                  <select
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
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
                  />
                  <button type="button" className="add-btn" onClick={addIngredientToFood}>
                    + Add
                  </button>
                </div>
              )}
            </div>

            {selectedIngredients.length > 0 && (
              <div className="selected-ingredients">
                <h3>Selected Ingredients</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Qty (g)</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fats</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIngredients.map((ing, index) => (
                      <tr key={index}>
                        <td>{ing.ingredientName}</td>
                        <td>{ing.quantity}g</td>
                        <td>{ing.calories}</td>
                        <td>{ing.protein}g</td>
                        <td>{ing.carbs}g</td>
                        <td>{ing.fats}g</td>
                        <td>
                          <button 
                            type="button" 
                            className="remove-btn"
                            onClick={() => removeIngredient(index)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="totals-row">
                      <td><strong>Total</strong></td>
                      <td></td>
                      <td><strong>{Math.round(totals.calories * 10) / 10}</strong></td>
                      <td><strong>{Math.round(totals.protein * 10) / 10}g</strong></td>
                      <td><strong>{Math.round(totals.carbs * 10) / 10}g</strong></td>
                      <td><strong>{Math.round(totals.fats * 10) / 10}g</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={!foodName || selectedIngredients.length === 0}
            >
              Create Food
            </button>
          </form>
        </div>

        <div className="list-section">
          <h2>My Foods</h2>
          {foods.length === 0 ? (
            <p className="no-data">No foods created yet.</p>
          ) : (
            <div className="foods-list">
              {foods.map(food => (
                <div key={food.id} className="food-card">
                  <div className="food-header">
                    <h3>{food.name}</h3>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="food-nutrition">
                    <div className="nutrition-box calories">
                      <span className="label">Calories</span>
                      <span className="value">{food.totalCalories}</span>
                    </div>
                    <div className="nutrition-box">
                      <span className="label">Protein</span>
                      <span className="value">{food.totalProtein}g</span>
                    </div>
                    <div className="nutrition-box">
                      <span className="label">Carbs</span>
                      <span className="value">{food.totalCarbs}g</span>
                    </div>
                    <div className="nutrition-box">
                      <span className="label">Fats</span>
                      <span className="value">{food.totalFats}g</span>
                    </div>
                  </div>
                  <div className="food-ingredients">
                    <span className="ingredients-label">Ingredients: </span>
                    {food.ingredients.map((ing, i) => (
                      <span key={i} className="ingredient-tag">
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
