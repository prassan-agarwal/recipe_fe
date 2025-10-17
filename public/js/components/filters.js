// Filters Component
class FiltersComponent {
    static init(containerId = 'filtersSidebar') {
        this.container = document.getElementById(containerId);
        this.filters = {
            cuisine: '',
            difficulty: '',
            dietary: '',
            time: '',
            sortBy: 'match'
        };
        
        this.filterOptions = {
            cuisines: [],
            difficulties: ['Easy', 'Medium', 'Hard'],
            dietaryTags: [],
            timeOptions: [
                { value: '30', label: '30 minutes or less' },
                { value: '45', label: '45 minutes or less' },
                { value: '60', label: '1 hour or less' },
                { value: '90', label: '1.5 hours or less' },
                { value: '120', label: '2 hours or less' }
            ]
        };
        
        console.log('🔍 FiltersComponent initializing...');
        console.log('📦 Container:', this.container);
        console.log('⚙️ Initial filters:', this.filters);

        this.bindEvents();
        this.loadFilterOptions();
    }
    
    static async loadFilterOptions() {
        try {
            console.log('📡 Loading filter options...');
            const options = await recipeService.getFilterOptions();
            
            this.filterOptions.cuisines = options.cuisines || [];
            this.filterOptions.dietaryTags = options.dietaryTags || [];
            
            console.log('✅ Filter options loaded:', {
                cuisines: this.filterOptions.cuisines.length,
                dietaryTags: this.filterOptions.dietaryTags.length
            });

            this.render();
        } catch (error) {
            console.error('❌ Failed to load filter options:', error);
        }
    }
    
    static render() {
        if (!this.container) {
            console.log('❌ Filters container not found');
            return;
        }

        console.log('🎨 Rendering filters...');

        this.container.innerHTML = `
            <div class="filters-header">
                <h3>Filters</h3>
                <button class="btn-clear" id="clearFilters">Clear All</button>
            </div>
            
            <div class="filter-group">
                <label for="cuisineFilter">Cuisine</label>
                <select id="cuisineFilter">
                    <option value="">All Cuisines</option>
                    ${this.filterOptions.cuisines.map(cuisine => `
                        <option value="${cuisine}" ${this.filters.cuisine === cuisine ? 'selected' : ''}>
                            ${cuisine}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="difficultyFilter">Difficulty</label>
                <select id="difficultyFilter">
                    <option value="">Any Difficulty</option>
                    ${this.filterOptions.difficulties.map(diff => `
                        <option value="${diff}" ${this.filters.difficulty === diff ? 'selected' : ''}>
                            ${diff}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="dietaryFilter">Dietary</label>
                <select id="dietaryFilter">
                    <option value="">Any Dietary</option>
                    ${this.filterOptions.dietaryTags.map(tag => `
                        <option value="${tag}" ${this.filters.dietary === tag ? 'selected' : ''}>
                            ${tag}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div class="filter-group">
                <label for="timeFilter">Max Cooking Time</label>
                <select id="timeFilter">
                    <option value="">Any Time</option>
                    ${this.filterOptions.timeOptions.map(option => `
                        <option value="${option.value}" ${this.filters.time === option.value ? 'selected' : ''}>
                            ${option.label}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <button class="btn btn-primary" id="applyFilters">Apply Filters</button>
            
            ${this.renderActiveFilters()}
        `;
        
        this.bindFilterEvents();
        console.log('✅ Filters rendered successfully');
    }
    
    static renderActiveFilters() {
        const activeFilters = this.getActiveFilters();
        
        console.log('🏷️ Active filters:', activeFilters);

        if (activeFilters.length === 0) {
            return '';
        }
        
        return `
            <div class="active-filters">
                <h4>Active Filters:</h4>
                ${activeFilters.map(filter => `
                    <span class="filter-chip">
                        ${filter.label}: ${filter.value}
                        <button class="filter-chip-remove" data-filter="${filter.key}">&times;</button>
                    </span>
                `).join('')}
            </div>
        `;
    }
    
    static bindEvents() {
        // Clear filters button
        document.addEventListener('click', (event) => {
            if (event.target.id === 'clearFilters') {
                console.log('🧹 Clearing all filters');
                this.clearFilters();
            }
        });
        
        // Sort controls
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (event) => {
                this.filters.sortBy = event.target.value;
                console.log('🔄 Sort changed to:', this.filters.sortBy);
                this.onFiltersChange();
            });
        }
        
        console.log('🔗 Filter events bound');
    }
    
    static bindFilterEvents() {
        // Apply filters button
        const applyBtn = document.getElementById('applyFilters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                console.log('✅ Apply filters clicked');
                this.updateFiltersFromDOM();
                this.onFiltersChange();
            });
        }
        
        // Filter chip remove buttons
        const removeButtons = this.container?.querySelectorAll('.filter-chip-remove');
        removeButtons?.forEach(button => {
            button.addEventListener('click', (event) => {
                const filterKey = event.target.dataset.filter;
                console.log('❌ Removing filter:', filterKey);
                this.removeFilter(filterKey);
            });
        });
        
        // Enter key in filter inputs
        const filterInputs = this.container?.querySelectorAll('select');
        filterInputs?.forEach(input => {
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    console.log('↵ Enter pressed in filter');
                    this.updateFiltersFromDOM();
                    this.onFiltersChange();
                }
            });
        });
        
        console.log('🔗 Filter element events bound');
    }
    
    static updateFiltersFromDOM() {
        const cuisineFilter = document.getElementById('cuisineFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        const dietaryFilter = document.getElementById('dietaryFilter');
        const timeFilter = document.getElementById('timeFilter');
        
        if (cuisineFilter) this.filters.cuisine = cuisineFilter.value;
        if (difficultyFilter) this.filters.difficulty = difficultyFilter.value;
        if (dietaryFilter) this.filters.dietary = dietaryFilter.value;
        if (timeFilter) this.filters.time = timeFilter.value;
        
        console.log('📝 Filters updated from DOM:', this.filters);
    }
    
    static onFiltersChange() {
        console.log('🔄 Filters changed:', this.filters);

        // Update app state
        appState.setFilters(this.filters);

        // Trigger custom event for other components to listen to
        const event = new CustomEvent('filtersChanged', {
            detail: { filters: this.filters }
        });
        document.dispatchEvent(event);
        
        console.log('📢 Filters changed event dispatched');

        // Re-render active filters
        this.render();
    }
    
    static clearFilters() {
        console.log('🧹 Clearing all filters');
        
        this.filters = {
            cuisine: '',
            difficulty: '',
            dietary: '',
            time: '',
            sortBy: 'match'
        };

        // Update DOM
        const cuisineFilter = document.getElementById('cuisineFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        const dietaryFilter = document.getElementById('dietaryFilter');
        const timeFilter = document.getElementById('timeFilter');
        const sortSelect = document.getElementById('sortBy');

        if (cuisineFilter) cuisineFilter.value = '';
        if (difficultyFilter) difficultyFilter.value = '';
        if (dietaryFilter) dietaryFilter.value = '';
        if (timeFilter) timeFilter.value = '';
        if (sortSelect) sortSelect.value = 'match';

        this.onFiltersChange();
        appState.setSuccess('Filters cleared');
    }
    
    static removeFilter(filterKey) {
        console.log('❌ Removing filter:', filterKey);
        this.filters[filterKey] = '';

        // Update DOM
        const filterElement = document.getElementById(`${filterKey}Filter`);
        if (filterElement) {
            filterElement.value = '';
        }

        this.onFiltersChange();
    }
    
    static getActiveFilters() {
        const activeFilters = [];
        
        if (this.filters.cuisine) {
            activeFilters.push({
                key: 'cuisine',
                label: 'Cuisine',
                value: this.filters.cuisine
            });
        }
        
        if (this.filters.difficulty) {
            activeFilters.push({
                key: 'difficulty',
                label: 'Difficulty',
                value: this.filters.difficulty
            });
        }
        
        if (this.filters.dietary) {
            activeFilters.push({
                key: 'dietary',
                label: 'Dietary',
                value: this.filters.dietary
            });
        }
        
        if (this.filters.time) {
            const timeOption = this.filterOptions.timeOptions.find(opt => opt.value === this.filters.time);
            activeFilters.push({
                key: 'time',
                label: 'Max Time',
                value: timeOption ? timeOption.label : this.filters.time
            });
        }
        
        return activeFilters;
    }
    
    static getCurrentFilters() {
        return { ...this.filters };
    }
    
    static setFilters(newFilters) {
        console.log('⚙️ Setting filters:', newFilters);
        this.filters = { ...this.filters, ...newFilters };
        this.updateDOMFromFilters();
        this.render();
    }
    
    static updateDOMFromFilters() {
        const cuisineFilter = document.getElementById('cuisineFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        const dietaryFilter = document.getElementById('dietaryFilter');
        const timeFilter = document.getElementById('timeFilter');
        const sortSelect = document.getElementById('sortBy');

        if (cuisineFilter) cuisineFilter.value = this.filters.cuisine || '';
        if (difficultyFilter) difficultyFilter.value = this.filters.difficulty || '';
        if (dietaryFilter) dietaryFilter.value = this.filters.dietary || '';
        if (timeFilter) timeFilter.value = this.filters.time || '';
        if (sortSelect) sortSelect.value = this.filters.sortBy || 'match';
        
        console.log('📝 DOM updated with filters');
    }
    
    // Method to apply filters to recipe list
    static applyFiltersToRecipes(recipes) {
        let filteredRecipes = [...recipes];
        
        console.log('🔍 Applying filters to recipes:', {
            totalRecipes: recipes.length,
            filters: this.filters
        });

        // Apply cuisine filter
        if (this.filters.cuisine) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.cuisine === this.filters.cuisine
            );
            console.log('🌍 After cuisine filter:', filteredRecipes.length);
        }
        
        // Apply difficulty filter
        if (this.filters.difficulty) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.difficulty === this.filters.difficulty
            );
            console.log('📊 After difficulty filter:', filteredRecipes.length);
        }
        
        // Apply dietary filter
        if (this.filters.dietary) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.dietaryTags && recipe.dietaryTags.includes(this.filters.dietary)
            );
            console.log('🥗 After dietary filter:', filteredRecipes.length);
        }
        
        // Apply time filter
        if (this.filters.time) {
            const maxTime = parseInt(this.filters.time);
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.cookingTime <= maxTime
            );
            console.log('⏰ After time filter:', filteredRecipes.length);
        }
        
        // Apply sorting
        filteredRecipes = this.sortRecipes(filteredRecipes);
        
        console.log('✅ Final filtered recipes:', filteredRecipes.length);
        return filteredRecipes;
    }
    
    static sortRecipes(recipes) {
        const sortBy = this.filters.sortBy || 'match';
        
        console.log('📈 Sorting recipes by:', sortBy);

        switch (sortBy) {
            case 'time':
                return recipes.sort((a, b) => a.cookingTime - b.cookingTime);
                
            case 'difficulty':
                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return recipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                
            case 'match':
            default:
                return recipes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
    }
}