const Recipe = require('../models/Recipe');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get one recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    // Compare owner (assume req.body.userId is sent from frontend)
    if (recipe.userId.toString() !== req.body.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this recipe' });
    }

    // Update and save
    Object.assign(recipe, req.body);
    await recipe.save();
    res.status(200).json({ message: 'Recipe updated successfully', recipe });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
