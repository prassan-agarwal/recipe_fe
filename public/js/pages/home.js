// Home Page Controller
class HomePage {
    static init() {
        console.log('🏠 HomePage initializing...');
        
        this.bindEvents();
        this.loadFeaturedRecipes();
        this.setupTabSwitching();
        
        // Listen for state changes
        appState.addListener(this.onStateChange.bind(this));
        
        console.log('✅ HomePage initialized successfully');
    }
    
    static bindEvents() {
        console.log('🔗 Binding home page events...');
        
        // Initialize search form
        SearchFormComponent.init();
        
        // Initialize image upload
        ImageUploadComponent.init();
        
        // Handle tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', this.handleTabSwitch.bind(this));
        });
        
        console.log('✅ Home page events bound');
    }
    
    static setupTabSwitching() {
        console.log('📑 Setting up tab switching...');
        
        // Set up tab functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('📊 Found tabs:', {
            buttons: tabButtons.length,
            contents: tabContents.length
        });

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                console.log('📑 Switching to tab:', tabName);
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-tab`) {
                        content.classList.add('active');
                    }
                });
                
                console.log('✅ Tab switched to:', tabName);
            });
        });
    }
    
    static handleTabSwitch(event) {
        const button = event.target;
        const tabName = button.dataset.tab;
        
        console.log('📑 Tab switch clicked:', tabName);

        // Update active tab button
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show corresponding tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
        
        // Clear any existing data when switching tabs
        if (tabName === 'text') {
            SearchFormComponent.clearDetectedIngredients();
        }
        
        console.log('✅ Tab switched successfully');
    }
    
    static async loadFeaturedRecipes() {
        const featuredContainer = document.getElementById('featuredRecipes');
        if (!featuredContainer) {
            console.log('❌ Featured recipes container not found');
            return;
        }

        console.log('⭐ Loading featured recipes...');

        // Show loading state
        featuredContainer.innerHTML = RecipeCardComponent.createPlaceholder(6);
        
        try {
            const featuredRecipes = await recipeService.getFeaturedRecipes(6);
            
            console.log('✅ Featured recipes loaded:', featuredRecipes?.length);

            if (featuredRecipes.length > 0) {
                RecipeCardComponent.renderGrid(featuredRecipes, 'featuredRecipes', {
                    showFavoriteButton: true,
                    showMatchScore: false
                });
                console.log('🎨 Featured recipes rendered');
            } else {
                featuredContainer.innerHTML = `
                    <div class="no-results">
                        <p>No featured recipes available at the moment.</p>
                    </div>
                `;
                console.log('⚠️ No featured recipes available');
            }
        } catch (error) {
            console.error('❌ Failed to load featured recipes:', error);
            featuredContainer.innerHTML = `
                <div class="no-results">
                    <p>Failed to load featured recipes.</p>
                    <button class="btn btn-secondary" onclick="HomePage.loadFeaturedRecipes()">Try Again</button>
                </div>
            `;
        }
    }
    
    static onStateChange(oldState, newState) {
        // Update UI based on state changes
        if (newState.error && newState.error !== oldState.error) {
            console.log('❌ State error:', newState.error);
            this.showError(newState.error);
        }
        
        if (newState.success && newState.success !== oldState.success) {
            console.log('✅ State success:', newState.success);
            this.showSuccess(newState.success);
        }
        
        if (newState.isLoading !== oldState.isLoading) {
            console.log('🔄 Loading state:', newState.isLoading);
            this.toggleLoadingState(newState.isLoading);
        }
    }
    
    static showError(message) {
        console.log('🚨 Showing error:', message);
        this.showToast(message, 'error');
    }
    
    static showSuccess(message) {
        console.log('🎉 Showing success:', message);
        this.showToast(message, 'success');
    }
    
    static showToast(message, type = 'info') {
        console.log('🍞 Showing toast:', { type, message });
        
        // Remove existing toasts
        this.removeExistingToasts();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;
        
        const toastClose = toast.querySelector('.toast-close');
        toastClose.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
                console.log('🗑️ Toast auto-removed');
            }
        }, 5000);
        
        console.log('✅ Toast displayed');
    }
    
    static removeExistingToasts() {
        const existingToasts = document.querySelectorAll('.toast');
        console.log('🧹 Removing existing toasts:', existingToasts.length);
        existingToasts.forEach(toast => toast.remove());
    }
    
    static toggleLoadingState(isLoading) {
        console.log('🔄 Toggle loading state:', isLoading);
        // You can add global loading indicators here if needed
        if (isLoading) {
            // Show loading state
            document.body.style.cursor = 'wait';
        } else {
            // Hide loading state
            document.body.style.cursor = 'default';
        }
    }
    
    // Method to handle quick search with common ingredients
    static quickSearch(ingredients) {
        console.log('⚡ Quick search with:', ingredients);
        SearchFormComponent.populateForm(ingredients);
        
        // Switch to text tab
        const textTabButton = document.querySelector('[data-tab="text"]');
        if (textTabButton) {
            textTabButton.click();
        }
    }
    
    // Method to populate with sample data for demo
    static loadDemoData() {
        console.log('🎮 Loading demo data...');
        const sampleIngredients = ['chicken', 'rice', 'tomatoes', 'onion', 'garlic'];
        this.quickSearch(sampleIngredients);
    }
}

// Add toast animation
const toastStyles = `
<style>
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast {
    animation: slideIn 0.3s ease;
}

/* Quick search buttons demo */
.quick-search {
    margin: 20px 0;
    text-align: center;
}

.quick-search-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 10px;
}

.quick-search-btn {
    background: #f8f9fa;
    border: 1px solid #ddd;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.quick-search-btn:hover {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
}
</style>
`;

// Inject toast styles
document.head.insertAdjacentHTML('beforeend', toastStyles);

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 DOM loaded, initializing HomePage...');
    HomePage.init();
});