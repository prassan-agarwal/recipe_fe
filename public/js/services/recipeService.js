// Recipe Service - Handles recipe-related operations
class RecipeService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    // Search recipes by ingredients
    async searchByIngredients(ingredients, filters = {}) {
        try {
            appState.setLoading(true);
            
            console.log('🚀 Sending search request to API:');
            console.log('   Ingredients:', ingredients);
            console.log('   Filters:', filters);
            
            const results = await apiService.searchRecipes(ingredients, filters);
            
            console.log('✅ API Search Response:', {
                resultsCount: results?.length,
                results: results
            });
            
            if (!results || !Array.isArray(results)) {
                console.warn('⚠️ API returned invalid results:', results);
                throw new Error('Invalid response from server');
            }
            
            // Cache the results
            this.cache.set('search', {
                data: results,
                timestamp: Date.now()
            });
            
            appState.setSearchResults(results, ingredients);
            return results;
            
        } catch (error) {
            console.error('❌ Search failed:', error);
            appState.setError(`Search failed: ${error.message}`);
            throw error;
        } finally {
            appState.setLoading(false);
        }
    }
    
    // Get recipe by ID
    async getRecipeById(id) {
        // Check cache first
        const cached = this.getFromCache(`recipe_${id}`);
        if (cached) {
            return cached;
        }
        
        try {
            appState.setLoading(true);
            const recipe = await apiService.getRecipe(id);
            
            console.log('✅ Loaded recipe:', recipe?.title);
            
            // Cache the recipe
            this.setToCache(`recipe_${id}`, recipe);
            
            appState.setState({ currentRecipe: recipe });
            return recipe;
            
        } catch (error) {
            console.error('❌ Failed to load recipe:', error);
            appState.setError(`Failed to load recipe: ${error.message}`);
            throw error;
        } finally {
            appState.setLoading(false);
        }
    }
    
    // Get featured recipes
    async getFeaturedRecipes(limit = 6) {
        // Check cache first
        const cached = this.getFromCache('featured');
        if (cached) {
            return cached;
        }
        
        try {
            const recipes = await apiService.getRecipes({
                limit,
                page: 1
            });
            
            const featuredRecipes = recipes.recipes || recipes;
            
            console.log('✅ Loaded featured recipes:', featuredRecipes?.length);
            
            // Cache featured recipes
            this.setToCache('featured', featuredRecipes);
            
            appState.setState({ featuredRecipes: featuredRecipes });
            return featuredRecipes;
            
        } catch (error) {
            console.error('❌ Failed to load featured recipes:', error);
            return [];
        }
    }
    
    // Get recipes with filters
    async getRecipesWithFilters(filters = {}) {
        try {
            appState.setLoading(true);
            
            const recipes = await apiService.getRecipes(filters);
            const recipesList = recipes.recipes || recipes;
            
            appState.setState({ currentRecipes: recipesList });
            
            return recipes;
            
        } catch (error) {
            appState.setError(`Failed to load recipes: ${error.message}`);
            throw error;
        } finally {
            appState.setLoading(false);
        }
    }
    
    // Get filter options
    async getFilterOptions() {
        // Check cache first
        const cached = this.getFromCache('filters');
        if (cached) {
            return cached;
        }
        
        try {
            const filters = await apiService.getFilterOptions();
            
            // Cache filter options
            this.setToCache('filters', filters);
            
            return filters;
            
        } catch (error) {
            console.error('❌ Failed to load filter options:', error);
            return {
                cuisines: [],
                difficulties: [],
                dietaryTags: []
            };
        }
    }
    
    // Adjust recipe servings
    adjustRecipeServings(recipe, newServings) {
        if (!recipe || !recipe.ingredients) return recipe;
        
        const factor = newServings / recipe.servingSize;
        const adjustedRecipe = { ...recipe };
        
        adjustedRecipe.ingredients = recipe.ingredients.map(ingredient => {
            const adjustedIngredient = { ...ingredient };
            
            // Try to parse quantity and adjust
            const quantityMatch = ingredient.quantity.match(/(\d+(?:\.\d+)?)\s*(.*)/);
            if (quantityMatch) {
                const amount = parseFloat(quantityMatch[1]);
                const unit = quantityMatch[2].trim();
                
                if (!isNaN(amount)) {
                    const newAmount = amount * factor;
                    adjustedIngredient.quantity = this.formatAdjustedQuantity(newAmount) + (unit ? ' ' + unit : '');
                }
            }
            
            return adjustedIngredient;
        });
        
        adjustedRecipe.servingSize = newServings;
        
        return adjustedRecipe;
    }
    
    // Format adjusted quantity
    formatAdjustedQuantity(amount) {
        // Round to reasonable precision
        if (amount >= 100) {
            return Math.round(amount);
        } else if (amount >= 10) {
            return Math.round(amount * 10) / 10;
        } else if (amount >= 1) {
            return Math.round(amount * 100) / 100;
        } else {
            // Convert to fractions for small amounts
            const fractions = {
                0.125: '⅛',
                0.25: '¼',
                0.333: '⅓',
                0.5: '½',
                0.666: '⅔',
                0.75: '¾'
            };
            
            // Find closest fraction
            let closestFraction = null;
            let minDiff = Infinity;
            
            for (const [decimal, fraction] of Object.entries(fractions)) {
                const diff = Math.abs(amount - parseFloat(decimal));
                if (diff < minDiff) {
                    minDiff = diff;
                    closestFraction = fraction;
                }
            }
            
            // Use fraction if close enough, otherwise use decimal
            if (minDiff < 0.05 && closestFraction) {
                return closestFraction;
            } else {
                return Math.round(amount * 100) / 100;
            }
        }
    }
    
    // Calculate nutrition per serving
    calculateNutritionPerServing(recipe) {
        if (!recipe.nutritionalInfo) return null;
        
        const nutrition = { ...recipe.nutritionalInfo };
        const servingSize = recipe.servingSize || 1;
        
        Object.keys(nutrition).forEach(key => {
            if (typeof nutrition[key] === 'number') {
                nutrition[key] = Math.round(nutrition[key] / servingSize);
            }
        });
        
        return nutrition;
    }
    
    // Cache management
    setToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        // Remove expired cache
        if (cached) {
            this.cache.delete(key);
        }
        
        return null;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    // Utility methods
    parseIngredients(text) {
        if (!text) return [];
        
        return text
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient.length > 0)
            .map(ingredient => ingredient.toLowerCase());
    }
    
    formatCookingTime(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    }
    
    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': '#27ae60',
            'Medium': '#f39c12',
            'Hard': '#e74c3c'
        };
        return colors[difficulty] || '#7f8c8d';
    }
}

// Create global recipe service instance
const recipeService = new RecipeService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = recipeService;
}