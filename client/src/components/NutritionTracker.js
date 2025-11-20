import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NutritionTracker = ({ recipeId, servings = 1 }) => {
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentServings, setCurrentServings] = useState(servings);

  // Mock nutrition calculation based on ingredients
  const calculateNutrition = (ingredients) => {
    // This is a simplified calculation - in production, you'd use a nutrition API
    const ingredientNutrition = {
      // Common ingredients with approximate nutrition per 100g
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
      'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
      'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
      'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
      'oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
      'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
      'flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
      'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
      'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
      'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
      'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0 },
      'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
      'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
      'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }
    };

    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    const ingredientList = ingredients.toLowerCase().split(/[,\n]/).map(ing => ing.trim());
    
    ingredientList.forEach(ingredient => {
      Object.keys(ingredientNutrition).forEach(key => {
        if (ingredient.includes(key)) {
          // Estimate quantity (simplified - assumes 100g per ingredient)
          const quantity = 0.5; // Rough estimate
          const nutrition = ingredientNutrition[key];
          totalNutrition.calories += nutrition.calories * quantity;
          totalNutrition.protein += nutrition.protein * quantity;
          totalNutrition.carbs += nutrition.carbs * quantity;
          totalNutrition.fat += nutrition.fat * quantity;
          totalNutrition.fiber += nutrition.fiber * quantity;
        }
      });
    });

    return {
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carbs: Math.round(totalNutrition.carbs * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10,
      fiber: Math.round(totalNutrition.fiber * 10) / 10
    };
  };

  useEffect(() => {
    fetchNutritionData();
  }, [recipeId]);

  const fetchNutritionData = async () => {
    if (!recipeId) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
      const recipe = response.data;
      
      if (recipe.ingredients) {
        const nutrition = calculateNutrition(recipe.ingredients);
        setNutritionData(nutrition);
      }
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustedNutrition = nutritionData ? {
    calories: Math.round((nutritionData.calories * currentServings) / servings),
    protein: Math.round(((nutritionData.protein * currentServings) / servings) * 10) / 10,
    carbs: Math.round(((nutritionData.carbs * currentServings) / servings) * 10) / 10,
    fat: Math.round(((nutritionData.fat * currentServings) / servings) * 10) / 10,
    fiber: Math.round(((nutritionData.fiber * currentServings) / servings) * 10) / 10
  } : null;

  if (loading) {
    return (
      <div className="glass-card p-4">
        <div className="text-center">
          <div className="loading-spinner mb-2"></div>
          <small className="text-muted">Calculating nutrition...</small>
        </div>
      </div>
    );
  }

  if (!nutritionData) return null;

  return (
    <div className="glass-card p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">
          <i className="bi bi-heart-pulse me-2 text-success"></i>
          Nutrition Facts
        </h5>
        <div className="d-flex align-items-center">
          <small className="text-muted me-2">Servings:</small>
          <div className="input-group" style={{ width: '100px' }}>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="form-control form-control-sm text-center"
              value={currentServings}
              onChange={(e) => setCurrentServings(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setCurrentServings(currentServings + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Calories */}
        <div className="col-12">
          <div className="nutrition-item p-3 rounded" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-0 text-white">{adjustedNutrition.calories}</h3>
                <small className="text-white opacity-75">Calories</small>
              </div>
              <i className="bi bi-fire display-6 text-white opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Macronutrients */}
        <div className="col-6 col-md-3">
          <div className="nutrition-item p-3 rounded text-center" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <i className="bi bi-egg display-6 text-primary mb-2"></i>
            <h5 className="fw-bold mb-0">{adjustedNutrition.protein}g</h5>
            <small className="text-muted">Protein</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="nutrition-item p-3 rounded text-center" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <i className="bi bi-wheat display-6 text-warning mb-2"></i>
            <h5 className="fw-bold mb-0">{adjustedNutrition.carbs}g</h5>
            <small className="text-muted">Carbs</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="nutrition-item p-3 rounded text-center" style={{ background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' }}>
            <i className="bi bi-droplet display-6 text-info mb-2"></i>
            <h5 className="fw-bold mb-0">{adjustedNutrition.fat}g</h5>
            <small className="text-muted">Fat</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="nutrition-item p-3 rounded text-center" style={{ background: 'linear-gradient(135d, #89f7fe 0%, #66a6ff 100%)' }}>
            <i className="bi bi-leaf display-6 text-success mb-2"></i>
            <h5 className="fw-bold mb-0">{adjustedNutrition.fiber}g</h5>
            <small className="text-muted">Fiber</small>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Nutrition values are estimated based on ingredients. Actual values may vary.
        </small>
      </div>
    </div>
  );
};

export default NutritionTracker;
