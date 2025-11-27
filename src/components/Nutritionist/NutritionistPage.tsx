import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientStatus } from '../../types';
import { storageService } from '../../services/storageService';

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
      pending: 'bg-yellow-500 text-white',
      approved: 'bg-green-600 text-white',
      rejected: 'bg-red-500 text-white',
    };
    return <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold uppercase ${statusClasses[status]}`}>{status}</span>;
  };

  const getCardBorderColor = (status: IngredientStatus) => {
    const colors: Record<IngredientStatus, string> = {
      pending: 'border-l-yellow-500',
      approved: 'border-l-green-600',
      rejected: 'border-l-red-500',
    };
    return colors[status];
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-slate-700 mb-1 text-2xl font-bold">Nutritionist Dashboard</h1>
      <p className="text-gray-500 mb-8">Review and approve ingredient submissions</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-yellow-500">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">Pending Approval ({pendingIngredients.length})</h2>
          {pendingIngredients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending ingredients to review.</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {pendingIngredients.map(ingredient => (
                <div key={ingredient.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-yellow-500">
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="m-0 text-slate-700 text-lg">{ingredient.name}</h3>
                    <span className="bg-blue-500 text-white py-0.5 px-2.5 rounded-xl text-xs">{ingredient.category}</span>
                  </div>
                  <div className="mb-4">
                    <div className="grid grid-cols-4 gap-2.5">
                      <div className="flex flex-col items-center bg-gray-200 p-2.5 rounded-md">
                        <span className="text-xs text-gray-500 uppercase">Calories</span>
                        <span className="text-base font-semibold text-slate-700">{ingredient.calories} kcal</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-200 p-2.5 rounded-md">
                        <span className="text-xs text-gray-500 uppercase">Protein</span>
                        <span className="text-base font-semibold text-slate-700">{ingredient.protein}g</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-200 p-2.5 rounded-md">
                        <span className="text-xs text-gray-500 uppercase">Carbs</span>
                        <span className="text-base font-semibold text-slate-700">{ingredient.carbs}g</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-200 p-2.5 rounded-md">
                        <span className="text-xs text-gray-500 uppercase">Fats</span>
                        <span className="text-base font-semibold text-slate-700">{ingredient.fats}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      className="flex-1 py-2.5 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-colors bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleApprove(ingredient.id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="flex-1 py-2.5 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-colors bg-red-500 text-white hover:bg-red-600"
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

        <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-blue-500">
          <h2 className="mb-5 text-slate-600 text-xl font-semibold">All Ingredients</h2>
          {allIngredients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No ingredients in the system.</p>
          ) : (
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {allIngredients.map(ingredient => (
                <div key={ingredient.id} className={`bg-gray-50 rounded-lg p-4 border-l-4 ${getCardBorderColor(ingredient.status)}`}>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="m-0 text-slate-700 text-lg">{ingredient.name}</h3>
                    {getStatusBadge(ingredient.status)}
                  </div>
                  <p className="text-gray-500 text-sm m-0 mb-2.5">{ingredient.category}</p>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">{ingredient.calories} kcal</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">P: {ingredient.protein}g</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">C: {ingredient.carbs}g</span>
                    <span className="bg-gray-200 py-1 px-2 rounded text-sm text-gray-600">F: {ingredient.fats}g</span>
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
