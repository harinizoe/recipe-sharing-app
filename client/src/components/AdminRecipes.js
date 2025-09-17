import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    ingredients: '', 
    instructions: '', 
    cookingTime: '',
    servings: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      alert('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        alert('Recipe deleted successfully');
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert('Error deleting recipe');
      }
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe._id);
    setEditForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : recipe.ingredients,
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions,
      cookingTime: recipe.cookingTime || '',
      servings: recipe.servings || ''
    });
  };

  const handleUpdate = async (recipeId) => {
    try {
      const updateData = {
        ...editForm,
        ingredients: editForm.ingredients.split('\n').filter(item => item.trim()),
        instructions: editForm.instructions.split('\n').filter(item => item.trim())
      };
      
      const res = await axios.put(`http://localhost:5000/api/recipes/${recipeId}`, updateData);
      setRecipes(recipes.map(recipe => recipe._id === recipeId ? res.data : recipe));
      setEditingRecipe(null);
      alert('Recipe updated successfully');
    } catch (err) {
      console.error('Error updating recipe:', err);
      alert('Error updating recipe');
    }
  };

  const handleCancel = () => {
    setEditingRecipe(null);
    setEditForm({ 
      title: '', 
      description: '', 
      ingredients: '', 
      instructions: '', 
      cookingTime: '',
      servings: ''
    });
  };

  if (loading) {
    return (
      <div className="glass-card p-5 text-center">
        <div className="loading-spinner mb-3"></div>
        <h4 className="fw-bold mb-2">Loading Recipes</h4>
        <p className="text-muted mb-0">Fetching recipe data...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold gradient-text mb-2">Recipe Management</h2>
          <p className="text-muted">Manage all recipes in the system</p>
        </div>
        <div className="badge bg-primary px-3 py-2">
          <i className="bi bi-collection me-2"></i>
          {recipes.length} Recipes
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-collection display-4 text-muted mb-3"></i>
          <h4 className="text-muted">No recipes found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="col-lg-6 col-xl-4 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card recipe-card h-100">
                {editingRecipe === recipe._id ? (
                  // Edit Mode
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold">Cooking Time</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.cookingTime}
                          onChange={(e) => setEditForm({ ...editForm, cookingTime: e.target.value })}
                          placeholder="e.g. 30 mins"
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold">Servings</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editForm.servings}
                          onChange={(e) => setEditForm({ ...editForm, servings: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Ingredients (one per line)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={editForm.ingredients}
                        onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Instructions (one per line)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={editForm.instructions}
                        onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => handleUpdate(recipe._id)}
                      >
                        <i className="bi bi-check-lg me-2"></i>Save Changes
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    {recipe.imageUrl && (
                      <div className="position-relative overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="recipe-overlay">
                          <span className="badge bg-primary">
                            <i className="bi bi-clock me-1"></i>
                            {recipe.cookingTime || 'N/A'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3">
                        <h5 className="card-title fw-bold mb-2">{recipe.title}</h5>
                        <p className="card-text text-muted small mb-2">{recipe.description}</p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            By: {recipe.author?.name || 'Unknown'}
                          </small>
                          <small className="text-muted">
                            <i className="bi bi-people me-1"></i>
                            Serves: {recipe.servings || 'N/A'}
                          </small>
                        </div>

                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          Created: {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : 'N/A'}
                        </small>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() => handleEdit(recipe)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() => handleDelete(recipe._id)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;
