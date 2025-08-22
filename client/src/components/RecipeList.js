import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeList = ({ theme }) => {
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
    <div className={`container ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Recipes</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate('/add-recipe')}
        >
          Add New Recipe
        </button>
      </div>

      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div className="col-md-4 mb-4" key={recipe._id}>
              <div className={`card h-100 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="card-img-top"
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p><strong>Instructions:</strong> {recipe.instructions}</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                  >
                    Show More Details
                  </button>
                 {recipe.userId && recipe.userId.toString() === localStorage.getItem('userId') && (
  <button
    className="btn btn-warning  mt-2"
    onClick={() => navigate(`/edit/${recipe._id}`)}
  >
    Edit
  </button>
)}

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
