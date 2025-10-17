// Recipe Detail Page Controller
class RecipeDetailPage {
    static init() {
        this.currentRecipe = null;
        this.currentServings = 1;
        
        console.log('📖 RecipeDetailPage initializing...');
        
        this.bindEvents();
        this.loadRecipe();
        
        // Listen for state changes
        appState.addListener(this.onStateChange.bind(this));
        
        console.log('✅ RecipeDetailPage initialized successfully');
    }
    
    static bindEvents() {
        console.log('🔗 Binding detail page events...');
        
        // Favorite button
        document.addEventListener('click', (event) => {
            if (event.target.closest('#favoriteButton')) {
                console.log('❤️ Favorite button clicked');
                this.toggleFavorite();
            }
        });
        
        // Serving adjustment
        const servingInput = document.getElementById('servingInput');
        if (servingInput) {
            servingInput.addEventListener('change', this.adjustServings.bind(this));
            console.log('✅ Serving input event bound');
        }
        
        // Print button
        const printButton = document.getElementById('printButton');
        if (printButton) {
            printButton.addEventListener('click', this.printRecipe.bind(this));
            console.log('✅ Print button event bound');
        }
        
        // Share button
        const shareButton = document.getElementById('shareButton');
        if (shareButton) {
            shareButton.addEventListener('click', this.shareRecipe.bind(this));
            console.log('✅ Share button event bound');
        }
        
        console.log('✅ Detail page events bound');
    }
    
    static async loadRecipe() {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');
        
        console.log('📥 Loading recipe with ID:', recipeId);

        if (!recipeId) {
            console.log('❌ No recipe ID specified');
            this.showError('No recipe specified');
            return;
        }

        try {
            appState.setLoading(true);
            console.log('🔄 Loading recipe data...');
            
            const recipe = await recipeService.getRecipeById(recipeId);
            this.currentRecipe = recipe;
            this.currentServings = recipe.servingSize || 1;
            
            console.log('✅ Recipe loaded:', recipe.title);
            this.displayRecipe(recipe);
            
            // Add to recent recipes
            userService.addToRecentRecipes(recipe);
            
        } catch (error) {
            console.error('❌ Failed to load recipe:', error);
            this.showError(`Failed to load recipe: ${error.message}`);
        } finally {
            appState.setLoading(false);
        }
    }
    
    static displayRecipe(recipe) {
        const container = document.getElementById('recipeDetail');
        if (!container) {
            console.log('❌ Recipe detail container not found');
            return;
        }

        const isFavorite = userService.isFavorite(recipe._id);
        const nutritionPerServing = recipeService.calculateNutritionPerServing(recipe);
        
        console.log('🎨 Displaying recipe:', recipe.title);
        console.log('   Is favorite:', isFavorite);
        console.log('   Nutrition info:', !!nutritionPerServing);

        container.innerHTML = `
            <article class="recipe-detail">
                <div class="recipe-hero">
                    ${recipe.imageUrl ? `
                        <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-hero-image" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMEYwRjAiLz48cGF0aCBkPSJNMzAwIDE2MEMyNjguNjcyIDE2MCAyNDAgMTg4LjY3MiAyNDAgMjIwQzI0MCAyNTEuMzI4IDI2OC42NzIgMjgwIDMwMCAyODBDMzMxLjMyOCAyODAgMzYwIDI1MS4zMjggMzYwIDIyMEMzNjAgMTg4LjY3MiAzMzEuMzI4IDE2MCAzMDAgMTYwWk0yNDAgMzIwSDU2MFYzNDBIMjQwVjMyMFoiIGZpbGw9IiNDQ0NDQ0MiLz48L3N2Zz4='">
                    ` : `
                        <div class="recipe-hero-image placeholder">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                            </svg>
                        </div>
                    `}
                    
                    <h1>${recipe.title}</h1>
                    <p class="recipe-description">${recipe.description}</p>
                    
                    <div class="recipe-actions">
                        <button id="favoriteButton" class="btn ${isFavorite ? 'btn-primary' : 'btn-outline'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            ${isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                        </button>
                        <button id="printButton" class="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                <path d="M6 14h12v8H6z"/>
                            </svg>
                            Print Recipe
                        </button>
                        <button id="shareButton" class="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                            </svg>
                            Share
                        </button>
                    </div>
                </div>
                
                <div class="recipe-info-grid">
                    <div class="info-item">
                        <div class="info-label">Prep Time</div>
                        <div class="info-value">${recipeService.formatCookingTime(recipe.cookingTime)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Difficulty</div>
                        <div class="info-value" style="color: ${recipeService.getDifficultyColor(recipe.difficulty)}">
                            ${recipe.difficulty}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Cuisine</div>
                        <div class="info-value">${recipe.cuisine}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Servings</div>
                        <div class="info-value">
                            <input type="number" id="servingInput" min="1" max="20" value="${this.currentServings}" 
                                   style="width: 60px; text-align: center; padding: 4px;">
                        </div>
                    </div>
                </div>
                
                ${recipe.dietaryTags && recipe.dietaryTags.length > 0 ? `
                    <div class="recipe-section">
                        <h3>Dietary Information</h3>
                        <div class="recipe-tags">
                            ${recipe.dietaryTags.map(tag => `
                                <span class="recipe-tag">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="recipe-section">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list" id="ingredientsList">
                        ${recipe.ingredients.map(ingredient => `
                            <li class="ingredient-item">
                                <span class="ingredient-quantity">${ingredient.quantity}</span>
                                <span class="ingredient-name">${ingredient.name}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="recipe-section">
                    <h3>Instructions</h3>
                    <ol class="instructions-list">
                        ${recipe.instructions.map((instruction, index) => `
                            <li class="instruction-item">${instruction}</li>
                        `).join('')}
                    </ol>
                </div>
                
                ${nutritionPerServing ? `
                    <div class="recipe-section">
                        <h3>Nutrition Information</h3>
                        <p><em>Per serving</em></p>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <div class="nutrition-value">${nutritionPerServing.calories || 'N/A'}</div>
                                <div class="nutrition-label">Calories</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-value">${nutritionPerServing.protein || 'N/A'}g</div>
                                <div class="nutrition-label">Protein</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-value">${nutritionPerServing.carbs || 'N/A'}g</div>
                                <div class="nutrition-label">Carbs</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-value">${nutritionPerServing.fat || 'N/A'}g</div>
                                <div class="nutrition-label">Fat</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="recipe-section">
                    <h3>Tips & Notes</h3>
                    <ul>
                        <li>Make sure all ingredients are at room temperature for best results</li>
                        <li>You can adjust spices according to your taste preferences</li>
                        <li>Leftovers can be stored in an airtight container for up to 3 days</li>
                    </ul>
                </div>
            </article>
        `;
        
        console.log('✅ Recipe displayed successfully');
    }
    
    static async toggleFavorite() {
        if (!this.currentRecipe) {
            console.log('❌ No current recipe to favorite');
            return;
        }
        
        console.log('❤️ Toggling favorite for:', this.currentRecipe.title);

        try {
            await userService.toggleFavorite(this.currentRecipe);
            
            // Update button state
            const favoriteButton = document.getElementById('favoriteButton');
            if (favoriteButton) {
                const isFavorite = userService.isFavorite(this.currentRecipe._id);
                favoriteButton.className = isFavorite ? 'btn btn-primary' : 'btn btn-outline';
                favoriteButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    ${isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                `;
                console.log('✅ Favorite button updated:', isFavorite ? 'favorited' : 'unfavorited');
            }
        } catch (error) {
            console.error('❌ Failed to update favorite:', error);
            this.showError(`Failed to update favorite: ${error.message}`);
        }
    }
    
    static adjustServings(event) {
        const newServings = parseInt(event.target.value);
        
        console.log('⚖️ Adjusting servings to:', newServings);

        if (isNaN(newServings) || newServings < 1 || newServings > 20) {
            event.target.value = this.currentServings;
            console.log('❌ Invalid serving size, reset to:', this.currentServings);
            return;
        }

        this.currentServings = newServings;

        if (this.currentRecipe) {
            const adjustedRecipe = recipeService.adjustRecipeServings(this.currentRecipe, newServings);
            this.updateIngredientsList(adjustedRecipe.ingredients);
            console.log('✅ Servings adjusted successfully');
        }
    }
    
    static updateIngredientsList(ingredients) {
        const ingredientsList = document.getElementById('ingredientsList');
        if (!ingredientsList) {
            console.log('❌ Ingredients list not found');
            return;
        }

        console.log('📝 Updating ingredients list');

        ingredientsList.innerHTML = ingredients.map(ingredient => `
            <li class="ingredient-item">
                <span class="ingredient-quantity">${ingredient.quantity}</span>
                <span class="ingredient-name">${ingredient.name}</span>
            </li>
        `).join('');
        
        console.log('✅ Ingredients list updated');
    }
    
    static printRecipe() {
        console.log('🖨️ Printing recipe...');
        window.print();
    }
    
    static async shareRecipe() {
        if (!this.currentRecipe) {
            console.log('❌ No recipe to share');
            return;
        }

        console.log('📤 Sharing recipe:', this.currentRecipe.title);

        const shareData = {
            title: this.currentRecipe.title,
            text: `Check out this recipe: ${this.currentRecipe.title}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log('✅ Recipe shared successfully');
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                this.showSuccess('Recipe link copied to clipboard!');
                console.log('✅ Recipe link copied to clipboard');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    this.showSuccess('Recipe link copied to clipboard!');
                    console.log('✅ Recipe link copied to clipboard (fallback)');
                } catch (clipboardError) {
                    console.error('❌ Failed to share recipe:', clipboardError);
                    this.showError('Failed to share recipe');
                }
            }
        }
    }
    
    static onStateChange(oldState, newState) {
        console.log('🔄 Detail page state change detected');
        
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
        const container = document.getElementById('recipeDetail');
        
        console.log('🔄 Toggle loading state:', isLoading);

        if (isLoading) {
            if (container) {
                container.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Loading recipe...</p>
                    </div>
                `;
                console.log('✅ Loading state displayed');
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
}

// Initialize detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 DOM loaded, initializing RecipeDetailPage...');
    RecipeDetailPage.init();
});