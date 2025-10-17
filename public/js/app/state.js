// Application State Management
class AppState {
    constructor() {
        this.state = {
            // User state
            user: null,
            isAuthenticated: false,
            token: null,
            
            // Recipe state
            currentRecipes: [],
            featuredRecipes: [],
            favoriteRecipes: [],
            currentRecipe: null,
            searchResults: [],
            searchIngredients: [],
            
            // UI state
            isLoading: false,
            currentPage: 'home',
            filters: {
                cuisine: '',
                difficulty: '',
                dietary: '',
                time: '',
                sortBy: 'match'
            },
            
            // App state
            error: null,
            success: null,
            lastSearch: null
        };
        
        this.init();
    }
    
    init() {
        // Load saved state from localStorage
        this.loadFromStorage();
        
        // Set up state change listeners
        this.listeners = [];
    }
    
    // State getters
    getState() {
        return { ...this.state };
    }
    
    getUser() {
        return this.state.user;
    }
    
    isUserAuthenticated() {
        return this.state.isAuthenticated && this.state.token;
    }
    
    getCurrentRecipes() {
        return this.state.currentRecipes;
    }
    
    getFilters() {
        return { ...this.state.filters };
    }
    
    // State setters
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.notifyListeners(oldState, this.state);
        this.saveToStorage();
    }
    
    setUser(user, token = null) {
        this.setState({
            user,
            isAuthenticated: !!user,
            token: token || this.state.token
        });
    }
    
    setLoading(loading) {
        this.setState({ isLoading: loading });
    }
    
    setError(error) {
        this.setState({ error });
        
        // Auto-clear error after 5 seconds
        if (error) {
            setTimeout(() => {
                this.setState({ error: null });
            }, 5000);
        }
    }
    
    setSuccess(message) {
        this.setState({ success: message });
        
        // Auto-clear success after 5 seconds
        if (message) {
            setTimeout(() => {
                this.setState({ success: null });
            }, 5000);
        }
    }
    
    setFilters(filters) {
        this.setState({ filters: { ...this.state.filters, ...filters } });
    }
    
    setSearchResults(recipes, ingredients = []) {
        console.log('💾 Saving search results to state:', {
            recipesCount: recipes?.length,
            ingredients: ingredients
        });
        
        this.setState({
            searchResults: recipes,
            searchIngredients: ingredients,
            lastSearch: new Date().toISOString()
        });
        
        // Force save to localStorage for persistence
        this.saveToStorage();
    }
    
    // State actions
    login(user, token) {
        localStorage.setItem('recipe_app_token', token);
        localStorage.setItem('recipe_app_user', JSON.stringify(user));
        this.setUser(user, token);
        this.setSuccess(`Welcome back, ${user.username}!`);
    }
    
    logout() {
        localStorage.removeItem('recipe_app_token');
        localStorage.removeItem('recipe_app_user');
        this.setUser(null, null);
        this.setSuccess('Logged out successfully');
    }
    
    addToFavorites(recipe) {
        const favorites = [...this.state.favoriteRecipes];
        if (!favorites.find(fav => fav._id === recipe._id)) {
            favorites.push(recipe);
            this.setState({ favoriteRecipes: favorites });
        }
    }
    
    removeFromFavorites(recipeId) {
        const favorites = this.state.favoriteRecipes.filter(recipe => recipe._id !== recipeId);
        this.setState({ favoriteRecipes: favorites });
    }
    
    isFavorite(recipeId) {
        return this.state.favoriteRecipes.some(recipe => recipe._id === recipeId);
    }
    
    // Storage management
    loadFromStorage() {
        try {
            const token = localStorage.getItem('recipe_app_token');
            const userData = localStorage.getItem('recipe_app_user');
            
            if (token && userData) {
                const user = JSON.parse(userData);
                this.setUser(user, token);
            }
            
            // Load search results for persistence
            const searchResults = localStorage.getItem('recipe_search_results');
            const searchIngredients = localStorage.getItem('recipe_search_ingredients');
            
            if (searchResults) {
                this.state.searchResults = JSON.parse(searchResults);
            }
            if (searchIngredients) {
                this.state.searchIngredients = JSON.parse(searchIngredients);
            }
            
            console.log('📂 Loaded state from storage:', {
                user: !!this.state.user,
                searchResults: this.state.searchResults?.length,
                searchIngredients: this.state.searchIngredients?.length
            });

        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }
    
    saveToStorage() {
        try {
            if (this.state.user && this.state.token) {
                localStorage.setItem('recipe_app_user', JSON.stringify(this.state.user));
                localStorage.setItem('recipe_app_token', this.state.token);
            }
            
            // Save search results for persistence between pages
            if (this.state.searchResults) {
                localStorage.setItem('recipe_search_results', JSON.stringify(this.state.searchResults));
            }
            if (this.state.searchIngredients) {
                localStorage.setItem('recipe_search_ingredients', JSON.stringify(this.state.searchIngredients));
            }
            
        } catch (error) {
            console.error('Error saving state to storage:', error);
        }
    }
    
    // Event listeners
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }
    
    notifyListeners(oldState, newState) {
        this.listeners.forEach(listener => {
            try {
                listener(oldState, newState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }
    
    // Utility methods
    clearSearch() {
        this.setState({
            searchResults: [],
            searchIngredients: [],
            lastSearch: null
        });
        
        // Clear from localStorage too
        localStorage.removeItem('recipe_search_results');
        localStorage.removeItem('recipe_search_ingredients');
    }
    
    resetFilters() {
        this.setState({
            filters: {
                cuisine: '',
                difficulty: '',
                dietary: '',
                time: '',
                sortBy: 'match'
            }
        });
    }
}

// Create global app state instance
const appState = new AppState();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appState;
}