const ShoppingList = require('../models/ShoppingList');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');

// Get user's shopping lists
exports.getShoppingLists = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const shoppingLists = await ShoppingList.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(shoppingLists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new shopping list
exports.createShoppingList = async (req, res) => {
  try {
    const { userId, name, items } = req.body;

    const shoppingList = new ShoppingList({
      userId,
      name: name || 'My Shopping List',
      items: items || []
    });

    await shoppingList.save();
    res.status(201).json(shoppingList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate shopping list from meal plans
exports.generateFromMealPlans = async (req, res) => {
  try {
    const { userId, startDate, endDate, name } = req.body;

    // Get meal plans for the date range
    const mealPlans = await MealPlan.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('meals.breakfast.recipeId meals.lunch.recipeId meals.dinner.recipeId meals.snack.recipeId');

    const ingredientMap = new Map();

    // Process each meal plan
    for (const mealPlan of mealPlans) {
      for (const [mealType, meal] of Object.entries(mealPlan.meals)) {
        if (meal.recipeId && meal.recipeId.ingredients) {
          const servings = meal.servings || 1;
          const ingredients = parseIngredients(meal.recipeId.ingredients, servings);
          
          ingredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key);
              existing.quantity = combineQuantities(existing.quantity, ingredient.quantity);
              existing.recipes.add(meal.recipeId.title);
            } else {
              ingredientMap.set(key, {
                ingredient: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                category: categorizeIngredient(ingredient.name),
                checked: false,
                recipes: new Set([meal.recipeId.title])
              });
            }
          });
        }
      }
    }

    // Convert map to array and format
    const items = Array.from(ingredientMap.values()).map(item => ({
      ...item,
      recipeName: Array.from(item.recipes).join(', '),
      recipes: undefined
    }));

    const shoppingList = new ShoppingList({
      userId,
      name: name || `Shopping List ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      items,
      dateRange: { startDate, endDate }
    });

    await shoppingList.save();
    res.status(201).json(shoppingList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update shopping list
exports.updateShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const shoppingList = await ShoppingList.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.status(200).json(shoppingList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete shopping list
exports.deleteShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    
    const shoppingList = await ShoppingList.findByIdAndDelete(id);
    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }

    res.status(200).json({ message: 'Shopping list deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to parse ingredients
function parseIngredients(ingredientsText, servings = 1) {
  const ingredients = [];
  const lines = ingredientsText.split(/\n|,/).map(line => line.trim()).filter(line => line);

  lines.forEach(line => {
    // Simple parsing - extract quantity, unit, and ingredient name
    const match = line.match(/^(\d+(?:\.\d+)?)\s*(\w+)?\s+(.+)$/);
    if (match) {
      const [, quantity, unit, name] = match;
      ingredients.push({
        name: name.trim(),
        quantity: (parseFloat(quantity) * servings).toString(),
        unit: unit || 'item'
      });
    } else {
      // If no quantity found, treat as single item
      ingredients.push({
        name: line,
        quantity: servings.toString(),
        unit: 'item'
      });
    }
  });

  return ingredients;
}

// Helper function to categorize ingredients
function categorizeIngredient(ingredient) {
  const name = ingredient.toLowerCase();
  
  if (/tomato|onion|garlic|carrot|potato|spinach|lettuce|cucumber|pepper|mushroom|broccoli|cauliflower/.test(name)) {
    return 'produce';
  }
  if (/milk|cheese|butter|yogurt|cream|egg/.test(name)) {
    return 'dairy';
  }
  if (/chicken|beef|pork|fish|turkey|lamb|bacon|sausage/.test(name)) {
    return 'meat';
  }
  if (/bread|bagel|muffin|cake|cookie/.test(name)) {
    return 'bakery';
  }
  if (/frozen|ice/.test(name)) {
    return 'frozen';
  }
  if (/flour|sugar|salt|pepper|oil|vinegar|sauce|spice|herb/.test(name)) {
    return 'pantry';
  }
  
  return 'other';
}

// Helper function to combine quantities (simplified)
function combineQuantities(qty1, qty2) {
  const num1 = parseFloat(qty1) || 0;
  const num2 = parseFloat(qty2) || 0;
  return (num1 + num2).toString();
}
