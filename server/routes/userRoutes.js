const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  updateUser, 
  deleteUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:userId/favorites/:recipeId', addToFavorites);
router.delete('/:userId/favorites/:recipeId', removeFromFavorites);
router.get('/:userId/favorites', getFavorites);

module.exports = router;
