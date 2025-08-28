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
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h1 className="display-5 fw-bold mb-2">All Recipes</h1>
              <p className="text-muted">Discover and share amazing recipes from our community</p>
            </div>
            <button
              className="btn btn-success btn-lg"
              onClick={() => navigate('/add-recipe')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="loading-spinner mb-3"></div>
          <p className="text-muted">Loading delicious recipes...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-egg-fried display-1 text-muted"></i>
          </div>
          <h3 className="mb-3">No recipes found</h3>
          <p className="text-muted mb-4">Be the first to share a delicious recipe!</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/add-recipe')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Your First Recipe
          </button>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe, index) => (
            <div 
              key={recipe._id} 
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
                             <div className="card recipe-card h-100 bg-white shadow-sm">
                                 {/* Recipe Image */}
                 {recipe.imageUrl ? (
                   <div className="position-relative overflow-hidden">
                     <img
                       src={recipe.imageUrl}
                       alt={recipe.title}
                       className="card-img-top"
                       style={{ height: '250px', objectFit: 'cover' }}
                     />
                     <div className="position-absolute top-0 end-0 m-2">
                       <span className="badge bg-primary">
                         <i className="bi bi-star-fill me-1"></i>
                         Recipe
                       </span>
                     </div>
                   </div>
                 ) : (
                   <div className="recipe-image-placeholder">
                     <i className="bi bi-image me-2"></i>
                     No Image
                   </div>
                 )}

                {/* Recipe Content */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{recipe.title}</h5>
                  
                  {/* Recipe Meta Info */}
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {recipe.cuisine && (
                        <span className="badge bg-primary">{recipe.cuisine}</span>
                      )}
                      {recipe.category && (
                        <span className="badge bg-secondary">{recipe.category}</span>
                      )}
                      {recipe.difficulty && (
                        <span className="badge bg-info">{recipe.difficulty}</span>
                      )}
                    </div>
                    {recipe.prepTime && recipe.cookTime && (
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
                      </small>
                    )}
                  </div>

                                     {/* Recipe Preview */}
                   <div className="mb-3 flex-grow-1">
                     <p className="text-muted small">
                       <strong>Ingredients:</strong> {recipe.ingredients ? recipe.ingredients.substring(0, 100) : 'No ingredients listed'}
                       {recipe.ingredients && recipe.ingredients.length > 100 && '...'}
                     </p>
                   </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => navigate(`/recipes/${recipe._id}`)}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </button>
                    {recipe.userId && recipe.userId.toString() === localStorage.getItem('userId') && (
                      <button
                        className="btn btn-warning"
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
  );
};

export default RecipeList;
