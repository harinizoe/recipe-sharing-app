const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: {
    breakfast: {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      customMeal: String,
      servings: {
        type: Number,
        default: 1
      }
    },
    lunch: {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      customMeal: String,
      servings: {
        type: Number,
        default: 1
      }
    },
    dinner: {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      customMeal: String,
      servings: {
        type: Number,
        default: 1
      }
    },
    snack: {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      },
      customMeal: String,
      servings: {
        type: Number,
        default: 1
      }
    }
  },
  notes: String
}, { timestamps: true });

// Compound index for efficient queries
mealPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
