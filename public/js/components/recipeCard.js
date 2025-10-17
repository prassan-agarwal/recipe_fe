// Recipe Card Component
class RecipeCardComponent {
    static render(recipe, options = {}) {
        const {
            showMatchScore = false,
            showFavoriteButton = true,
            compact = false
        } = options;
        
        const isFavorite = userService.isFavorite(recipe._id);
        const matchScore = recipe.matchScore || 0;
        const matchingIngredients = recipe.matchingIngredients || [];
        
        console.log('🎨 Rendering recipe card:', recipe.title, { matchScore, isFavorite });

        return `
            <div class="recipe-card" data-recipe-id="${recipe._id}">
                ${recipe.imageUrl ? `
                    <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-card-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEYwRjAiLz48cGF0aCBkPSJNMTUwIDgwQzEzNC4zMzYgODAgMTIwIDk0LjMzNiAxMjAgMTEwQzEyMCAxMjUuNjY0IDEzNC4zMzYgMTQwIDE1MCAxNDBDMTY1LjY2NCAxNDAgMTgwIDEyNS42NjQgMTgwIDExMEMxODAgOTQuMzM2IDE2NS42NjQgODAgMTUwIDgwWk0xMjAgMTYwSDE4MFYxNzBIMTIwVjE2MFoiIGZpbGw9IiNDQ0NDQ0MiLz48L3N2Zz4='">
                ` : `
                    <div class="recipe-card-image placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                        </svg>
                    </div>
                `}
                
                <div class="recipe-card-content">
                    <div class="recipe-card-header">
                        <h3 class="recipe-card-title">${recipe.title}</h3>
                        ${showFavoriteButton ? `
                            <button class="recipe-favorite ${isFavorite ? 'active' : ''}" 
                                    onclick="RecipeCardComponent.toggleFavorite('${recipe._id}', event)"
                                    title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="recipe-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            ${recipeService.formatCookingTime(recipe.cookingTime)}
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                            ${recipe.difficulty}
                        </span>
                        ${recipe.cuisine ? `
                            <span class="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                ${recipe.cuisine}
                            </span>
                        ` : ''}
                    </div>
                    
                    ${!compact && recipe.description ? `
                        <p class="recipe-description">${recipe.description}</p>
                    ` : ''}
                    
                    ${showMatchScore && matchScore > 0 ? `
                        <div class="recipe-match">
                            ${matchScore}% Match
                        </div>
                    ` : ''}
                    
                    ${!compact && recipe.dietaryTags && recipe.dietaryTags.length > 0 ? `
                        <div class="recipe-tags">
                            ${recipe.dietaryTags.map(tag => `
                                <span class="recipe-tag">${tag}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${matchingIngredients.length > 0 ? `
                        <div class="matching-ingredients">
                            <small>Matching: ${matchingIngredients.slice(0, 3).join(', ')}${matchingIngredients.length > 3 ? '...' : ''}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    static renderGrid(recipes, containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.log('❌ Recipe grid container not found:', containerId);
            return;
        }
        
        console.log('📦 Rendering recipe grid:', { containerId, recipesCount: recipes?.length });

        if (!recipes || recipes.length === 0) {
            console.log('⚠️ No recipes to render in grid');
            container.innerHTML = `
                <div class="no-results">
                    <p>No recipes found</p>
                </div>
            `;
            return;
        }

        const cardsHTML = recipes.map(recipe => 
            this.render(recipe, options)
        ).join('');
        
        container.innerHTML = cardsHTML;
        
        console.log('✅ Recipe grid rendered successfully');

        // Add click handlers to recipe cards
        this.bindRecipeCardEvents(container);
    }
    
    static bindRecipeCardEvents(container) {
        const recipeCards = container.querySelectorAll('.recipe-card');
        
        console.log('🔗 Binding events to recipe cards:', recipeCards.length);

        recipeCards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Don't trigger if clicking on favorite button or link
                if (event.target.closest('.recipe-favorite') || 
                    event.target.tagName === 'A') {
                    return;
                }
                
                const recipeId = card.dataset.recipeId;
                console.log('👆 Recipe card clicked:', recipeId);
                this.viewRecipe(recipeId);
            });
        });
    }
    
    static async toggleFavorite(recipeId, event) {
        if (event) {
            event.stopPropagation();
        }
        
        console.log('❤️ Toggling favorite for recipe:', recipeId);

        try {
            await userService.toggleFavorite({ _id: recipeId });
            
            // Update the favorite button state
            const favoriteBtn = document.querySelector(`[data-recipe-id="${recipeId}"] .recipe-favorite`);
            if (favoriteBtn) {
                const isFavorite = userService.isFavorite(recipeId);
                favoriteBtn.classList.toggle('active', isFavorite);
                favoriteBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
                
                // Update SVG fill
                const svg = favoriteBtn.querySelector('svg');
                if (svg) {
                    svg.setAttribute('fill', isFavorite ? 'currentColor' : 'none');
                }
            }
        } catch (error) {
            console.error('❌ Failed to toggle favorite:', error);
        }
    }
    
    static viewRecipe(recipeId) {
        console.log('🔍 Viewing recipe:', recipeId);
        // Navigate to recipe detail page
        window.location.href = `recipe-detail.html?id=${recipeId}`;
    }
    
    static createPlaceholder(count = 1) {
        console.log('🔄 Creating placeholder cards:', count);
        
        const placeholders = [];
        
        for (let i = 0; i < count; i++) {
            placeholders.push(`
                <div class="recipe-card placeholder">
                    <div class="recipe-card-image placeholder"></div>
                    <div class="recipe-card-content">
                        <div class="recipe-card-header">
                            <div class="placeholder-line" style="width: 80%"></div>
                            <div class="recipe-favorite"></div>
                        </div>
                        <div class="recipe-meta">
                            <div class="placeholder-line" style="width: 60%"></div>
                        </div>
                        <div class="placeholder-line" style="width: 90%"></div>
                        <div class="placeholder-line" style="width: 70%"></div>
                    </div>
                </div>
            `);
        }
        
        return placeholders.join('');
    }
}

// Add placeholder styles
const placeholderStyles = `
<style>
.recipe-card.placeholder .recipe-card-image.placeholder {
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
}

.placeholder-line {
    height: 12px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.matching-ingredients {
    margin-top: 8px;
    font-size: 0.875rem;
    color: #666;
}
</style>
`;

// Inject placeholder styles
document.head.insertAdjacentHTML('beforeend', placeholderStyles);