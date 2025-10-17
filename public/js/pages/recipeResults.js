// Recipe Results Page Controller
class RecipeResultsPage {
    static init() {
        this.currentRecipes = [];
        this.filteredRecipes = [];
        
        console.log('🔍 RecipeResultsPage initializing...');
        
        this.bindEvents();
        this.loadResults();
        this.setupFilters();
        
        // Listen for state changes
        appState.addListener(this.onStateChange.bind(this));
        
        console.log('✅ RecipeResultsPage initialized successfully');
    }
    
    static bindEvents() {
        console.log('🔗 Binding results page events...');
        
        // Initialize filters component
        FiltersComponent.init();
        
        // Listen for filter changes
        document.addEventListener('filtersChanged', this.handleFiltersChange.bind(this));
        
        // Bind sort controls
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSortChange.bind(this));
            console.log('✅ Sort control bound');
        } else {
            console.log('❌ Sort control not found');
        }
        
        // Bind recipe card events
        this.bindRecipeCardEvents();
        
        console.log('✅ Results page events bound');
    }
    
    static setupFilters() {
        console.log('⚙️ Setting up filters...');
        
        // Set initial filters from app state
        const currentFilters = appState.getFilters();
        FiltersComponent.setFilters(currentFilters);
        
        console.log('✅ Filters setup completed');
    }
    
    static async loadResults() {
        const state = appState.getState();
        const searchResults = state.searchResults;
        const searchIngredients = state.searchIngredients;
        
        console.log('📥 Loading results from state:', {
            searchResultsCount: searchResults?.length,
            searchIngredients: searchIngredients,
            state: state
        });

        if (!searchResults || searchResults.length === 0) {
            console.log('❌ No search results found in state');
            this.showNoResults();
            return;
        }

        this.currentRecipes = searchResults;
        console.log('✅ Current recipes set:', this.currentRecipes.length);
        
        this.displayResults();
        
        // Update results count
        this.updateResultsCount(searchResults.length, searchIngredients);
    }
    
    static displayResults() {
        const recipesGrid = document.getElementById('recipesGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');
        
        console.log('🎨 Displaying results...');
        console.log('   Recipes Grid Element:', recipesGrid);
        console.log('   Current Recipes:', this.currentRecipes?.length);
        console.log('   Loading Spinner:', loadingSpinner);
        console.log('   No Results:', noResults);

        if (!recipesGrid) {
            console.log('❌ recipesGrid element not found!');
            return;
        }
        
        // Apply filters
        this.filteredRecipes = FiltersComponent.applyFiltersToRecipes(this.currentRecipes);
        
        console.log('   After filtering:', this.filteredRecipes.length);

        if (this.filteredRecipes.length === 0) {
            console.log('⚠️ No recipes after filtering');
            this.showNoResults('No recipes match your current filters.');
            return;
        }

        // Hide loading and no results states
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
            console.log('✅ Loading spinner hidden');
        }
        if (noResults) {
            noResults.classList.add('hidden');
            console.log('✅ No results message hidden');
        }
        
        console.log('✅ Rendering recipe cards...');

        // Render recipe cards
        RecipeCardComponent.renderGrid(this.filteredRecipes, 'recipesGrid', {
            showMatchScore: true,
            showFavoriteButton: true
        });
        
        // Update results count
        this.updateDisplayedCount();
        
        console.log('✅ Recipe cards rendered successfully');
    }
    
    static showNoResults(message = 'No recipes found matching your ingredients.') {
        const recipesGrid = document.getElementById('recipesGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');
        
        console.log('🚫 Showing no results:', message);

        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        if (recipesGrid) recipesGrid.innerHTML = '';
        
        if (noResults) {
            noResults.classList.remove('hidden');
            noResults.innerHTML = `
                <h3>No Recipes Found</h3>
                <p>${message}</p>
                <div class="suggestions">
                    <p>Try these suggestions:</p>
                    <ul>
                        <li>Check for typos in your ingredients</li>
                        <li>Use more common ingredient names</li>
                        <li>Try fewer ingredients for broader results</li>
                        <li>Clear some filters</li>
                    </ul>
                    <button class="btn btn-primary" onclick="window.location.href='index.html'">Search Again</button>
                </div>
            `;
            console.log('✅ No results message displayed');
        }
    }
    
    static updateResultsCount(totalCount, ingredients = []) {
        const resultsCount = document.getElementById('resultsCount');
        if (!resultsCount) {
            console.log('❌ Results count element not found');
            return;
        }

        const ingredientsText = ingredients.length > 0 
            ? ` for: ${ingredients.slice(0, 5).join(', ')}${ingredients.length > 5 ? '...' : ''}`
            : '';
        
        resultsCount.textContent = `Found ${totalCount} recipe${totalCount !== 1 ? 's' : ''}${ingredientsText}`;
        
        console.log('📊 Results count updated:', resultsCount.textContent);
    }
    
    static updateDisplayedCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (!resultsCount) return;
        
        const totalCount = this.currentRecipes.length;
        const filteredCount = this.filteredRecipes.length;
        
        if (filteredCount === totalCount) {
            resultsCount.textContent = `Showing all ${totalCount} recipes`;
        } else {
            resultsCount.textContent = `Showing ${filteredCount} of ${totalCount} recipes`;
        }
        
        console.log('📈 Display count updated:', resultsCount.textContent);
    }
    
    static handleFiltersChange(event) {
        console.log('🔄 Filters changed, updating results...');
        this.displayResults();
    }
    
    static handleSortChange(event) {
        const sortBy = event.target.value;
        
        console.log('📈 Sort changed to:', sortBy);

        // Update filters
        FiltersComponent.setFilters({ sortBy });

        // Re-apply sorting
        this.displayResults();
    }
    
    static bindRecipeCardEvents() {
        console.log('🔗 Binding recipe card events...');
        // This will be handled by the RecipeCardComponent
        // Additional custom events can be added here if needed
    }
    
    static onStateChange(oldState, newState) {
        console.log('🔄 Results page state change detected');
        
        // Reload results if search results changed
        if (newState.searchResults !== oldState.searchResults) {
            console.log('🔄 Search results changed, reloading...');
            this.loadResults();
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
        const loadingSpinner = document.getElementById('loadingSpinner');
        const recipesGrid = document.getElementById('recipesGrid');
        
        console.log('🔄 Toggle loading state:', isLoading);

        if (isLoading) {
            if (loadingSpinner) {
                loadingSpinner.classList.remove('hidden');
                console.log('✅ Loading spinner shown');
            }
            if (recipesGrid) {
                recipesGrid.innerHTML = RecipeCardComponent.createPlaceholder(8);
                console.log('✅ Placeholder cards shown');
            }
        } else {
            if (loadingSpinner) {
                loadingSpinner.classList.add('hidden');
                console.log('✅ Loading spinner hidden');
            }
        }
    }
    
    static showError(message) {
        console.log('🚨 Showing error:', message);
        // Use the toast system from HomePage
        if (typeof HomePage !== 'undefined') {
            HomePage.showError(message);
        } else {
            console.error('Error:', message);
            alert(message); // Fallback
        }
    }
    
    static showSuccess(message) {
        console.log('🎉 Showing success:', message);
        // Use the toast system from HomePage
        if (typeof HomePage !== 'undefined') {
            HomePage.showSuccess(message);
        }
    }
    
    // Method to export results (for future features)
    static exportResults() {
        const recipes = this.filteredRecipes.length > 0 ? this.filteredRecipes : this.currentRecipes;
        
        console.log('📤 Exporting results:', recipes.length);

        if (recipes.length === 0) {
            this.showError('No recipes to export');
            return;
        }

        const exportData = {
            searchDate: new Date().toISOString(),
            recipeCount: recipes.length,
            recipes: recipes.map(recipe => ({
                title: recipe.title,
                cookingTime: recipe.cookingTime,
                difficulty: recipe.difficulty,
                matchScore: recipe.matchScore,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions
            }))
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recipe-results-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('✅ Results exported successfully');
    }
    
    // Method to print results (for future features)
    static printResults() {
        console.log('🖨️ Printing results...');
        window.print();
    }
}

// Initialize results page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM loaded, initializing RecipeResultsPage...');
    RecipeResultsPage.init();
});