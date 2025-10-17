// API Service - Handles all HTTP requests
class ApiService {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }
    
    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            },
            ...options
        };
        
        console.log('🌐 API Request:', { endpoint, method: config.method || 'GET' });
        
        // Add auth token if available
        const token = appState.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    // Handle response
    async handleResponse(response) {
        const data = await response.json();
        
        console.log('📨 API Response:', {
            status: response.status,
            endpoint: response.url,
            data: data
        });
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'An error occurred',
                data: data
            };
        }
        
        return data;
    }
    
    // Handle errors
    handleError(error) {
        console.error('❌ API Error:', error);
        
        if (error.status === 401) {
            // Unauthorized - clear user data
            appState.logout();
        }
        
        return {
            status: error.status || 0,
            message: error.message || 'Network error',
            data: error.data || null
        };
    }
    
    // HTTP methods
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }
    
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // File upload
    async uploadFile(endpoint, file, data = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Append additional data
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        
        return this.request(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${appState.getState().token}`
            },
            body: formData
        });
    }
    
    // Specific API methods
    async searchRecipes(ingredients, filters = {}) {
        console.log('🔍 Searching recipes with:', { ingredients, filters });
        return this.post('/recipes/search', {
            ingredients,
            filters
        });
    }
    
    async getRecipe(id) {
        return this.get(`/recipes/${id}`);
    }
    
    async getRecipes(params = {}) {
        return this.get('/recipes', params);
    }
    
    async getFilterOptions() {
        return this.get('/recipes/meta/filters');
    }
    
    async analyzeImage(imageData) {
        return this.post('/vision/analyze', { image: imageData });
    }
    
    async validateIngredients(ingredients) {
        return this.post('/vision/validate', { ingredients });
    }
    
    async register(userData) {
        return this.post('/users/register', userData);
    }
    
    async login(credentials) {
        return this.post('/users/login', credentials);
    }
    
    async getProfile() {
        return this.get('/users/profile');
    }
    
    async getFavorites() {
        return this.get('/favorites');
    }
    
    async addFavorite(recipeId) {
        return this.post(`/favorites/${recipeId}`);
    }
    
    async removeFavorite(recipeId) {
        return this.delete(`/favorites/${recipeId}`);
    }
}

// Create global API service instance
const apiService = new ApiService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
}