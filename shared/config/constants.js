module.exports = {
  DIETARY_TAGS: [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
    'low-carb', 'keto', 'paleo', 'low-calorie', 'high-protein'
  ],
  
  CUISINES: [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'American',
    'Thai', 'Mediterranean', 'Japanese', 'French', 'Korean'
  ],
  
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'],
  
  COOKING_TIMES: [15, 30, 45, 60, 90, 120],
  
  // AI Service Configuration
  AI_SERVICE: 'gemini', // 'gemini' or 'clarifai'
  
  // Minimum confidence for ingredient detection (for compatibility)
  MIN_CONFIDENCE: 0.7,
  
  // Gemini-specific settings
  GEMINI_CONFIG: {
    MODEL: 'gemini-pro-vision',
    MAX_INGREDIENTS: 12,
    TIMEOUT: 30000
  }
};