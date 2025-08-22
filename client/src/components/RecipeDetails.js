import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GoToRecipeListButton from "./GoToRecipeListButton";
const RecipeDetails = ({ theme }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to fetch recipe details.");
      }
    };

    fetchRecipe();
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
    <div
      className={`container py-4 ${
        theme === "dark" ? "text-light bg-dark" : "text-dark bg-light"
      }`}
    >
       <div className="d-flex justify-content-end mb-3">
      <GoToRecipeListButton />
    </div>
      <h2 className="mb-4">Recipe Details</h2>

      {displayField("Title", recipe.title)}

      {recipe.imageUrl && (
        <div className="text-center mb-4">
          <img
            src={recipe.imageUrl}
            alt="Recipe"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "300px" }}
          />
        </div>
      )}

      {displayField("Ingredients", recipe.ingredients)}
      {displayField("Steps", recipe.steps)}
      {displayField("Cuisine", recipe.cuisine)}
      {displayField("Preparation Time", recipe.prepTime)}
      {displayField("Cooking Time", recipe.cookTime)}
      {displayField("Servings", recipe.servings)}
      {displayField("Difficulty", recipe.difficulty)}
      {displayField("Vegetarian", recipe.vegetarian ? "Yes" : "No")}
      {displayField("Category", recipe.category)}
      {displayField("Tags", recipe.tags)}
      {displayField("Video URL", recipe.videoUrl)}
      {displayField("Notes", recipe.notes)}
    </div>
  );
};

export default RecipeDetails;
