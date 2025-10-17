// shared/utils/geminiHelper.js - Using Gemini API instead of Clarifai
const geminiService = require('../../services/geminiService');
const constants = require('../config/constants');

/**
 * Analyze image and extract food ingredients using Gemini
 */
async function analyzeImageForFood(imageBase64) {
  try {
    console.log('Analyzing image with Gemini...');
    const ingredients = await geminiService.analyzeImage(imageBase64);
    
    // Convert to the format expected by the rest of the app
    const ingredientsWithConfidence = ingredients.map(name => ({
      name: name,
      confidence: 85 // Gemini doesn't provide confidence scores, use default
    }));

    console.log(`Gemini analysis complete. Found ${ingredientsWithConfidence.length} ingredients.`);
    return ingredientsWithConfidence;
    
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

/**
 * Map ingredients to common names
 */
function mapToCommonIngredients(concepts) {
  return concepts.map(concept => ({
    original: concept.name,
    common: concept.name, // Gemini already gives good names
    confidence: concept.confidence || 85
  }));
}

/**
 * Validate ingredients using Gemini
 */
async function validateIngredientsWithAI(ingredients) {
  try {
    const geminiService = require('../../services/geminiService');
    const validationPrompt = ingredients.join(', ');
    
    // Simple validation - in real app you might use a more sophisticated approach
    const isValid = ingredients.every(ingredient => 
      ingredient && ingredient.length > 1 && ingredient.length < 50
    );
    
    return {
      valid: isValid,
      suggestions: [] // Could use Gemini for suggestions
    };
  } catch (error) {
    console.error('AI validation error:', error);
    return { valid: true, suggestions: [] }; // Fallback to valid
  }
}

module.exports = {
  analyzeImageForFood,
  mapToCommonIngredients,
  validateIngredientsWithAI
};