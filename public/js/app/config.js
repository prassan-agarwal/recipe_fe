// Application Configuration
const AppConfig = {
    // API Configuration
    API_BASE_URL: window.location.origin + '/api',
    
    // Endpoints
    ENDPOINTS: {
        RECIPES: '/recipes',
        RECIPES_SEARCH: '/recipes/search',
        RECIPES_FILTERS: '/recipes/meta/filters',
        VISION_ANALYZE: '/vision/analyze',
        VISION_VALIDATE: '/vision/validate',
        USERS_REGISTER: '/users/register',
        USERS_LOGIN: '/users/login',
        USERS_PROFILE: '/users/profile',
        FAVORITES: '/favorites'
    },
    
    // Application Settings
    SETTINGS: {
        MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
        SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        DEFAULT_RECIPES_PER_PAGE: 12,
        MIN_INGREDIENTS_FOR_SEARCH: 1,
        MAX_INGREDIENTS_DISPLAY: 20,
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    // UI Constants
    UI: {
        DEBOUNCE_DELAY: 300,
        TOAST_DURATION: 5000,
        LOADING_DELAY: 1000,
        AUTO_SAVE_DELAY: 1000
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        USER_TOKEN: 'recipe_app_token',
        USER_DATA: 'recipe_app_user',
        SEARCH_HISTORY: 'recipe_search_history',
        RECENT_RECIPES: 'recent_recipes',
        APP_SETTINGS: 'app_settings',
        SEARCH_RESULTS: 'recipe_search_results',
        SEARCH_INGREDIENTS: 'recipe_search_ingredients'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}