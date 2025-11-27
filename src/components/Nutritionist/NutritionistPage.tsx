import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientStatus } from '../../types';
import { storageService } from '../../services/storageService';
import './Nutritionist.css';

const NutritionistPage: React.FC = () => {
  const [pendingIngredients, setPendingIngredients] = useState<Ingredient[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = () => {
    const all = storageService.getIngredients();
    setAllIngredients(all);
    setPendingIngredients(all.filter(i => i.status === 'pending'));
  };

  const handleApprove = (ingredientId: string) => {
    const ingredient = allIngredients.find(i => i.id === ingredientId);
    if (ingredient) {
      storageService.updateIngredient({ ...ingredient, status: 'approved' as IngredientStatus });
      loadIngredients();
    }
  };

  const handleReject = (ingredientId: string) => {
    const ingredient = allIngredients.find(i => i.id === ingredientId);
    if (ingredient) {
      storageService.updateIngredient({ ...ingredient, status: 'rejected' as IngredientStatus });
      loadIngredients();
    }
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
    <div className="nutritionist-container">
      <h1>Nutritionist Dashboard</h1>
      <p className="description">Review and approve ingredient submissions</p>

      <div className="content-wrapper">
        <div className="section pending-section">
          <h2>Pending Approval ({pendingIngredients.length})</h2>
          {pendingIngredients.length === 0 ? (
            <p className="no-data">No pending ingredients to review.</p>
          ) : (
            <div className="ingredients-list">
              {pendingIngredients.map(ingredient => (
                <div key={ingredient.id} className="ingredient-card pending">
                  <div className="ingredient-header">
                    <h3>{ingredient.name}</h3>
                    <span className="category-tag">{ingredient.category}</span>
                  </div>
                  <div className="nutrition-details">
                    <div className="nutrition-row">
                      <div className="nutrition-item">
                        <span className="label">Calories</span>
                        <span className="value">{ingredient.calories} kcal</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Protein</span>
                        <span className="value">{ingredient.protein}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Carbs</span>
                        <span className="value">{ingredient.carbs}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Fats</span>
                        <span className="value">{ingredient.fats}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(ingredient.id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(ingredient.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section history-section">
          <h2>All Ingredients</h2>
          {allIngredients.length === 0 ? (
            <p className="no-data">No ingredients in the system.</p>
          ) : (
            <div className="ingredients-list">
              {allIngredients.map(ingredient => (
                <div key={ingredient.id} className={`ingredient-card ${ingredient.status}`}>
                  <div className="ingredient-header">
                    <h3>{ingredient.name}</h3>
                    {getStatusBadge(ingredient.status)}
                  </div>
                  <p className="category">{ingredient.category}</p>
                  <div className="nutrition-info">
                    <span>{ingredient.calories} kcal</span>
                    <span>P: {ingredient.protein}g</span>
                    <span>C: {ingredient.carbs}g</span>
                    <span>F: {ingredient.fats}g</span>
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

export default NutritionistPage;
