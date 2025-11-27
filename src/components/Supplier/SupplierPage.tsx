import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientStatus } from '../../types';
import { storageService } from '../../services/storageService';

const CATEGORIES = ['Vegetables', 'Fruits', 'Meat', 'Dairy', 'Grains', 'Oils', 'Spices', 'Other'];

const SupplierPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = () => {
    setIngredients(storageService.getIngredients());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name: formData.name,
      category: formData.category,
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fats: parseFloat(formData.fats) || 0,
      status: 'pending' as IngredientStatus,
    };

    storageService.addIngredient(newIngredient);
    loadIngredients();
    
    // Reset form
    setFormData({
      name: '',
      category: CATEGORIES[0],
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    });
  };

  const getStatusBadge = (status: IngredientStatus) => {
    const statusClasses: Record<IngredientStatus, string> = {
      pending: 'bg-yellow-500 text-white',
      approved: 'bg-green-600 text-white',
      rejected: 'bg-red-500 text-white',
    };
    return <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-slate-700 mb-1 text-2xl font-bold">Supplier Dashboard</h1>
      <p className="text-gray-500 mb-8">Add new ingredients for approval</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">Add New Ingredient</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-medium text-gray-600">Ingredient Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Chicken Breast"
                className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="category" className="font-medium text-gray-600">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="calories" className="font-medium text-gray-600">Calories (per 100g)</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="0"
                  className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="protein" className="font-medium text-gray-600">Protein (g per 100g)</label>
                <input
                  type="number"
                  id="protein"
                  name="protein"
                  value={formData.protein}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="0"
                  className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="carbs" className="font-medium text-gray-600">Carbs (g per 100g)</label>
                <input
                  type="number"
                  id="carbs"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="0"
                  className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="fats" className="font-medium text-gray-600">Fats (g per 100g)</label>
                <input
                  type="number"
                  id="fats"
                  name="fats"
                  value={formData.fats}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="0"
                  className="p-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button type="submit" className="bg-green-600 text-white border-none py-3 px-6 rounded-md text-base cursor-pointer transition-colors mt-2 hover:bg-green-700">Add Ingredient</button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">My Submitted Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No ingredients submitted yet.</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
              {ingredients.map(ingredient => (
                <div key={ingredient.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="m-0 text-slate-700 text-lg">{ingredient.name}</h3>
                    {getStatusBadge(ingredient.status)}
                  </div>
                  <p className="text-gray-500 text-sm m-0 mb-2.5">{ingredient.category}</p>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">Calories: {ingredient.calories}</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">Protein: {ingredient.protein}g</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">Carbs: {ingredient.carbs}g</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">Fats: {ingredient.fats}g</span>
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

export default SupplierPage;
