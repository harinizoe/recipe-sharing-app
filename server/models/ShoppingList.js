const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'My Shopping List'
  },
  items: [{
    ingredient: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      default: '1'
    },
    unit: {
      type: String,
      default: 'item'
    },
    category: {
      type: String,
      enum: ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'bakery', 'other'],
      default: 'other'
    },
    checked: {
      type: Boolean,
      default: false
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    recipeName: String
  }],
  dateRange: {
    startDate: Date,
    endDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
