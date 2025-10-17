const express = require('express');
const router = express.Router();
const { analyzeImageForFood, validateIngredientsWithAI } = require('../../shared/utils/geminiHelper');

// Analyze image for ingredients using Gemini
router.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false,
        message: 'Image data is required' 
      });
    }

    console.log('Received image for analysis with Gemini...');
    const ingredients = await analyzeImageForFood(image);
    
    res.json({ 
      success: true, 
      ingredients: ingredients.map(ing => ing.name),
      detectedCount: ingredients.length,
      message: `Found ${ingredients.length} ingredients using Gemini AI`
    });
    
  } catch (error) {
    console.error('Vision analysis error:', error);
    
    // Provide more user-friendly error messages
    let userMessage = 'Failed to analyze image';
    if (error.message.includes('API_KEY_INVALID')) {
      userMessage = 'Gemini API key is invalid. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      userMessage = 'AI service quota exceeded. Please try again later.';
    } else if (error.message.includes('temporarily unavailable')) {
      userMessage = 'AI service is temporarily unavailable. Please try again.';
    }
    
    res.status(500).json({ 
      success: false, 
      message: userMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Validate text ingredients
router.post('/validate', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ 
        success: false,
        message: 'Ingredients array is required' 
      });
    }

    const validationResult = await validateIngredientsWithAI(ingredients);
    const validatedIngredients = ingredients.map(ingredient => ({
      name: ingredient.trim().toLowerCase(),
      valid: ingredient.trim().length > 1 // Basic validation
    }));

    res.json({
      success: true,
      ingredients: validatedIngredients,
      validCount: validatedIngredients.filter(ing => ing.valid).length,
      aiSuggestions: validationResult.suggestions
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Validation failed',
      error: error.message 
    });
  }
});

// New endpoint for text-based ingredient suggestions
router.post('/suggest', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        success: false,
        message: 'Description is required' 
      });
    }

    const geminiService = require('../../../services/geminiService');
    const suggestions = await geminiService.suggestIngredientsFromText(description);
    
    res.json({
      success: true,
      suggestions,
      count: suggestions.length
    });
    
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate suggestions',
      error: error.message 
    });
  }
});

module.exports = router;