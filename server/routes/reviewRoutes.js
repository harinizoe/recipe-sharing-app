const express = require('express');
const {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

// Routes
router.post('/:recipeId', addReview);     // Add review
router.get('/:recipeId', getReviews);     // Get reviews for recipe
router.put('/:id', updateReview);         // Update review
router.delete('/:id', deleteReview);      // Delete review

module.exports = router;
