// Client-side Router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }
    
    init() {
        // Set up route change detection
        window.addEventListener('popstate', (event) => {
            this.handleRouteChange();
        });
        
        // Handle initial route
        this.handleRouteChange();
        
        // Intercept all link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                event.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }
    
    // Add route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    
    // Navigate to route
    navigate(path, data = {}) {
        const fullPath = path + this.objectToQueryString(data);
        history.pushState(data, '', fullPath);
        this.handleRouteChange();
    }
    
    // Replace current route
    replace(path, data = {}) {
        const fullPath = path + this.objectToQueryString(data);
        history.replaceState(data, '', fullPath);
        this.handleRouteChange();
    }
    
    // Handle route change
    handleRouteChange() {
        const path = window.location.pathname;
        const queryParams = this.getQueryParams();
        
        console.log('🔄 Route changed:', { path, queryParams });
        
        // Find matching route
        let matchedRoute = null;
        let routeParams = {};
        
        for (const route in this.routes) {
            const pattern = this.routeToPattern(route);
            const match = path.match(pattern);
            
            if (match) {
                matchedRoute = route;
                routeParams = this.extractRouteParams(route, match);
                break;
            }
        }
        
        if (matchedRoute && this.routes[matchedRoute]) {
            this.currentRoute = {
                path: matchedRoute,
                fullPath: path,
                params: routeParams,
                query: queryParams
            };
            
            console.log('✅ Route matched:', this.currentRoute);
            this.routes[matchedRoute](this.currentRoute);
        } else {
            // Default to home if no route matches
            console.log('❌ No route matched, defaulting to home');
            this.navigate('/');
        }
    }
    
    // Utility methods
    isInternalLink(href) {
        return href.startsWith(window.location.origin) || href.startsWith('/');
    }
    
    getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    }
    
    objectToQueryString(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj[key] !== undefined && obj[key] !== null) {
                params.append(key, obj[key]);
            }
        }
        const queryString = params.toString();
        return queryString ? '?' + queryString : '';
    }
    
    routeToPattern(route) {
        return new RegExp('^' + route.replace(/:\w+/g, '([^/]+)') + '$');
    }
    
    extractRouteParams(route, match) {
        const params = {};
        const paramNames = [];
        const routeParts = route.split('/');
        
        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                paramNames.push(part.slice(1));
            }
        });
        
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });
        
        return params;
    }
    
    // Get current route info
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    // Go back in history
    back() {
        window.history.back();
    }
    
    // Go forward in history
    forward() {
        window.history.forward();
    }
}

// Create global router instance
const router = new Router();

// Define application routes
router.addRoute('/', (route) => {
    appState.setState({ currentPage: 'home' });
});

router.addRoute('/recipe-results.html', (route) => {
    appState.setState({ currentPage: 'results' });
});

router.addRoute('/recipe-detail.html', (route) => {
    appState.setState({ 
        currentPage: 'detail',
        currentRecipe: route.query.id ? { _id: route.query.id } : null
    });
});

router.addRoute('/favorites.html', (route) => {
    appState.setState({ currentPage: 'favorites' });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = router;
}