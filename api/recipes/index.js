const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require('../../shared/models/Recipe');

// Get all recipes with filters
router.get('/', async (req, res) => {
  try {
    const { cuisine, difficulty, dietary, time, page = 1, limit = 12 } = req.query;
    
    let filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (time) filter.cookingTime = { $lte: parseInt(time) };
    if (dietary) filter.dietaryTags = { $in: [dietary] };

    const recipes = await Recipe.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ title: 1 });

    const total = await Recipe.countDocuments(filter);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search recipes by ingredients
// Search recipes by ingredients
router.post('/search', async (req, res) => {
  try {
    const { ingredients, filters = {} } = req.body;
    
    console.log('🔍 Search request received:');
    console.log('   Ingredients:', ingredients);
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients array is required' });
    }

    let query = {};

    // Apply filters
    if (filters.cuisine) query.cuisine = filters.cuisine;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.dietary) query.dietaryTags = { $in: [filters.dietary] };
    if (filters.time) query.cookingTime = { $lte: parseInt(filters.time) };

    console.log('   MongoDB Query:', query);

    const allRecipes = await Recipe.find(query);
    console.log(`   Found ${allRecipes.length} recipes in database`);

    // AND matching: Find recipes that contain ALL search ingredients
    const matchingRecipes = allRecipes.filter(recipe => {
      const recipeIngredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const userIngredientNames = ingredients.map(ing => ing.toLowerCase().trim());
      
      // Check if recipe contains ALL user ingredients
      const containsAllIngredients = userIngredientNames.every(userIngredient =>
        recipeIngredientNames.some(recipeIngredient =>
          recipeIngredient.includes(userIngredient) || 
          userIngredient.includes(recipeIngredient)
        )
      );
      
      return containsAllIngredients;
    });

    console.log(`   Found ${matchingRecipes.length} recipes containing ALL ingredients`);

    // Calculate match scores for display
    const recipesWithScores = matchingRecipes.map(recipe => {
      const recipeIngredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const userIngredientNames = ingredients.map(ing => ing.toLowerCase().trim());
      
      // Find which ingredients matched
      const matchingIngredients = recipeIngredientNames.filter(recipeIngredient =>
        userIngredientNames.some(userIngredient =>
          recipeIngredient.includes(userIngredient) || 
          userIngredient.includes(recipeIngredient)
        )
      );
      
      // Calculate percentage of recipe ingredients that matched user ingredients
      const matchScore = Math.round(
        (matchingIngredients.length / recipeIngredientNames.length) * 100
      );

      return {
        ...recipe.toObject(),
        matchScore,
        matchingIngredients: matchingIngredients,
        userIngredientsMatched: matchingIngredients.length
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    console.log(`🎯 Final results: ${recipesWithScores.length} recipes with ALL ingredients`);
    
    res.json(recipesWithScores);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get specific recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get filter options
router.get('/meta/filters', async (req, res) => {
  try {
    const cuisines = await Recipe.distinct('cuisine');
    const difficulties = await Recipe.distinct('difficulty');
    const dietaryTags = await Recipe.distinct('dietaryTags');
    
    res.json({
      cuisines: cuisines.filter(Boolean),
      difficulties: difficulties.filter(Boolean),
      dietaryTags: dietaryTags.filter(Boolean).flat()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;