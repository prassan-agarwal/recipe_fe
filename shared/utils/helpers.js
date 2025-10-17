// Utility functions for the application

/**
 * Calculate match score between user ingredients and recipe ingredients
 */
function calculateMatchScore(userIngredients, recipeIngredients) {
  const userIngredientNames = userIngredients.map(ing => ing.toLowerCase().trim());
  const recipeIngredientNames = recipeIngredients.map(ing => ing.name.toLowerCase());
  
  const matchingIngredients = recipeIngredientNames.filter(recipeIngredient =>
    userIngredientNames.some(userIngredient =>
      recipeIngredient.includes(userIngredient) || userIngredient.includes(recipeIngredient)
    )
  );
  
  return Math.round((matchingIngredients.length / recipeIngredientNames.length) * 100);
}

/**
 * Format cooking time from minutes to human readable format
 */
function formatCookingTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

/**
 * Normalize ingredient names for better matching
 */
function normalizeIngredientName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  calculateMatchScore,
  formatCookingTime,
  normalizeIngredientName,
  isValidEmail,
  generateId
};