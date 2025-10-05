const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ingredients: { type: String, required: true },
  steps: { type: String, required: true },
  cuisine: { type: String, required: true },
  prepTime: { type: String, required: true },
  cookTime: { type: String, required: true },
  servings: { type: Number, required: true },
  difficulty: { type: String, default: "Easy" },
  tags: { type: String },
  category: { type: String },
  videoUrl: { type: String },
  notes: { type: String },
  vegetarian: { type: String, default: "Yes" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
