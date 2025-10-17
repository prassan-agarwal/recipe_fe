// Application Constants
const Constants = {
    // Application Info
    APP_NAME: 'Smart Recipe Generator',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'AI-powered recipe generator using image recognition',
    
    // API Configuration
    API: {
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },
    
    // Recipe Constants
    RECIPE: {
        DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'],
        DIFFICULTY_COLORS: {
            'Easy': '#27ae60',
            'Medium': '#f39c12', 
            'Hard': '#e74c3c'
        },
        CUISINES: [
            'American', 'Italian', 'Mexican', 'Chinese', 'Indian',
            'Thai', 'Japanese', 'Mediterranean', 'French', 'Korean',
            'Vietnamese', 'Greek', 'Spanish', 'Middle Eastern', 'Caribbean'
        ],
        DIETARY_TAGS: [
            'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
            'low-carb', 'keto', 'paleo', 'low-calorie', 'high-protein',
            'sugar-free', 'low-fat', 'heart-healthy', 'high-fiber'
        ],
        COOKING_METHODS: [
            'Baking', 'Grilling', 'Frying', 'Boiling', 'Steaming',
            'Roasting', 'Sautéing', 'Slow Cooking', 'Pressure Cooking'
        ],
        MEAL_TYPES: [
            'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack',
            'Appetizer', 'Side Dish', 'Main Course', 'Beverage'
        ]
    },
    
    // Ingredient Constants
    INGREDIENT: {
        CATEGORIES: [
            'vegetable', 'fruit', 'protein', 'grain', 'dairy',
            'spice', 'herb', 'oil', 'sauce', 'nut', 'legume',
            'seafood', 'baking', 'beverage', 'condiment'
        ],
        UNITS: [
            'cup', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l',
            'piece', 'clove', 'bunch', 'pinch', 'to taste', 'slice',
            'can', 'package', 'bag', 'jar', 'bottle', 'packet', 'leaf', 'stalk'
        ],
        UNIT_CONVERSIONS: {
            'tbsp': { 'tsp': 3, 'ml': 14.7868 },
            'tsp': { 'tbsp': 0.3333, 'ml': 4.92892 },
            'cup': { 'tbsp': 16, 'tsp': 48, 'ml': 236.588 },
            'oz': { 'g': 28.3495 },
            'lb': { 'oz': 16, 'g': 453.592 }
        }
    },
    
    // Nutritional Constants
    NUTRITION: {
        DAILY_VALUES: {
            calories: 2000,
            protein: 50, // grams
            carbs: 300,  // grams
            fat: 65,     // grams
            fiber: 25,   // grams
            sugar: 50,   // grams
            sodium: 2300 // milligrams
        },
        NUTRIENT_COLORS: {
            calories: '#e74c3c',
            protein: '#3498db', 
            carbs: '#f39c12',
            fat: '#9b59b6',
            fiber: '#27ae60',
            sugar: '#e67e22'
        }
    },
    
    // UI Constants
    UI: {
        BREAKPOINTS: {
            MOBILE: 768,
            TABLET: 1024,
            DESKTOP: 1200
        },
        COLORS: {
            PRIMARY: '#e74c3c',
            PRIMARY_DARK: '#c0392b',
            SECONDARY: '#3498db',
            ACCENT: '#f39c12',
            SUCCESS: '#27ae60',
            WARNING: '#f39c12',
            ERROR: '#e74c3c',
            INFO: '#3498db'
        },
        Z_INDEX: {
            MODAL: 10000,
            DROPDOWN: 1000,
            TOOLTIP: 500,
            HEADER: 100
        }
    },
    
    // Validation Constants
    VALIDATION: {
        USERNAME: {
            MIN_LENGTH: 3,
            MAX_LENGTH: 30,
            PATTERN: /^[a-zA-Z0-9_]+$/
        },
        PASSWORD: {
            MIN_LENGTH: 6,
            PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
        },
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        RECIPE: {
            TITLE_MAX_LENGTH: 100,
            DESCRIPTION_MAX_LENGTH: 500,
            INSTRUCTION_MAX_LENGTH: 1000,
            MAX_INGREDIENTS: 50,
            MAX_INSTRUCTIONS: 20
        }
    },
    
    // Error Messages
    ERRORS: {
        NETWORK: 'Network error. Please check your connection and try again.',
        UNAUTHORIZED: 'Please log in to access this feature.',
        FORBIDDEN: 'You do not have permission to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION: 'Please check your input and try again.',
        IMAGE_UPLOAD: 'Failed to upload image. Please try again.',
        IMAGE_ANALYSIS: 'Failed to analyze image. Please try another image.'
    },
    
    // Success Messages
    SUCCESS: {
        RECIPE_CREATED: 'Recipe created successfully!',
        RECIPE_UPDATED: 'Recipe updated successfully!',
        RECIPE_DELETED: 'Recipe deleted successfully!',
        FAVORITE_ADDED: 'Recipe added to favorites!',
        FAVORITE_REMOVED: 'Recipe removed from favorites!',
        PROFILE_UPDATED: 'Profile updated successfully!',
        PASSWORD_CHANGED: 'Password changed successfully!'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        USER_SESSION: 'recipe_app_session',
        USER_PREFERENCES: 'recipe_app_preferences',
        SEARCH_HISTORY: 'recipe_search_history',
        RECENT_RECIPES: 'recent_recipes',
        COOKING_SESSIONS: 'cooking_sessions'
    },
    
    // Feature Flags
    FEATURES: {
        IMAGE_RECOGNITION: true,
        MEAL_PLANNING: false,
        SHOPPING_LIST: false,
        COOKING_TIMER: false,
        NUTRITION_TRACKING: false
    },
    
    // External Services
    SERVICES: {
        GEMINI: {
            MODEL: 'gemini-pro-vision',
            TIMEOUT: 30000
        }
    }
};

// Freeze the constants to prevent modification
Object.freeze(Constants);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constants;
}