import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoToRecipeListButton from './GoToRecipeListButton';
const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError("Failed to load recipe"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}`, recipe);
      alert("Recipe updated successfully!");
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update recipe");
    }
  };

  if (!recipe) return <p className="text-danger">{error || "Loading..."}</p>;

  return (
    <div className="container py-4 text-dark bg-light">
      <div className="d-flex justify-content-end mb-3">
      <GoToRecipeListButton />
    </div>
      <h2>Edit Recipe</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Required fields */}
        <div className="mb-3">
          <label>Title *</label>
          <input type="text" name="title" className="form-control" value={recipe.title || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Image URL *</label>
          <input type="text" name="imageUrl" className="form-control" value={recipe.imageUrl || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Ingredients *</label>
          <textarea name="ingredients" className="form-control" value={recipe.ingredients || ''} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Steps *</label>
          <textarea name="steps" className="form-control" value={recipe.steps || ''} onChange={handleChange} required />
        </div>

        {/* Optional fields */}
        <div className="mb-3">
          <label>Cuisine</label>
          <input type="text" name="cuisine" className="form-control" value={recipe.cuisine || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Preparation Time</label>
          <input type="text" name="prepTime" className="form-control" value={recipe.prepTime || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Cooking Time</label>
          <input type="text" name="cookTime" className="form-control" value={recipe.cookTime || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Servings</label>
          <input type="number" name="servings" className="form-control" value={recipe.servings || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Difficulty</label>
          <input type="text" name="difficulty" className="form-control" value={recipe.difficulty || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Vegetarian</label>
          <select name="vegetarian" className="form-control" value={recipe.vegetarian || 'false'} onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input type="text" name="category" className="form-control" value={recipe.category || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Tags</label>
          <input type="text" name="tags" className="form-control" value={recipe.tags || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Video URL</label>
          <input type="text" name="videoUrl" className="form-control" value={recipe.videoUrl || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Notes</label>
          <textarea name="notes" className="form-control" value={recipe.notes || ''} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipe;
