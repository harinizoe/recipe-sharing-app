const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getSearchSuggestions,
  rateRecipe,
  getUserRating
} = require('../controllers/recipeController');

router.post('/', createRecipe);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/', getAllRecipes);
router.post('/:id/rate', rateRecipe);
router.get('/:id/rating/:userId', getUserRating);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;
