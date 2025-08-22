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
}

}, { timestamps: true },
);

module.exports = mongoose.model('Recipe', recipeSchema);
