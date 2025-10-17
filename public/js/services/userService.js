// User Service - Handles user authentication and profile management
class UserService {
    constructor() {
        this.token = null;
        this.user = null;
    }
    
    // User registration
    async register(userData) {
        try {
            appState.setLoading(true);
            
            console.log('👤 Registering user:', userData.username);
            const response = await apiService.register(userData);
            
            // Auto-login after registration
            await this.login({
                email: userData.email,
                password: userData.password
            });
            
            appState.setSuccess('Account created successfully!');
            return response;
            
        } catch (error) {
            console.error('❌ Registration failed:', error);
            appState.setError(`Registration failed: ${error.message}`);
            throw error;
        } finally {
            appState.setLoading(false);
        }
    }
    
    // User login
    async login(credentials) {
        try {
            appState.setLoading(true);
            
            console.log('🔐 Logging in user:', credentials.email);
            const response = await apiService.login(credentials);
            
            // Store user data in app state
            appState.login(response.user, response.token);
            
            console.log('✅ Login successful:', response.user.username);
            return response;
            
        } catch (error) {
            console.error('❌ Login failed:', error);
            appState.setError(`Login failed: ${error.message}`);
            throw error;
        } finally {
            appState.setLoading(false);
        }
    }
    
    // User logout
    logout() {
        console.log('👋 Logging out user');
        appState.logout();
        appState.setSuccess('Logged out successfully');
    }
    
    // Get user profile
    async getProfile() {
        try {
            const response = await apiService.getProfile();
            appState.setUser(response.user);
            return response;
        } catch (error) {
            console.error('❌ Failed to get profile:', error);
            throw error;
        }
    }
    
    // Update user preferences
    async updatePreferences(preferences) {
        // In a real app, this would call an API endpoint
        const user = appState.getUser();
        if (user) {
            const updatedUser = {
                ...user,
                dietaryPreferences: preferences.dietary || user.dietaryPreferences
            };
            
            appState.setUser(updatedUser);
            appState.setSuccess('Preferences updated successfully');
        }
    }
    
    // Favorite management
    async addToFavorites(recipeId) {
        try {
            if (!appState.isUserAuthenticated()) {
                throw new Error('Please log in to add favorites');
            }
            
            console.log('❤️ Adding to favorites:', recipeId);
            const response = await apiService.addFavorite(recipeId);
            appState.addToFavorites(response.recipe);
            appState.setSuccess('Recipe added to favorites!');
            
            return response;
        } catch (error) {
            console.error('❌ Failed to add favorite:', error);
            appState.setError(`Failed to add favorite: ${error.message}`);
            throw error;
        }
    }
    
    async removeFromFavorites(recipeId) {
        try {
            if (!appState.isUserAuthenticated()) {
                throw new Error('Please log in to manage favorites');
            }
            
            console.log('💔 Removing from favorites:', recipeId);
            await apiService.removeFavorite(recipeId);
            appState.removeFromFavorites(recipeId);
            appState.setSuccess('Recipe removed from favorites');
            
        } catch (error) {
            console.error('❌ Failed to remove favorite:', error);
            appState.setError(`Failed to remove favorite: ${error.message}`);
            throw error;
        }
    }
    
    async getFavorites() {
        try {
            if (!appState.isUserAuthenticated()) {
                return [];
            }
            
            console.log('📋 Getting favorites');
            const favorites = await apiService.getFavorites();
            appState.setState({ favoriteRecipes: favorites });
            
            console.log('✅ Loaded favorites:', favorites.length);
            return favorites;
        } catch (error) {
            console.error('❌ Failed to get favorites:', error);
            return [];
        }
    }
    
    // Check if recipe is favorite
    isFavorite(recipeId) {
        return appState.isFavorite(recipeId);
    }
    
    // Toggle favorite status
    async toggleFavorite(recipe) {
        if (!recipe || !recipe._id) return;
        
        const isCurrentlyFavorite = this.isFavorite(recipe._id);
        
        console.log('🔄 Toggling favorite:', recipe._id, 'currently:', isCurrentlyFavorite);
        
        try {
            if (isCurrentlyFavorite) {
                await this.removeFromFavorites(recipe._id);
            } else {
                await this.addToFavorites(recipe._id);
            }
            
            return !isCurrentlyFavorite;
        } catch (error) {
            console.error('❌ Failed to toggle favorite:', error);
            throw error;
        }
    }
    
    // Search history management
    addToSearchHistory(search) {
        try {
            const history = this.getSearchHistory();
            const newEntry = {
                query: search,
                timestamp: new Date().toISOString()
            };
            
            // Add to beginning and keep only last 10
            history.unshift(newEntry);
            const limitedHistory = history.slice(0, 10);
            
            localStorage.setItem('recipe_search_history', JSON.stringify(limitedHistory));
            console.log('💾 Saved to search history:', search);
        } catch (error) {
            console.error('❌ Failed to save search history:', error);
        }
    }
    
    getSearchHistory() {
        try {
            const history = localStorage.getItem('recipe_search_history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('❌ Failed to load search history:', error);
            return [];
        }
    }
    
    clearSearchHistory() {
        try {
            localStorage.removeItem('recipe_search_history');
            appState.setSuccess('Search history cleared');
        } catch (error) {
            appState.setError('Failed to clear search history');
        }
    }
    
    // Recent recipes management
    addToRecentRecipes(recipe) {
        try {
            const recent = this.getRecentRecipes();
            const newEntry = {
                recipe: {
                    _id: recipe._id,
                    title: recipe.title,
                    imageUrl: recipe.imageUrl,
                    cookingTime: recipe.cookingTime,
                    difficulty: recipe.difficulty
                },
                viewedAt: new Date().toISOString()
            };
            
            // Remove if already exists
            const filteredRecent = recent.filter(item => item.recipe._id !== recipe._id);
            
            // Add to beginning and keep only last 10
            filteredRecent.unshift(newEntry);
            const limitedRecent = filteredRecent.slice(0, 10);
            
            localStorage.setItem('recent_recipes', JSON.stringify(limitedRecent));
            console.log('💾 Added to recent recipes:', recipe.title);
        } catch (error) {
            console.error('❌ Failed to save recent recipe:', error);
        }
    }
    
    getRecentRecipes() {
        try {
            const recent = localStorage.getItem('recent_recipes');
            return recent ? JSON.parse(recent) : [];
        } catch (error) {
            console.error('❌ Failed to load recent recipes:', error);
            return [];
        }
    }
    
    // Validation methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePassword(password) {
        return password && password.length >= 6;
    }
    
    validateUsername(username) {
        return username && username.length >= 3 && username.length <= 30;
    }
}

// Create global user service instance
const userService = new UserService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = userService;
}