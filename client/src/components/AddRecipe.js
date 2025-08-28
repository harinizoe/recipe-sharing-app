import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import "./AddRecipe.css";
import GoToRecipeListButton from "./GoToRecipeListButton";

const AddRecipe = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

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

  const [errors, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setError(validationErrors); // Set field-specific errors
    setError("Please fix the validation errors."); // General error message
    return;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) {
      setError("User not logged in. Please log in first.");
      return;
    }

    const payload = {
      ...recipe,
      userId,
      ingredients: recipe.ingredients.split(",").map(i => i.trim()).filter(Boolean),
      tags: recipe.tags ? recipe.tags.split(",").map(t => t.trim()) : [],
      steps: recipe.steps.split("\n").map(s => s.trim()).filter(Boolean),
      servings: Number(recipe.servings),
      vegetarian: recipe.vegetarian === "Yes",
    };

    await axios.post("http://localhost:5000/api/recipes", payload);
    alert("Recipe added successfully!");
    setError({}); // Clear field errors
    setError("");  // Clear general error
    navigate("/recipes");
  } catch (err) {
    setError(err.response?.data?.error || "Failed to add recipe");
  }
};


  return (
    <div
      className={`recipe-form-container ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="d-flex justify-content-end mb-3">
        <GoToRecipeListButton />
      </div>
      <h2 className="mb-4">Add New Recipe</h2>
      <form
        onSubmit={handleSubmit}
        className="row g-3 shadow p-4 rounded bg-light"
      >
        {/* Title */}
        <div className="col-md-6">
          <label>Title*</label>
          <input
            type="text"
            className={`form-control ${errors.title && "is-invalid"}`}
            name="title"
            value={recipe.title}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.title}</div>
        </div>

        {/* Image URL */}
        <div className="col-md-6">
          <label>Image URL*</label>
          <input
            type="text"
            className={`form-control ${errors.imageUrl && "is-invalid"}`}
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.imageUrl}</div>
        </div>

        {imagePreview && (
          <div className="col-12 text-center">
            <img
              src={imagePreview}
              alt="Recipe Preview"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}

        {/* Ingredients */}
        <div className="col-12">
          <label>Ingredients* (comma-separated)</label>
          <textarea
            className={`form-control ${errors.ingredients && "is-invalid"}`}
            name="ingredients"
            rows="3"
            value={recipe.ingredients}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.ingredients}</div>
        </div>

        {/* Steps */}
        <div className="col-12">
          <label>Steps* (newline separated)</label>
          <textarea
            className={`form-control ${errors.steps && "is-invalid"}`}
            name="steps"
            rows="4"
            value={recipe.steps}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.steps}</div>
        </div>

        {/* Cuisine */}
        <div className="col-md-4">
          <label>Cuisine*</label>
          <input
            type="text"
            className={`form-control ${errors.cuisine && "is-invalid"}`}
            name="cuisine"
            value={recipe.cuisine}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.cuisine}</div>
        </div>

        {/* Times */}
        <div className="col-md-4">
          <label>Preparation Time*</label>
          <input
            type="text"
            className={`form-control ${errors.prepTime && "is-invalid"}`}
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.prepTime}</div>
        </div>

        <div className="col-md-4">
          <label>Cooking Time*</label>
          <input
            type="text"
            className={`form-control ${errors.cookTime && "is-invalid"}`}
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.cookTime}</div>
        </div>

        {/* Servings */}
        <div className="col-md-3">
          <label>Servings*</label>
          <input
            type="number"
            className={`form-control ${errors.servings && "is-invalid"}`}
            name="servings"
            value={recipe.servings}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.servings}</div>
        </div>

        {/* Difficulty */}
        <div className="col-md-3">
          <label>Difficulty</label>
          <select
            className="form-control"
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Vegetarian */}
        <div className="col-md-3">
          <label>Vegetarian</label>
          <select
            className="form-control"
            name="vegetarian"
            value={recipe.vegetarian}
            onChange={handleChange}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Category */}
        <div className="col-md-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={recipe.category}
            onChange={handleChange}
          />
        </div>

        {/* Tags */}
        <div className="col-12">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            name="tags"
            value={recipe.tags}
            onChange={handleChange}
          />
        </div>

        {/* Video URL */}
        <div className="col-12">
          <label>Video URL</label>
          <input
            type="text"
            className={`form-control ${errors.videoUrl && "is-invalid"}`}
            name="videoUrl"
            value={recipe.videoUrl}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.videoUrl}</div>
        </div>

        {/* Notes */}
        <div className="col-12">
          <label>Notes (optional)</label>
          <textarea
            className="form-control"
            name="notes"
            rows="3"
            value={recipe.notes}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
