const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

// Get meal plans for a date range
exports.getMealPlans = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const mealPlans = await MealPlan.find(query)
      .populate('meals.breakfast.recipeId', 'title imageUrl prepTime cookTime')
      .populate('meals.lunch.recipeId', 'title imageUrl prepTime cookTime')
      .populate('meals.dinner.recipeId', 'title imageUrl prepTime cookTime')
      .populate('meals.snack.recipeId', 'title imageUrl prepTime cookTime')
      .sort({ date: 1 });

    res.status(200).json(mealPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update meal plan for a specific date
exports.createOrUpdateMealPlan = async (req, res) => {
  try {
    const { userId, date, meals, notes } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: 'User ID and date are required' });
    }

    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId, date: new Date(date) },
      { meals, notes },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    ).populate('meals.breakfast.recipeId meals.lunch.recipeId meals.dinner.recipeId meals.snack.recipeId');

    res.status(200).json(mealPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mealPlan = await MealPlan.findByIdAndDelete(id);
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.status(200).json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get meal plan suggestions based on user preferences
exports.getMealSuggestions = async (req, res) => {
  try {
    const { userId, mealType, date } = req.query;

    // Get user's recent meal plans to avoid repetition
    const recentMealPlans = await MealPlan.find({
      userId,
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    });

    const recentRecipeIds = [];
    recentMealPlans.forEach(plan => {
      Object.values(plan.meals).forEach(meal => {
        if (meal.recipeId) recentRecipeIds.push(meal.recipeId.toString());
      });
    });

    // Get recipe suggestions based on meal type and exclude recent ones
    let categoryFilter = {};
    if (mealType === 'breakfast') {
      categoryFilter = { category: { $regex: 'breakfast', $options: 'i' } };
    } else if (mealType === 'lunch') {
      categoryFilter = { category: { $regex: 'lunch|main', $options: 'i' } };
    } else if (mealType === 'dinner') {
      categoryFilter = { category: { $regex: 'dinner|main', $options: 'i' } };
    } else if (mealType === 'snack') {
      categoryFilter = { category: { $regex: 'snack|appetizer', $options: 'i' } };
    }

    const suggestions = await Recipe.find({
      ...categoryFilter,
      _id: { $nin: recentRecipeIds }
    })
    .select('title imageUrl cuisine difficulty prepTime cookTime averageRating')
    .limit(6)
    .sort({ averageRating: -1, createdAt: -1 });

    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
