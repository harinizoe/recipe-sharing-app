import React, { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext"; // Optional if using context
import "./AddRecipe.css"; 
import GoToRecipeListButton from './GoToRecipeListButton';

import axios from "axios";
const AddRecipe = () => {
  const { theme } = useContext(ThemeContext); // Remove if you're passing theme as a prop
 

  const [recipe, setRecipe] = useState({
    title: "",
    imageUrl: "",
    ingredients: "",
    steps: "",
    cuisine: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Easy",
    tags: "",
    category: "",
    videoUrl: "",
    notes: "",
    vegetarian: "Yes",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const validate = () => {
    const err = {};
    if (!recipe.title.trim()) err.title = "Title is required";
    if (!recipe.imageUrl.trim()) err.imageUrl = "Image URL is required";
    if (!recipe.ingredients.trim()) err.ingredients = "Ingredients required";
    if (!recipe.steps.trim()) err.steps = "Steps required";
    if (!recipe.cuisine.trim()) err.cuisine = "Cuisine is required";
    if (!recipe.prepTime.trim()) err.prepTime = "Preparation time is required";
    if (!recipe.cookTime.trim()) err.cookTime = "Cooking time is required";
    if (!recipe.servings.trim()) err.servings = "Servings are required";

    if (recipe.videoUrl && !/^https?:\/\/\S+$/.test(recipe.videoUrl)) {
      err.videoUrl = "Enter a valid video URL";
    }

    return err;
  };
 // Make sure this is at the top of your file

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User not logged in. Please log in first.");
        return;
      }

      const payload = {
        ...recipe,
        userId,
        ingredients: recipe.ingredients.trim(), // keep as string
  steps: recipe.steps.trim(),            // keep as string
  tags: recipe.tags.trim(),              // keep as string
  servings: Number(recipe.servings),
  vegetarian: recipe.vegetarian === "Yes",
};

      const response = await axios.post("http://localhost:5000/api/recipes", payload);

      alert("Recipe added successfully!");
      setRecipe({
        title: "",
        imageUrl: "",
        ingredients: "",
        steps: "",
        cuisine: "",
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "Easy",
        tags: "",
        category: "",
        videoUrl: "",
        notes: "",
        vegetarian: "Yes",
      });
      setImagePreview("");
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.error || "Failed to connect to the server.");
    }
  }
};

  return (
    <div className={`container-fluid py-4 ${theme === "dark" ? "text-light" : "text-dark"}`}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 fw-bold mb-2">
                <i className="bi bi-plus-circle me-3 text-success"></i>
                Add New Recipe
              </h1>
              <p className="text-muted">Share your delicious recipe with the community</p>
            </div>
            <GoToRecipeListButton />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-pencil me-2 text-primary"></i>
                        Recipe Title *
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        placeholder="Enter recipe title..."
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-image me-2 text-success"></i>
                        Image URL *
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.imageUrl ? "is-invalid" : ""}`}
                        name="imageUrl"
                        value={recipe.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.imageUrl && (
                        <div className="invalid-feedback">{errors.imageUrl}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-eye me-2 text-info"></i>
                      Image Preview
                    </label>
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Recipe Preview"
                        className="img-fluid rounded-3 shadow-lg"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-list-ul me-2 text-warning"></i>
                    Ingredients * (comma-separated)
                  </label>
                  <textarea
                    className={`form-control ${errors.ingredients ? "is-invalid" : ""}`}
                    name="ingredients"
                    rows="4"
                    value={recipe.ingredients}
                    onChange={handleChange}
                    placeholder="e.g., 2 cups flour, 1 cup sugar, 3 eggs..."
                  />
                  {errors.ingredients && (
                    <div className="invalid-feedback">{errors.ingredients}</div>
                  )}
                </div>

                {/* Steps */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-list-nested me-2 text-success"></i>
                    Instructions *
                  </label>
                  <textarea
                    className={`form-control ${errors.steps ? "is-invalid" : ""}`}
                    name="steps"
                    rows="6"
                    value={recipe.steps}
                    onChange={handleChange}
                    placeholder="Step-by-step cooking instructions..."
                  />
                  {errors.steps && (
                    <div className="invalid-feedback">{errors.steps}</div>
                  )}
                </div>

                {/* Recipe Details Row 1 */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-globe me-2 text-info"></i>
                        Cuisine *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.cuisine ? "is-invalid" : ""}`}
                        name="cuisine"
                        value={recipe.cuisine}
                        onChange={handleChange}
                        placeholder="e.g., Italian, Mexican..."
                      />
                      {errors.cuisine && (
                        <div className="invalid-feedback">{errors.cuisine}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-clock me-2 text-primary"></i>
                        Preparation Time *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.prepTime ? "is-invalid" : ""}`}
                        name="prepTime"
                        value={recipe.prepTime}
                        onChange={handleChange}
                        placeholder="e.g., 30 minutes"
                      />
                      {errors.prepTime && (
                        <div className="invalid-feedback">{errors.prepTime}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-fire me-2 text-danger"></i>
                        Cooking Time *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.cookTime ? "is-invalid" : ""}`}
                        name="cookTime"
                        value={recipe.cookTime}
                        onChange={handleChange}
                        placeholder="e.g., 45 minutes"
                      />
                      {errors.cookTime && (
                        <div className="invalid-feedback">{errors.cookTime}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recipe Details Row 2 */}
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-people me-2 text-success"></i>
                        Servings *
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.servings ? "is-invalid" : ""}`}
                        name="servings"
                        value={recipe.servings}
                        onChange={handleChange}
                        placeholder="4"
                        min="1"
                      />
                      {errors.servings && (
                        <div className="invalid-feedback">{errors.servings}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-bar-chart me-2 text-warning"></i>
                        Difficulty
                      </label>
                      <select
                        className="form-select"
                        name="difficulty"
                        value={recipe.difficulty}
                        onChange={handleChange}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-leaf me-2 text-success"></i>
                        Vegetarian
                      </label>
                      <select
                        className="form-select"
                        name="vegetarian"
                        value={recipe.vegetarian}
                        onChange={handleChange}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-tag me-2 text-secondary"></i>
                        Category
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={recipe.category}
                        onChange={handleChange}
                        placeholder="e.g., Main Course, Dessert..."
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-tags me-2 text-info"></i>
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="tags"
                        value={recipe.tags}
                        onChange={handleChange}
                        placeholder="e.g., quick, healthy, spicy..."
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-play-circle me-2 text-danger"></i>
                        Video URL
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.videoUrl ? "is-invalid" : ""}`}
                        name="videoUrl"
                        value={recipe.videoUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      {errors.videoUrl && (
                        <div className="invalid-feedback">{errors.videoUrl}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-journal-text me-2 text-secondary"></i>
                    Notes (optional)
                  </label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows="3"
                    value={recipe.notes}
                    onChange={handleChange}
                    placeholder="Additional tips, variations, or notes..."
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-check-circle me-2"></i>
                    Submit Recipe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-lightbulb me-2 text-warning"></i>
                Tips for Great Recipes
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Use clear, descriptive titles
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Include high-quality images
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  List ingredients in order of use
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Write step-by-step instructions
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Add helpful tags for discoverability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;

