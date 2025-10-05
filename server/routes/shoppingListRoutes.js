const express = require('express');
const router = express.Router();
const {
  getShoppingLists,
  createShoppingList,
  generateFromMealPlans,
  updateShoppingList,
  deleteShoppingList
} = require('../controllers/shoppingListController');

router.get('/:userId', getShoppingLists);
router.post('/', createShoppingList);
router.post('/generate', generateFromMealPlans);
router.put('/:id', updateShoppingList);
router.delete('/:id', deleteShoppingList);

module.exports = router;
