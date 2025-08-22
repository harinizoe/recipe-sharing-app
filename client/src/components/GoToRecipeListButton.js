import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoToRecipeListButton = () => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-outline-primary" onClick={() => navigate('/recipes')}>
      Go to Recipes
    </button>
  );
};

export default GoToRecipeListButton;
