import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MealPlanningCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState({ date: null, mealType: null });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mealSuggestions, setMealSuggestions] = useState([]);

  const userId = localStorage.getItem('userId');
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    if (userId) {
      fetchMealPlans();
    }
  }, [currentDate, userId]);

  const fetchMealPlans = async () => {
    // Get start and end of the current week (Sunday to Saturday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    try {
      const response = await axios.get(`http://localhost:5000/api/meal-plans`, {
        params: {
          userId,
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString()
        }
      });

      const plansMap = {};
      response.data.forEach(plan => {
        const dateKey = new Date(plan.date).toDateString();
        plansMap[dateKey] = plan;
      });
      setMealPlans(plansMap);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(response.data.recipes || response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchMealSuggestions = async (mealType) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/meal-plans/suggestions`, {
        params: { userId, mealType }
      });
      setMealSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching meal suggestions:', error);
    }
  };

  const openMealModal = (date, mealType) => {
    setSelectedMeal({ date, mealType });
    setSelectedDate(date);
    setShowMealModal(true);
    fetchRecipes();
    fetchMealSuggestions(mealType);
  };

  const saveMeal = async (recipeId, customMeal, servings = 1) => {
    setLoading(true);
    try {
      const dateKey = selectedDate.toDateString();
      const existingPlan = mealPlans[dateKey] || { meals: {} };
      
      const updatedMeals = {
        ...existingPlan.meals,
        [selectedMeal.mealType]: {
          recipeId: recipeId || null,
          customMeal: customMeal || '',
          servings
        }
      };

      await axios.post('http://localhost:5000/api/meal-plans', {
        userId,
        date: selectedDate.toISOString(),
        meals: updatedMeals
      });

      await fetchMealPlans();
      setShowMealModal(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = async () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    try {
      await axios.post('http://localhost:5000/api/shopping-lists/generate', {
        userId,
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        name: `Weekly Shopping List - ${startOfWeek.toLocaleDateString()}`
      });
      
      alert('Shopping list generated successfully!');
      navigate('/shopping-lists');
    } catch (error) {
      console.error('Error generating shopping list:', error);
      alert('Failed to generate shopping list');
    }
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: 'bi-sunrise',
      lunch: 'bi-sun',
      dinner: 'bi-moon',
      snack: 'bi-cup-straw'
    };
    return icons[mealType] || 'bi-circle';
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (7 * direction));
    setCurrentDate(newDate);
  };

  if (!userId) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="glass-card p-5 mx-auto" style={{ maxWidth: '400px' }}>
            <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
            <h3>Login Required</h3>
            <p className="text-muted">Please log in to access meal planning.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="fw-bold gradient-text mb-2">
                    <i className="bi bi-calendar-week me-3"></i>
                    Weekly Meal Planner
                  </h1>
                  <p className="text-muted mb-0">Plan meals for this week and generate a shopping list</p>
                </div>
                <button
                  className="btn btn-success btn-lg"
                  onClick={generateShoppingList}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Generate Shopping List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-3">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigateWeek(-1)}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <h3 className="fw-bold mb-0">
                  {(() => {
                    const start = new Date(currentDate);
                    start.setDate(currentDate.getDate() - currentDate.getDay());
                    const end = new Date(start);
                    end.setDate(start.getDate() + 6);
                    const opts = { month: 'short', day: 'numeric' };
                    return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
                  })()}
                </h3>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigateWeek(1)}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="glass-card p-4">
          {/* Day Headers */}
          <div className="row mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="col text-center">
                <strong className="text-muted">{day}</strong>
              </div>
            ))}
          </div>
          {/* Week Days */}
          <div className="row mb-3">
            {getWeekDays().map((date, dayIndex) => {
              const dateKey = date.toDateString();
              const dayMeals = mealPlans[dateKey]?.meals || {};
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={dayIndex} className="col">
                  <div className={`day-card p-2 rounded ${isToday ? 'border-primary' : ''}`} style={{ minHeight: '120px', border: '1px solid #e9ecef' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`fw-bold ${isToday ? 'text-primary' : ''}`}>
                        {date.getDate()}
                      </span>
                      {isToday && <small className="badge bg-primary">Today</small>}
                    </div>

                    <div className="meals">
                      {mealTypes.map(mealType => {
                        const meal = dayMeals[mealType];
                        const hasContent = meal && (meal.recipeId || meal.customMeal);

                        return (
                          <div
                            key={mealType}
                            className={`meal-slot p-1 mb-1 rounded cursor-pointer ${hasContent ? 'bg-light' : 'bg-transparent border-dashed'}`}
                            onClick={() => openMealModal(date, mealType)}
                            style={{ 
                              cursor: 'pointer', 
                              fontSize: '0.75rem',
                              border: hasContent ? '1px solid #dee2e6' : '1px dashed #dee2e6'
                            }}
                          >
                            <i className={`bi ${getMealIcon(mealType)} me-1`}></i>
                            {hasContent ? (
                              <span className="text-truncate">
                                {meal.recipeId?.title || meal.customMeal}
                              </span>
                            ) : (
                              <span className="text-muted">+ {mealType}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meal Selection Modal */}
        {showMealModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`bi ${getMealIcon(selectedMeal.mealType)} me-2`}></i>
                    Plan {selectedMeal.mealType} for {selectedDate?.toLocaleDateString()}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowMealModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Meal Suggestions */}
                  {mealSuggestions.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-magic me-2"></i>
                        Suggested Recipes
                      </h6>
                      <div className="row g-3">
                        {mealSuggestions.map(recipe => (
                          <div key={recipe._id} className="col-md-6">
                            <div 
                              className="card recipe-suggestion cursor-pointer"
                              onClick={() => saveMeal(recipe._id, '', 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="row g-0">
                                <div className="col-4">
                                  {recipe.imageUrl ? (
                                    <img
                                      src={recipe.imageUrl}
                                      className="img-fluid rounded-start h-100"
                                      style={{ objectFit: 'cover' }}
                                      alt={recipe.title}
                                    />
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded-start">
                                      <i className="bi bi-image text-muted"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="col-8">
                                  <div className="card-body p-3">
                                    <h6 className="card-title mb-1">{recipe.title}</h6>
                                    <small className="text-muted">
                                      {recipe.prepTime} • {recipe.difficulty}
                                    </small>
                                    {recipe.averageRating > 0 && (
                                      <div className="mt-1">
                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                        <small>{recipe.averageRating.toFixed(1)}</small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <hr />
                    </div>
                  )}

                  {/* Custom Meal Input */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Or add a custom meal:</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter meal description..."
                        id="customMeal"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          const customMeal = document.getElementById('customMeal').value;
                          if (customMeal.trim()) {
                            saveMeal(null, customMeal, 1);
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        Add Meal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanningCalendar;
