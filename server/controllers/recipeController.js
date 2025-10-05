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

// Get all recipes with advanced search and filtering
exports.getAllRecipes = async (req, res) => {
  try {
    const { 
      search, 
      cuisine, 
      difficulty, 
      category, 
      vegetarian, 
      maxPrepTime, 
      maxCookTime,
      ingredients,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build search query
    let query = {};

    // Text search across multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
        { steps: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by cuisine
    if (cuisine && cuisine !== 'all') {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      query.difficulty = { $regex: difficulty, $options: 'i' };
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by vegetarian
    if (vegetarian && vegetarian !== 'all') {
      query.vegetarian = { $regex: vegetarian, $options: 'i' };
    }

    // Filter by ingredients (contains any of the specified ingredients)
    if (ingredients) {
      const ingredientList = ingredients.split(',').map(ing => ing.trim());
      query.ingredients = { 
        $regex: ingredientList.map(ing => `(?=.*${ing})`).join(''), 
        $options: 'i' 
      };
    }

    // Time-based filters (convert time strings to minutes for comparison)
    if (maxPrepTime) {
      // This is a simplified approach - in production, you'd want to standardize time formats
      query.prepTime = { $regex: `^([1-9]|[1-${maxPrepTime}][0-9]?)\\s*(min|minute)`, $options: 'i' };
    }

    if (maxCookTime) {
      query.cookTime = { $regex: `^([1-9]|[1-${maxCookTime}][0-9]?)\\s*(min|minute)`, $options: 'i' };
    }

    // Sorting
    // Primary sort is based on client-provided sortBy/sortOrder.
    // To ensure that when multiple recipes represent the same dish the best-rated appears first,
    // we add stable secondary sort keys by rating and recency.
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    // Secondary: higher averageRating first
    if (sortBy !== 'averageRating') {
      sortOptions['averageRating'] = -1;
    }
    // Tertiary: break ties by totalRatings (more reviews first)
    sortOptions['totalRatings'] = -1;
    // Final tiebreaker: newest first
    if (sortBy !== 'createdAt') {
      sortOptions['createdAt'] = -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const recipes = await Recipe.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name');

    // Get total count for pagination
    const totalRecipes = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(totalRecipes / parseInt(limit));

    res.status(200).json({
      recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecipes,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        search: search || '',
        cuisine: cuisine || 'all',
        difficulty: difficulty || 'all',
        category: category || 'all',
        vegetarian: vegetarian || 'all',
        maxPrepTime: maxPrepTime || '',
        maxCookTime: maxCookTime || '',
        ingredients: ingredients || ''
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get one recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('userId', 'name');
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

// Get search suggestions and autocomplete
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    // Get unique values for autocomplete
    const [cuisines, categories, ingredients] = await Promise.all([
      Recipe.distinct('cuisine', { cuisine: { $regex: query, $options: 'i' } }),
      Recipe.distinct('category', { category: { $regex: query, $options: 'i' } }),
      Recipe.find({ 
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { ingredients: { $regex: query, $options: 'i' } }
        ]
      }).select('title ingredients').limit(5)
    ]);

    const suggestions = [
      ...cuisines.slice(0, 3).map(c => ({ type: 'cuisine', value: c })),
      ...categories.slice(0, 3).map(c => ({ type: 'category', value: c })),
      ...ingredients.map(r => ({ type: 'recipe', value: r.title, id: r._id }))
    ];

    res.status(200).json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rate a recipe
exports.rateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(r => r.userId.toString() === userId);

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex].rating = rating;
      recipe.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      // Add new rating
      recipe.ratings.push({ userId, rating });
    }

    // Recalculate average rating
    const totalRatings = recipe.ratings.length;
    const sumRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = totalRatings > 0 ? (sumRatings / totalRatings) : 0;
    recipe.totalRatings = totalRatings;

    await recipe.save();

    res.status(200).json({
      message: 'Rating submitted successfully',
      averageRating: recipe.averageRating,
      totalRatings: recipe.totalRatings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's rating for a recipe
exports.getUserRating = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const userRating = recipe.ratings.find(r => r.userId.toString() === userId);
    
    if (userRating) {
      res.status(200).json({ rating: userRating.rating });
    } else {
      res.status(200).json({ rating: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
