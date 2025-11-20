import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RecipeRecommendations = ({ currentRecipeId, userPreferences }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [currentRecipeId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Get recommendations based on current recipe or user preferences
      const params = new URLSearchParams();
      if (currentRecipeId) params.append('excludeId', currentRecipeId);
      if (userPreferences?.cuisine) params.append('cuisine', userPreferences.cuisine);
      if (userPreferences?.difficulty) params.append('difficulty', userPreferences.difficulty);
      
      params.append('limit', '6');
      params.append('sortBy', 'createdAt');
      
      const response = await api.get(`/api/recipes?${params}`);
      const recipes = response.data.recipes || response.data;
      setRecommendations(recipes.slice(0, 6));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-4">
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Finding perfect recipes for you...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-magic display-6 text-gradient-primary me-3"></i>
        <div>
          <h3 className="fw-bold mb-1 gradient-text">Recommended for You</h3>
          <p className="text-muted mb-0">Discover recipes you might love</p>
        </div>
      </div>

      <div className="row g-3">
        {recommendations.map((recipe, index) => (
          <div key={recipe._id} className="col-lg-4 col-md-6">
            <div 
              className="card recipe-recommendation-card h-100 cursor-pointer"
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {recipe.imageUrl ? (
                <div className="position-relative overflow-hidden" style={{ height: '150px' }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="card-img-top w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge glass-card px-2 py-1 text-white">
                      <i className="bi bi-star me-1"></i>
                      New
                    </span>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '150px' }}>
                  <i className="bi bi-image display-6 text-muted"></i>
                </div>
              )}

              <div className="card-body p-3">
                <h6 className="card-title fw-bold mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>
                  {recipe.title}
                </h6>
                
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {recipe.cuisine && (
                    <span className="badge" style={{ 
                      background: 'var(--primary-gradient)', 
                      color: 'white', 
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem'
                    }}>
                      {recipe.cuisine}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className="badge" style={{ 
                      background: 'var(--warning-gradient)', 
                      color: 'var(--gray-800)', 
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem'
                    }}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>

                {recipe.prepTime && (
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-clock me-1" style={{ fontSize: '0.8rem' }}></i>
                    <small>{recipe.prepTime}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/recipes')}
        >
          <i className="bi bi-collection me-2"></i>
          View All Recipes
        </button>
      </div>
    </div>
  );
};

export default RecipeRecommendations;
