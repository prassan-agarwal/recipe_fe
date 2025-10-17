// Utility Helper Functions
class Helpers {
    // DOM manipulation helpers
    static createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }
    
    static showElement(element) {
        if (element) element.classList.remove('hidden');
    }
    
    static hideElement(element) {
        if (element) element.classList.add('hidden');
    }
    
    static toggleElement(element) {
        if (element) element.classList.toggle('hidden');
    }
    
    // String manipulation helpers
    static capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    static capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
    
    static truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    static sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
    
    // Number formatting helpers
    static formatNumber(num, decimals = 0) {
        if (isNaN(num)) return '0';
        return Number(num).toFixed(decimals);
    }
    
    static formatDecimal(num, decimals = 2) {
        if (isNaN(num)) return '0.00';
        return Number(num).toFixed(decimals);
    }
    
    static roundToNearest(num, nearest = 1) {
        if (isNaN(num)) return 0;
        return Math.round(num / nearest) * nearest;
    }
    
    // Date and time helpers
    static formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    static formatTime(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    static formatDateTime(date) {
        if (!date) return '';
        return `${this.formatDate(date)} at ${this.formatTime(date)}`;
    }
    
    static timeAgo(date) {
        if (!date) return '';
        const now = new Date();
        const then = new Date(date);
        const diffInSeconds = Math.floor((now - then) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return this.formatDate(date);
    }
    
    // URL helpers
    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    static setQueryParam(name, value) {
        const urlParams = new URLSearchParams(window.location.search);
        if (value) {
            urlParams.set(name, value);
        } else {
            urlParams.delete(name);
        }
        return urlParams.toString();
    }
    
    static updateURL(params) {
        const newSearch = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) newSearch.set(key, value);
        });
        const newURL = `${window.location.pathname}?${newSearch.toString()}`;
        window.history.replaceState({}, '', newURL);
    }
    
    // Validation helpers
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }
    
    static isNumeric(str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    }
    
    static isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }
    
    // Array helpers
    static unique(array) {
        return [...new Set(array)];
    }
    
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    // Object helpers
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = this.deepClone(obj[key]);
            });
            return clonedObj;
        }
    }
    
    static mergeObjects(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeObjects(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }
    
    // Storage helpers
    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    static getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }
    
    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
    
    // Performance helpers
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Color helpers
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static getContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        // Calculate relative luminance
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    
    // Measurement conversion helpers
    static cupsToMl(cups) {
        return cups * 236.588;
    }
    
    static tbspToMl(tbsp) {
        return tbsp * 14.7868;
    }
    
    static tspToMl(tsp) {
        return tsp * 4.92892;
    }
    
    static ozToG(oz) {
        return oz * 28.3495;
    }
    
    static lbToG(lb) {
        return lb * 453.592;
    }
    
    // Error handling
    static handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // You can add error reporting service integration here
        if (typeof appState !== 'undefined') {
            appState.setError(error.message || 'An unexpected error occurred');
        }
        
        return error;
    }
    
    // Random generation
    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static randomItem(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Browser detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    static supportsLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}