import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeList = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container-fluid py-5" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh'}}>
      {/* Modern Header Section */}
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-collection display-4 text-gradient-primary"></i>
              </div>
              <h1 className="display-4 fw-bold gradient-text mb-3">Recipe Collection</h1>
              <p className="lead text-muted mb-4">Discover and share amazing recipes from our passionate community</p>
              <button
                className="btn btn-primary btn-lg px-5 bounce-in"
                onClick={() => navigate('/add-recipe')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Share Your Recipe
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="glass-card p-5 mx-auto" style={{maxWidth: '400px'}}>
              <div className="loading-spinner mb-3"></div>
              <h4 className="fw-bold mb-2">Loading Recipes</h4>
              <p className="text-muted mb-0">Discovering delicious recipes for you...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-5">
            <div className="glass-card p-5 mx-auto" style={{maxWidth: '500px'}}>
              <div className="mb-4">
                <i className="bi bi-egg-fried display-1 text-gradient-primary"></i>
              </div>
              <h3 className="fw-bold mb-3 gradient-text">No Recipes Yet</h3>
              <p className="text-muted mb-4">Be the pioneer! Share the first delicious recipe with our community.</p>
              <button
                className="btn btn-primary btn-lg px-5"
                onClick={() => navigate('/add-recipe')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create First Recipe
              </button>
            </div>
          </div>
        )}

        {/* Modern Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <div className="row g-4">
            {recipes.map((recipe, index) => (
              <div 
                key={recipe._id} 
                className="col-lg-4 col-md-6 col-sm-12 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card recipe-card h-100">
                  {/* Recipe Image with Overlay */}
                  {recipe.imageUrl ? (
                    <div className="position-relative overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="card-img-top"
                        style={{ height: '280px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 recipe-overlay" style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}></div>
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge glass-card px-3 py-2 text-white">
                          <i className="bi bi-heart me-1"></i>
                          Featured
                        </span>
                      </div>
                      <div className="position-absolute bottom-0 start-0 p-3 text-white recipe-quick-info" style={{opacity: 0, transition: 'opacity 0.3s ease'}}>
                        <small className="fw-semibold">
                          <i className="bi bi-clock me-1"></i>
                          {recipe.prepTime && recipe.cookTime ? `${recipe.prepTime} + ${recipe.cookTime}` : 'Quick Recipe'}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="recipe-image-placeholder">
                      <i className="bi bi-image display-4 mb-2"></i>
                      <p className="mb-0 fw-semibold">No Image Available</p>
                    </div>
                  )}

                  {/* Modern Recipe Content */}
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold mb-3" style={{fontSize: '1.4rem', lineHeight: '1.3'}}>
                      {recipe.title}
                    </h5>
                    
                    {/* Enhanced Meta Info */}
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {recipe.cuisine && (
                          <span className="badge" style={{background: 'var(--primary-gradient)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)'}}>
                            <i className="bi bi-geo-alt me-1"></i>{recipe.cuisine}
                          </span>
                        )}
                        {recipe.category && (
                          <span className="badge" style={{background: 'var(--success-gradient)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)'}}>
                            <i className="bi bi-tag me-1"></i>{recipe.category}
                          </span>
                        )}
                        {recipe.difficulty && (
                          <span className="badge" style={{background: 'var(--warning-gradient)', color: 'var(--gray-800)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)'}}>
                            <i className="bi bi-speedometer me-1"></i>{recipe.difficulty}
                          </span>
                        )}
                      </div>
                      {recipe.prepTime && recipe.cookTime && (
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-clock me-2"></i>
                          <small className="fw-medium">
                            <span className="me-3">Prep: {recipe.prepTime}</span>
                            <span>Cook: {recipe.cookTime}</span>
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Recipe Preview */}
                    <div className="mb-4 flex-grow-1">
                      <div className="p-3 rounded" style={{background: 'var(--gray-50)', border: '1px solid var(--gray-200)'}}>
                        <h6 className="fw-bold text-muted mb-2">
                          <i className="bi bi-list-ul me-2"></i>Ingredients Preview
                        </h6>
                        <p className="text-muted mb-0 small">
                          {recipe.ingredients ? recipe.ingredients.substring(0, 120) : 'No ingredients listed'}
                          {recipe.ingredients && recipe.ingredients.length > 120 && '...'}
                        </p>
                      </div>
                    </div>

                    {/* Modern Action Buttons */}
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-primary flex-fill py-2"
                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Recipe
                      </button>
                      {recipe.userId && recipe.userId.toString() === localStorage.getItem('userId') && (
                        <button
                          className="btn btn-outline-primary px-3"
                          onClick={() => navigate(`/edit/${recipe._id}`)}
                          title="Edit Recipe"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
