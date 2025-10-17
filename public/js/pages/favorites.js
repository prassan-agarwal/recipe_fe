// Favorites Page Controller
class FavoritesPage {
    static init() {
        this.favoriteRecipes = [];
        
        console.log('❤️ FavoritesPage initializing...');
        
        this.bindEvents();
        this.loadFavorites();
        
        // Listen for state changes
        appState.addListener(this.onStateChange.bind(this));
        
        console.log('✅ FavoritesPage initialized successfully');
    }
    
    static bindEvents() {
        console.log('🔗 Binding favorites page events...');
        
        // Listen for favorite updates
        document.addEventListener('click', (event) => {
            if (event.target.closest('.recipe-favorite')) {
                console.log('❤️ Favorite button clicked in favorites page');
                // Re-load favorites after a change
                setTimeout(() => {
                    this.loadFavorites();
                }, 100);
            }
        });
        
        console.log('✅ Favorites page events bound');
    }
    
    static async loadFavorites() {
        const favoritesContainer = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        const favoritesCount = document.getElementById('favoritesCount');
        
        console.log('📥 Loading favorites...');
        console.log('   User authenticated:', appState.isUserAuthenticated());

        if (!appState.isUserAuthenticated()) {
            console.log('❌ User not authenticated, showing login prompt');
            this.showLoginPrompt();
            return;
        }

        try {
            appState.setLoading(true);
            console.log('🔄 Fetching favorites from server...');
            
            this.favoriteRecipes = await userService.getFavorites();
            
            console.log('✅ Favorites loaded:', this.favoriteRecipes.length);

            if (favoritesCount) {
                favoritesCount.textContent = `You have ${this.favoriteRecipes.length} favorite recipe${this.favoriteRecipes.length !== 1 ? 's' : ''}`;
                console.log('📊 Favorites count updated');
            }

            if (this.favoriteRecipes.length === 0) {
                console.log('⚠️ No favorites found');
                this.showNoFavorites();
            } else {
                console.log('🎨 Displaying favorites');
                this.displayFavorites();
            }

        } catch (error) {
            console.error('❌ Failed to load favorites:', error);
            this.showError(`Failed to load favorites: ${error.message}`);
        } finally {
            appState.setLoading(false);
        }
    }
    
    static displayFavorites() {
        const favoritesContainer = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        
        if (!favoritesContainer) {
            console.log('❌ Favorites container not found');
            return;
        }

        console.log('🎨 Rendering favorite recipes:', this.favoriteRecipes.length);

        // Hide no favorites message
        if (noFavorites) {
            noFavorites.classList.add('hidden');
            console.log('✅ No favorites message hidden');
        }

        // Show favorites grid
        favoritesContainer.classList.remove('hidden');

        // Render favorite recipes
        RecipeCardComponent.renderGrid(this.favoriteRecipes, 'favoritesGrid', {
            showFavoriteButton: true,
            showMatchScore: false
        });
        
        console.log('✅ Favorites displayed successfully');
    }
    
    static showNoFavorites() {
        const favoritesContainer = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        
        console.log('🚫 Showing no favorites message');

        if (favoritesContainer) {
            favoritesContainer.classList.add('hidden');
        }

        if (noFavorites) {
            noFavorites.classList.remove('hidden');
        }
        
        console.log('✅ No favorites message displayed');
    }
    
    static showLoginPrompt() {
        const favoritesContainer = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        const favoritesCount = document.getElementById('favoritesCount');
        
        console.log('🔐 Showing login prompt');

        if (favoritesContainer) {
            favoritesContainer.classList.add('hidden');
        }

        if (noFavorites) {
            noFavorites.classList.remove('hidden');
            noFavorites.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <h3>Sign In to Save Favorites</h3>
                    <p>Create an account or sign in to save your favorite recipes and access them from any device.</p>
                    <div class="auth-prompt-buttons">
                        <button class="btn btn-primary" onclick="HeaderComponent.showLoginModal()">Sign In</button>
                        <button class="btn btn-outline" onclick="HeaderComponent.showRegisterModal()">Create Account</button>
                    </div>
                </div>
            `;
        }

        if (favoritesCount) {
            favoritesCount.textContent = 'Sign in to view your favorites';
        }
        
        console.log('✅ Login prompt displayed');
    }
    
    static onStateChange(oldState, newState) {
        console.log('🔄 Favorites page state change detected');
        
        // Reload favorites if authentication state changed
        if (newState.isAuthenticated !== oldState.isAuthenticated) {
            console.log('🔐 Authentication state changed, reloading favorites...');
            this.loadFavorites();
        }
        
        // Reload favorites if favorites list changed
        if (newState.favoriteRecipes !== oldState.favoriteRecipes) {
            console.log('❤️ Favorites list changed, reloading...');
            this.loadFavorites();
        }
        
        // Handle loading state
        if (newState.isLoading !== oldState.isLoading) {
            console.log('🔄 Loading state:', newState.isLoading);
            this.toggleLoadingState(newState.isLoading);
        }
        
        // Handle errors and success messages
        if (newState.error && newState.error !== oldState.error) {
            console.log('❌ State error:', newState.error);
            this.showError(newState.error);
        }
        
        if (newState.success && newState.success !== oldState.success) {
            console.log('✅ State success:', newState.success);
            this.showSuccess(newState.success);
        }
    }
    
    static toggleLoadingState(isLoading) {
        const favoritesContainer = document.getElementById('favoritesGrid');
        
        console.log('🔄 Toggle loading state:', isLoading);

        if (isLoading) {
            if (favoritesContainer) {
                favoritesContainer.innerHTML = RecipeCardComponent.createPlaceholder(6);
                console.log('✅ Placeholder cards shown');
            }
        }
    }
    
    static showError(message) {
        console.log('🚨 Showing error:', message);
        if (typeof HomePage !== 'undefined') {
            HomePage.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    static showSuccess(message) {
        console.log('🎉 Showing success:', message);
        if (typeof HomePage !== 'undefined') {
            HomePage.showSuccess(message);
        }
    }
    
    // Method to export favorites (for future features)
    static exportFavorites() {
        if (this.favoriteRecipes.length === 0) {
            console.log('❌ No favorites to export');
            this.showError('No favorites to export');
            return;
        }

        console.log('📤 Exporting favorites:', this.favoriteRecipes.length);

        const exportData = {
            exportDate: new Date().toISOString(),
            favoriteCount: this.favoriteRecipes.length,
            favorites: this.favoriteRecipes.map(recipe => ({
                title: recipe.title,
                cookingTime: recipe.cookingTime,
                difficulty: recipe.difficulty,
                cuisine: recipe.cuisine,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions
            }))
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-favorite-recipes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showSuccess('Favorites exported successfully!');
        console.log('✅ Favorites exported successfully');
    }
    
    // Method to clear all favorites (for future features)
    static async clearAllFavorites() {
        if (this.favoriteRecipes.length === 0) {
            console.log('❌ No favorites to clear');
            this.showError('No favorites to clear');
            return;
        }

        console.log('🗑️ Clearing all favorites:', this.favoriteRecipes.length);

        if (!confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
            console.log('❌ Clear favorites cancelled by user');
            return;
        }

        try {
            // Remove each favorite individually
            for (const recipe of this.favoriteRecipes) {
                await userService.removeFromFavorites(recipe._id);
            }

            this.showSuccess('All favorites cleared successfully!');
            this.loadFavorites();
            console.log('✅ All favorites cleared');

        } catch (error) {
            console.error('❌ Failed to clear favorites:', error);
            this.showError('Failed to clear favorites');
        }
    }
}

// Add auth prompt styles
const authPromptStyles = `
<style>
.auth-prompt-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
}

@media (max-width: 480px) {
    .auth-prompt-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .auth-prompt-buttons .btn {
        width: 200px;
    }
}
</style>
`;

// Inject auth prompt styles
document.head.insertAdjacentHTML('beforeend', authPromptStyles);

// Initialize favorites page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('❤️ DOM loaded, initializing FavoritesPage...');
    FavoritesPage.init();
});