// Header Component
class HeaderComponent {
    static init() {
        this.render();
        this.bindEvents();
        
        // Update header when state changes
        appState.addListener(this.onStateChange.bind(this));
    }
    
    static render() {
        const header = document.getElementById('header');
        if (!header) {
            console.log('❌ Header element not found');
            return;
        }

        const state = appState.getState();
        const isAuthenticated = state.isAuthenticated;
        const user = state.user;
        
        console.log('👤 Rendering header:', { isAuthenticated, user: user?.username });

        header.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <a href="index.html" class="logo">
                        <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                        </svg>
                        Smart Recipes
                    </a>
                    
                    <nav class="nav-links">
                        <a href="index.html" class="nav-link ${state.currentPage === 'home' ? 'active' : ''}">Home</a>
                        <a href="favorites.html" class="nav-link ${state.currentPage === 'favorites' ? 'active' : ''}">Favorites</a>
                    </nav>
                    
                    <div class="user-menu">
                        ${isAuthenticated && user ? `
                            <span class="user-greeting">Hello, ${user.username}</span>
                            <button class="btn-logout" onclick="HeaderComponent.handleLogout()">Logout</button>
                        ` : `
                            <div class="auth-buttons">
                                <button class="btn btn-outline btn-sm" onclick="HeaderComponent.showLoginModal()">Login</button>
                                <button class="btn btn-primary btn-sm" onclick="HeaderComponent.showRegisterModal()">Sign Up</button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- Auth Modals -->
            ${this.renderAuthModals()}
        `;
        
        this.bindModalEvents();
    }
    
    static renderAuthModals() {
        return `
            <!-- Login Modal -->
            <div class="modal hidden" id="loginModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Login to Your Account</h3>
                        <button class="modal-close" onclick="HeaderComponent.hideLoginModal()">&times;</button>
                    </div>
                    <form class="auth-form" onsubmit="HeaderComponent.handleLogin(event)">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg">Login</button>
                    </form>
                    <p class="auth-switch">
                        Don't have an account? 
                        <a href="#" onclick="HeaderComponent.showRegisterModal()">Sign up</a>
                    </p>
                </div>
            </div>
            
            <!-- Register Modal -->
            <div class="modal hidden" id="registerModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create Your Account</h3>
                        <button class="modal-close" onclick="HeaderComponent.hideRegisterModal()">&times;</button>
                    </div>
                    <form class="auth-form" onsubmit="HeaderComponent.handleRegister(event)">
                        <div class="form-group">
                            <label for="registerUsername">Username</label>
                            <input type="text" id="registerUsername" required minlength="3">
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <input type="password" id="registerPassword" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label>Dietary Preferences (optional)</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="dietary" value="vegetarian"> Vegetarian
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="dietary" value="vegan"> Vegan
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="dietary" value="gluten-free"> Gluten-free
                                </label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg">Create Account</button>
                    </form>
                    <p class="auth-switch">
                        Already have an account? 
                        <a href="#" onclick="HeaderComponent.showLoginModal()">Login</a>
                    </p>
                </div>
            </div>
        `;
    }
    
    static bindEvents() {
        console.log('🔗 Binding header events');
    }
    
    static bindModalEvents() {
        // Close modals when clicking outside
        document.addEventListener('click', (event) => {
            const loginModal = document.getElementById('loginModal');
            const registerModal = document.getElementById('registerModal');
            
            if (event.target === loginModal) {
                this.hideLoginModal();
            }
            if (event.target === registerModal) {
                this.hideRegisterModal();
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hideLoginModal();
                this.hideRegisterModal();
            }
        });
    }
    
    static onStateChange(oldState, newState) {
        if (oldState.isAuthenticated !== newState.isAuthenticated || 
            oldState.user !== newState.user ||
            oldState.currentPage !== newState.currentPage) {
            console.log('🔄 Header state changed, re-rendering');
            this.render();
        }
    }
    
    // Modal methods
    static showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('loginEmail')?.focus();
        }
    }
    
    static hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    static showRegisterModal() {
        this.hideLoginModal();
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('registerUsername')?.focus();
        }
    }
    
    static hideRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    // Auth handlers
    static async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        console.log('🔐 Attempting login:', email);

        try {
            await userService.login({ email, password });
            this.hideLoginModal();
        } catch (error) {
            // Error is handled by the service
        }
    }
    
    static async handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        console.log('👤 Attempting registration:', username, email);

        // Get dietary preferences
        const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]:checked');
        const dietaryPreferences = Array.from(dietaryCheckboxes).map(cb => cb.value);

        try {
            await userService.register({
                username,
                email,
                password,
                dietaryPreferences
            });
            this.hideRegisterModal();
        } catch (error) {
            // Error is handled by the service
        }
    }
    
    static handleLogout() {
        console.log('👋 User requested logout');
        userService.logout();
    }
}

// Add modal styles to the page
const modalStyles = `
<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.auth-form .form-group {
    margin-bottom: 1rem;
}

.auth-switch {
    text-align: center;
    margin-top: 1rem;
    color: #666;
}

.auth-switch a {
    color: #e74c3c;
    text-decoration: none;
}

.auth-switch a:hover {
    text-decoration: underline;
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);