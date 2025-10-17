// Search Form Component
class SearchFormComponent {
    static init() {
        this.bindEvents();
        console.log('🔍 SearchFormComponent initialized');
    }
    
    static bindEvents() {
        // Text form submission
        const textForm = document.getElementById('textForm');
        if (textForm) {
            textForm.addEventListener('submit', this.handleTextSubmit.bind(this));
            console.log('✅ Text form event bound');
        } else {
            console.log('❌ Text form not found');
        }
        
        // Real-time ingredient validation
        const ingredientsTextarea = document.getElementById('ingredients');
        if (ingredientsTextarea) {
            ingredientsTextarea.addEventListener('input', this.debounce(this.validateIngredients.bind(this), 500));
            console.log('✅ Ingredients textarea event bound');
        }
        
        // Find recipes from image button
        const findRecipesBtn = document.getElementById('findRecipesFromImage');
        if (findRecipesBtn) {
            findRecipesBtn.addEventListener('click', this.handleImageResultsSubmit.bind(this));
            console.log('✅ Image results button event bound');
        }
        
        console.log('🔗 All search form events bound successfully');
    }
    
    static handleTextSubmit(event) {
        event.preventDefault();
        
        console.log('📝 Text form submitted');
        
        const ingredientsTextarea = document.getElementById('ingredients');
        if (!ingredientsTextarea) {
            console.log('❌ Ingredients textarea not found');
            return;
        }

        const ingredientsText = ingredientsTextarea.value.trim();
        console.log('📋 Ingredients text:', ingredientsText);
        
        if (!ingredientsText) {
            appState.setError('Please enter at least one ingredient');
            return;
        }

        const ingredients = recipeService.parseIngredients(ingredientsText);
        console.log('🧪 Parsed ingredients:', ingredients);

        if (ingredients.length < AppConfig.SETTINGS.MIN_INGREDIENTS_FOR_SEARCH) {
            appState.setError(`Please enter at least ${AppConfig.SETTINGS.MIN_INGREDIENTS_FOR_SEARCH} ingredient`);
            return;
        }

        console.log('🚀 Starting search with ingredients:', ingredients);
        this.searchWithIngredients(ingredients);
    }
    
    static handleImageResultsSubmit() {
        console.log('🖼️ Image results form submitted');
        
        const ingredientsList = document.getElementById('ingredientsList');
        if (!ingredientsList) {
            console.log('❌ Ingredients list not found');
            return;
        }

        const ingredientTags = ingredientsList.querySelectorAll('.ingredient-tag');
        const ingredients = Array.from(ingredientTags).map(tag => tag.textContent.trim());
        
        console.log('📸 Detected ingredients from image:', ingredients);

        if (ingredients.length === 0) {
            appState.setError('No ingredients detected from image');
            return;
        }

        this.searchWithIngredients(ingredients);
    }
    
    static async searchWithIngredients(ingredients) {
        try {
            console.log('🎯 Starting search with ingredients:', ingredients);
            appState.setLoading(true);
            
            // Save to search history
            userService.addToSearchHistory(ingredients.join(', '));

            // Perform search
            const results = await recipeService.searchByIngredients(ingredients);
            
            console.log('✅ Search completed, results:', results?.length);
            console.log('📊 First result:', results[0]);

            // Navigate to results page
            console.log('🧭 Navigating to results page...');
            window.location.href = 'recipe-results.html';
            
        } catch (error) {
            console.error('❌ Search failed:', error);
            // Error is handled by the service
        } finally {
            appState.setLoading(false);
        }
    }
    
    static validateIngredients(event) {
        const textarea = event.target;
        const value = textarea.value.trim();
        
        console.log('📝 Validating ingredients:', value);

        if (!value) {
            this.clearValidation();
            return;
        }

        const ingredients = recipeService.parseIngredients(value);
        const validCount = ingredients.length;
        
        console.log('✅ Valid ingredients count:', validCount);

        if (validCount === 0) {
            this.showValidation('Please enter valid ingredients separated by commas', 'error');
        } else if (validCount < AppConfig.SETTINGS.MIN_INGREDIENTS_FOR_SEARCH) {
            this.showValidation(`Enter ${AppConfig.SETTINGS.MIN_INGREDIENTS_FOR_SEARCH - validCount} more ingredient(s)`, 'warning');
        } else {
            this.showValidation(`${validCount} ingredients ready for search!`, 'success');
        }
    }
    
    static showValidation(message, type) {
        // Remove existing validation message
        this.clearValidation();
        
        const textarea = document.getElementById('ingredients');
        if (!textarea) return;

        // Create validation element
        const validationEl = document.createElement('div');
        validationEl.className = `form-${type}`;
        validationEl.textContent = message;
        validationEl.style.marginTop = '8px';
        validationEl.style.fontSize = '14px';

        // Style based on type
        if (type === 'error') {
            validationEl.style.color = '#e74c3c';
        } else if (type === 'warning') {
            validationEl.style.color = '#f39c12';
        } else if (type === 'success') {
            validationEl.style.color = '#27ae60';
        }

        textarea.parentNode.appendChild(validationEl);
        
        // Update textarea border
        textarea.classList.remove('error', 'warning', 'success');
        textarea.classList.add(type);
        
        console.log('📝 Validation message:', { type, message });
    }
    
    static clearValidation() {
        const textarea = document.getElementById('ingredients');
        if (!textarea) return;

        // Remove validation message
        const existingValidation = textarea.parentNode.querySelector('.form-error, .form-warning, .form-success');
        if (existingValidation) {
            existingValidation.remove();
        }

        // Clear textarea classes
        textarea.classList.remove('error', 'warning', 'success');
    }
    
    static displayDetectedIngredients(ingredients) {
        const container = document.getElementById('ingredientsList');
        const detectedSection = document.getElementById('detectedIngredients');
        
        if (!container || !detectedSection) {
            console.log('❌ Detected ingredients container not found');
            return;
        }

        console.log('🖼️ Displaying detected ingredients:', ingredients);

        if (ingredients.length === 0) {
            container.innerHTML = '<p>No ingredients detected. Please try another image.</p>';
        } else {
            container.innerHTML = ingredients.map(ingredient => `
                <span class="ingredient-tag">${ingredient}</span>
            `).join('');
        }

        detectedSection.classList.remove('hidden');
        
        console.log('✅ Detected ingredients displayed');

        // Scroll to detected ingredients
        detectedSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    static clearDetectedIngredients() {
        const detectedSection = document.getElementById('detectedIngredients');
        const ingredientsList = document.getElementById('ingredientsList');
        
        if (detectedSection) {
            detectedSection.classList.add('hidden');
        }
        if (ingredientsList) {
            ingredientsList.innerHTML = '';
        }
        
        console.log('🧹 Cleared detected ingredients');
    }
    
    // Utility method for debouncing
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Method to populate form with ingredients (for testing or pre-filling)
    static populateForm(ingredients) {
        const textarea = document.getElementById('ingredients');
        if (textarea && Array.isArray(ingredients)) {
            textarea.value = ingredients.join(', ');
            this.validateIngredients({ target: textarea });
            console.log('📝 Form populated with ingredients:', ingredients);
        }
    }
    
    // Method to get current ingredients from form
    static getCurrentIngredients() {
        const textarea = document.getElementById('ingredients');
        if (textarea) {
            return recipeService.parseIngredients(textarea.value);
        }
        return [];
    }
}