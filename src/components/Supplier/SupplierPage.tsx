import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientStatus } from '../../types';
import { storageService } from '../../services/storageService';
import './Supplier.css';

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
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="supplier-container">
      <h1>Supplier Dashboard</h1>
      <p className="description">Add new ingredients for approval</p>

      <div className="content-wrapper">
        <div className="form-section">
          <h2>Add New Ingredient</h2>
          <form onSubmit={handleSubmit} className="ingredient-form">
            <div className="form-group">
              <label htmlFor="name">Ingredient Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Chicken Breast"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories">Calories (per 100g)</label>
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein">Protein (g per 100g)</label>
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
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="carbs">Carbs (g per 100g)</label>
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="fats">Fats (g per 100g)</label>
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
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">Add Ingredient</button>
          </form>
        </div>

        <div className="list-section">
          <h2>My Submitted Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="no-data">No ingredients submitted yet.</p>
          ) : (
            <div className="ingredients-list">
              {ingredients.map(ingredient => (
                <div key={ingredient.id} className="ingredient-card">
                  <div className="ingredient-header">
                    <h3>{ingredient.name}</h3>
                    {getStatusBadge(ingredient.status)}
                  </div>
                  <p className="category">{ingredient.category}</p>
                  <div className="nutrition-info">
                    <span>Calories: {ingredient.calories}</span>
                    <span>Protein: {ingredient.protein}g</span>
                    <span>Carbs: {ingredient.carbs}g</span>
                    <span>Fats: {ingredient.fats}g</span>
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
