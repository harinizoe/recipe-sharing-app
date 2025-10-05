import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewSection from './ReviewSection';
import RecipeRating from './RecipeRating';
import FavoriteButton from './FavoriteButton';
import NutritionTracker from './NutritionTracker';
import RecipeRecommendations from './RecipeRecommendations';
import GoToRecipeListButton from "./GoToRecipeListButton";
const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  const fetchRecipeDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) {
      setError("Failed to fetch recipe details.");
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const displayField = (label, value) =>
    value && (
      <div className="mb-3">
        <strong>{label}:</strong>{" "}
        {Array.isArray(value) ? value.join(", ") : value.toString()}
      </div>
    );

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div className="container-fluid py-4 text-dark">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 fw-bold mb-2">{recipe.title}</h1>
              <div className="d-flex flex-wrap gap-2">
                {recipe.cuisine && <span className="badge bg-primary">{recipe.cuisine}</span>}
                {recipe.category && <span className="badge bg-secondary">{recipe.category}</span>}
                {recipe.difficulty && <span className="badge bg-info">{recipe.difficulty}</span>}
                {recipe.vegetarian && <span className="badge bg-success">Vegetarian</span>}
              </div>
              {/* Rating Summary */}
              <div className="mt-3">
                <RecipeRating
                  recipeId={id}
                  currentRating={recipe.averageRating || 0}
                  totalRatings={recipe.totalRatings || 0}
                  onRatingUpdate={(avg, count) => setRecipe({ ...recipe, averageRating: avg, totalRatings: count })}
                />
              </div>
            </div>
            <GoToRecipeListButton />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recipe Image */}
        <div className="col-lg-6 mb-4">
          {recipe.imageUrl ? (
            <div className="position-relative">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="img-fluid rounded-3 shadow-lg"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 m-3">
                <span className="badge bg-dark bg-opacity-75">
                  <i className="bi bi-camera me-1"></i>
                  Recipe Photo
                </span>
              </div>
            </div>
          ) : (
            <div className="recipe-image-placeholder rounded-3">
              <i className="bi bi-image display-1"></i>
              <p className="mt-2">No image available</p>
            </div>
          )}
        </div>

        {/* Recipe Info */}
        <div className="col-lg-6 mb-4">
          <div className="recipe-details h-100">
            {/* Time and Servings */}
            <div className="row mb-4">
              <div className="col-6">
                <div className="text-center p-3 bg-light rounded-3">
                  <i className="bi bi-clock display-6 text-primary"></i>
                  <h6 className="mt-2 mb-1">Prep Time</h6>
                  <p className="mb-0 fw-bold">{recipe.prepTime || 'N/A'}</p>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-3 bg-light rounded-3">
                  <i className="bi bi-fire display-6 text-danger"></i>
                  <h6 className="mt-2 mb-1">Cook Time</h6>
                  <p className="mb-0 fw-bold">{recipe.cookTime || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="p-3 bg-light rounded-3">
                <i className="bi bi-people display-6 text-success"></i>
                <h6 className="mt-2 mb-1">Servings</h6>
                <p className="mb-0 fw-bold">{recipe.servings || 'N/A'}</p>
              </div>
            </div>

            {/* Additional Info */}
            {recipe.tags && (
              <div className="mb-4">
                <h5><i className="bi bi-tags me-2"></i>Tags</h5>
                <div className="d-flex flex-wrap gap-2">
                  {recipe.tags.split(',').map((tag, index) => (
                    <span key={index} className="badge bg-outline-secondary">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {recipe.notes && (
              <div className="mb-4">
                <h5><i className="bi bi-journal-text me-2"></i>Notes</h5>
                <p className="text-muted">{recipe.notes}</p>
              </div>
            )}

            {recipe.videoUrl && (
              <div className="mb-4">
                <h5><i className="bi bi-play-circle me-2"></i>Video Tutorial</h5>
                <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                  <i className="bi bi-play me-2"></i>Watch Video
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="recipe-details">
            <h3 className="mb-3">
              <i className="bi bi-list-ul me-2 text-primary"></i>
              Ingredients
            </h3>
            <div className="bg-light p-3 rounded-3">
              <p className="mb-0">{recipe.ingredients}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="recipe-details">
            <h3 className="mb-3">
              <i className="bi bi-list-nested me-2 text-success"></i>
              Instructions
            </h3>
            <div className="bg-light p-3 rounded-3">
              <p className="mb-0">{recipe.steps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Tracker */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="recipe-details">
            <h3 className="mb-3">
              <i className="bi bi-clipboard-data me-2 text-warning"></i>
              Nutrition
            </h3>
            <div className="bg-light p-3 rounded-3">
              <NutritionTracker recipeId={id} servings={recipe.servings || 1} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row">
        <div className="col-12">
          <ReviewSection recipeId={id} onChange={fetchRecipeDetails} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
