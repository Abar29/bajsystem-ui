<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - {{ config('app.name', 'BAJ System') }}</title>
    
    @vite(['resources/css/app.css', 'resources/js/auth.ts'])
    
    <script>
        // Toggle password visibility
        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const icon = button.querySelector('svg');
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
                button.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
                button.setAttribute('aria-label', 'Show password');
            }
        }
    </script>
</head>
<body class="auth-page bg-white">
    <!-- Split Screen Container -->
    <div class="auth-split-container-saas">
        <!-- Left Side - Feature Highlights (Hidden on Mobile) -->
        <div class="auth-left-side-saas" style="background: linear-gradient(135deg, rgba(30, 86, 49, 0.95) 0%, rgba(22, 61, 35, 0.95) 50%, rgba(15, 31, 20, 0.95) 100%), url('{{ asset('image/bg.png') }}') center/cover no-repeat;">
            <div class="auth-brand-content-saas">
                <div class="auth-brand-header-saas">
                    <img src="{{ asset('image/bajlogo2.png') }}" alt="BAJ System Logo" class="auth-brand-logo-saas">
                </div>
                
                <div class="auth-brand-tagline">
                    <h2>Streamline Your Business Operations</h2>
                    <p>Comprehensive management solution for inventory, purchasing, and logistics</p>
                </div>
                
                <div class="auth-features-list">
                    <div class="auth-feature-item-saas">
                        <div class="feature-icon-saas">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h3>Inventory</h3>
                            <p>Real-time stock tracking and management</p>
                        </div>
                    </div>
                    <div class="auth-feature-item-saas">
                        <div class="feature-icon-saas">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3>Analytics</h3>
                            <p>Insights and reports at your fingertips</p>
                        </div>
                    </div>
                    <div class="auth-feature-item-saas">
                        <div class="feature-icon-saas">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3>Security</h3>
                            <p>Enterprise-grade protection for your data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Right Side - Login Form -->
        <div class="auth-right-side-saas">
            <main class="auth-form-wrapper-saas">
                <!-- Login Form -->
                <div id="login-form-container" class="auth-form-container">
                    <div class="auth-form-header-saas">
                        <h1 class="auth-title-saas">Welcome Back</h1>
                        <p class="auth-subtitle-saas">Sign in to continue to your account</p>
                    </div>

                    <form id="login-form" class="auth-form-saas">
                        <div class="auth-form-group-saas">
                            <label for="login-username" class="auth-label-saas">Username or Email</label>
                            <div class="input-wrapper-saas">
                                <span class="input-icon-saas" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input 
                                    type="text" 
                                    id="login-username"
                                    name="username" 
                                    class="auth-input-saas" 
                                    placeholder="Enter your username" 
                                    required
                                    autocomplete="username">
                            </div>
                        </div>

                        <div class="auth-form-group-saas">
                            <label for="login-password" class="auth-label-saas">Password</label>
                            <div class="input-wrapper-saas password-wrapper-saas">
                                <span class="input-icon-saas" aria-hidden="true">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    name="password" 
                                    class="auth-input-saas" 
                                    placeholder="Enter your password" 
                                    required
                                    autocomplete="current-password">
                                <button 
                                    type="button" 
                                    class="password-toggle-saas" 
                                    onclick="togglePassword('login-password', this)"
                                    aria-label="Show password">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="auth-form-options-saas">
                            <label class="auth-checkbox-saas">
                                <input type="checkbox" name="remember" id="remember-me">
                                <span class="checkbox-label-saas">Remember me</span>
                            </label>
                            <a href="#" class="auth-link-saas" id="forgot-password-link">Forgot password?</a>
                        </div>

                        <button type="submit" class="auth-btn-primary-saas">
                            <span>Sign In</span>
                            <span class="btn-arrow-saas">→</span>
                        </button>

                        <div class="auth-divider-saas">
                            <span class="auth-divider-text">Don't have an account?</span>
                        </div>

                        <button type="button" class="auth-btn-link-saas" id="show-register-btn">
                            Create an account
                        </button>
                    </form>
                </div>

                <!-- Registration Form (Hidden by default) -->
                <div id="register-form-container" class="auth-form-container" style="display: none;">
                    <div class="auth-form-header-saas">
                        <h1 class="auth-title-saas">Create Account</h1>
                        <p class="auth-subtitle-saas">Get started with BAJ System</p>
                    </div>

                    <form id="register-form" class="auth-form-saas">
                        <div class="auth-form-grid-saas">
                            <div class="auth-form-group-saas">
                                <label for="register-firstName" class="auth-label-saas">First Name</label>
                                <input 
                                    type="text" 
                                    id="register-firstName"
                                    name="firstName" 
                                    class="auth-input-saas" 
                                    placeholder="Ernesto" 
                                    required
                                    autocomplete="given-name">
                            </div>
                            <div class="auth-form-group-saas">
                                <label for="register-lastName" class="auth-label-saas">Last Name</label>
                                <input 
                                    type="text" 
                                    id="register-lastName"
                                    name="lastName" 
                                    class="auth-input-saas" 
                                    placeholder="Abarientos" 
                                    required
                                    autocomplete="family-name">
                            </div>
                        </div>

                        <div class="auth-form-group-saas">
                            <label for="register-username" class="auth-label-saas">Username</label>
                            <input 
                                type="text" 
                                id="register-username"
                                name="username" 
                                class="auth-input-saas" 
                                placeholder="Rootkit.a11" 
                                required
                                autocomplete="username">
                        </div>

                        <div class="auth-form-group-saas">
                            <label for="register-email" class="auth-label-saas">Email</label>
                            <input 
                                type="email" 
                                id="register-email"
                                name="email" 
                                class="auth-input-saas" 
                                placeholder="abar@example.com" 
                                required
                                autocomplete="email">
                        </div>

                        <div class="auth-form-grid-saas">
                            <div class="auth-form-group-saas">
                                <label for="register-password" class="auth-label-saas">Password</label>
                                <div class="password-wrapper-saas">
                                    <input 
                                        type="password" 
                                        id="register-password" 
                                        name="password" 
                                        class="auth-input-saas" 
                                        placeholder="Min. 8 characters" 
                                        minlength="8" 
                                        required
                                        autocomplete="new-password">
                                    <button 
                                        type="button" 
                                        class="password-toggle-saas" 
                                        onclick="togglePassword('register-password', this)"
                                        aria-label="Show password">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="auth-form-group-saas">
                                <label for="register-confirm-password" class="auth-label-saas">Confirm Password</label>
                                <div class="password-wrapper-saas">
                                    <input 
                                        type="password" 
                                        id="register-confirm-password" 
                                        name="confirmPassword" 
                                        class="auth-input-saas" 
                                        placeholder="Repeat password" 
                                        minlength="8" 
                                        required
                                        autocomplete="new-password">
                                    <button 
                                        type="button" 
                                        class="password-toggle-saas" 
                                        onclick="togglePassword('register-confirm-password', this)"
                                        aria-label="Show password">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="auth-form-grid-saas">
                            <div class="auth-form-group-saas">
                                <label for="register-department" class="auth-label-saas">Department</label>
                                <select id="register-department" name="department" class="auth-input-saas">
                                    <option value="">Select Department</option>
                                    <option value="IT">IT</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Purchasing">Purchasing</option>
                                    <option value="Warehouse">Warehouse</option>
                                    <option value="Administration">Administration</option>
                                </select>
                            </div>
                            <div class="auth-form-group-saas">
                                <label for="register-role" class="auth-label-saas">Role</label>
                                <select id="register-role" name="role" class="auth-input-saas" required>
                                    <option value="">Select Role</option>
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <label class="auth-checkbox-saas">
                            <input type="checkbox" name="terms" id="terms-checkbox" required>
                            <span class="checkbox-label-saas">I agree to the Terms and Conditions</span>
                        </label>

                        <button type="submit" class="auth-btn-primary-saas">
                            <span>Create Account</span>
                            <span class="btn-arrow-saas">→</span>
                        </button>

                        <div class="auth-divider-saas">
                            <span class="auth-divider-text">Already have an account?</span>
                        </div>

                        <button type="button" class="auth-btn-link-saas" id="show-login-btn">
                            Sign in instead
                        </button>
                    </form>
                </div>
                
                <!-- Footer -->
                <div class="auth-footer-saas">
                    <p>&copy; {{ date('Y') }} BAJ System. All rights reserved.</p>
                </div>
            </main>
        </div>
    </div>
</body>
</html>
