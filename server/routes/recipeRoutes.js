const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
  updateRecipe
} = require('../controllers/recipeController');



// POST /api/recipes
router.post('/', createRecipe);

// GET /api/recipes
router.get('/', getAllRecipes);



// GET /api/recipes/:id
router.get('/:id', getRecipeById);

// DELETE /api/recipes/:id
router.delete('/:id', deleteRecipe);
router.put('/:id', updateRecipe);
module.exports = router;
