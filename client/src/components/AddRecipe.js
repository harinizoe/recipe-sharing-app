import React, { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext"; // Optional if using context
import "./AddRecipe.css"; 
import GoToRecipeListButton from './GoToRecipeListButton';

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

 const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        alert("Error: " + data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to connect to the server.");
    }
  }
};


  return (
    <div className={`recipe-form-container ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
       <div className="d-flex justify-content-end mb-3">
      <GoToRecipeListButton />
    </div>
      <h2 className="mb-4">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="row g-3 shadow p-4 rounded bg-light">
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

        <div className="col-12">
          <label>Steps*</label>
          <textarea
            className={`form-control ${errors.steps && "is-invalid"}`}
            name="steps"
            rows="4"
            value={recipe.steps}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.steps}</div>
        </div>

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

        <div className="col-md-4">
          <label>Preparation Time* (e.g., 30 mins)</label>
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

