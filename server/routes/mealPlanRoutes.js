const express = require('express');
const router = express.Router();
const {
  getMealPlans,
  createOrUpdateMealPlan,
  deleteMealPlan,
  getMealSuggestions
} = require('../controllers/mealPlanController');

router.get('/', getMealPlans);
router.post('/', createOrUpdateMealPlan);
router.delete('/:id', deleteMealPlan);
router.get('/suggestions', getMealSuggestions);

module.exports = router;
