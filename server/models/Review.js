const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);