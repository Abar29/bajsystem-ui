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
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🙈';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        }
    </script>
</head>
<body class="auth-page">
    <!-- Split Screen Container -->
    <div class="auth-split-container">
        <!-- Left Side - Branding & Visual -->
        <div class="auth-left-side" style="background: linear-gradient(135deg, rgba(30, 86, 49, 0.85) 0%, rgba(22, 61, 35, 0.9) 100%), url('{{ asset('image/bg.png') }}') center/cover no-repeat;">
            <div class="auth-brand-content">
                <div class="auth-brand-header">
                    <img src="{{ asset('image/bajlogo2.png') }}" alt="BAJ Logo" class="auth-brand-logo">
                </div>
                
                <div class="auth-brand-description">
                    <h2>Streamline Your Business Operations</h2>
                    <p>Comprehensive management solution for inventory, purchasing, and logistics</p>
                </div>
                
                <div class="auth-features-grid">
                    <div class="auth-feature-item">
                        <div class="feature-icon">📦</div>
                        <span>Inventory Management</span>
                    </div>
                    <div class="auth-feature-item">
                        <div class="feature-icon">📋</div>
                        <span>Purchase Orders</span>
                    </div>
                    <div class="auth-feature-item">
                        <div class="feature-icon">🚚</div>
                        <span>Delivery Tracking</span>
                    </div>
                    <div class="auth-feature-item">
                        <div class="feature-icon">📊</div>
                        <span>Analytics Dashboard</span>
                    </div>
                </div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="auth-decoration-circles">
                <div class="circle circle-1"></div>
                <div class="circle circle-2"></div>
                <div class="circle circle-3"></div>
            </div>
        </div>
        
        <!-- Right Side - Forms -->
        <div class="auth-right-side">
            <div class="auth-form-wrapper">
                <!-- Login Form -->
                <div id="login-form-container" class="auth-form-container">
                    <div class="auth-form-header">
                        <h1 class="auth-title">Welcome Back</h1>
                        <p class="auth-subtitle">Sign in to continue to BAJ System</p>
                    </div>

                    <form id="login-form" class="auth-form">
                        <div class="auth-form-group">
                            <label class="auth-label">Username or Email</label>
                            <div class="input-wrapper">
                                <span class="input-icon">👤</span>
                                <input type="text" name="username" class="auth-input" placeholder="Enter your username" required>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label">Password</label>
                            <div class="input-wrapper password-wrapper">
                                <span class="input-icon">🔒</span>
                                <input type="password" id="login-password" name="password" class="auth-input" placeholder="Enter your password" required>
                                <button type="button" class="password-toggle" onclick="togglePassword('login-password', this)">
                                    👁️
                                </button>
                            </div>
                        </div>

                        <div class="auth-form-options">
                            <label class="auth-checkbox">
                                <input type="checkbox" name="remember">
                                <span class="checkbox-label">Remember me</span>
                            </label>
                            <a href="#" class="auth-link" id="forgot-password-link">Forgot password?</a>
                        </div>

                        <button type="submit" class="auth-btn auth-btn-primary">
                            <span>Sign In</span>
                            <span class="btn-arrow">→</span>
                        </button>

                        <div class="auth-divider">
                            <span>Don't have an account?</span>
                        </div>

                        <button type="button" class="auth-btn-link" id="show-register-btn">
                            Create an account
                        </button>
                    </form>
                </div>

                <!-- Registration Form (Hidden by default) -->
                <div id="register-form-container" class="auth-form-container" style="display: none;">
                    <div class="auth-form-header">
                        <h1 class="auth-title">Create Account</h1>
                        <p class="auth-subtitle">Join BAJ System today</p>
                    </div>

                    <form id="register-form" class="auth-form">
                        <div class="auth-form-grid">
                            <div class="auth-form-group">
                                <label class="auth-label">First Name</label>
                                <input type="text" name="firstName" class="auth-input" placeholder="Ernesto" required>
                            </div>
                            <div class="auth-form-group">
                                <label class="auth-label">Last Name</label>
                                <input type="text" name="lastName" class="auth-input" placeholder="Abarientos" required>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label">Username</label>
                            <input type="text" name="username" class="auth-input" placeholder="Rootkit.a11" required>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label">Email</label>
                            <input type="email" name="email" class="auth-input" placeholder="Abar@example.com" required>
                        </div>

                        <div class="auth-form-grid">
                            <div class="auth-form-group">
                                <label class="auth-label">Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="register-password" name="password" class="auth-input" placeholder="Min. 8 characters" minlength="8" required>
                                    <button type="button" class="password-toggle" onclick="togglePassword('register-password', this)">
                                        👁️
                                    </button>
                                </div>
                            </div>
                            <div class="auth-form-group">
                                <label class="auth-label">Confirm Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="register-confirm-password" name="confirmPassword" class="auth-input" placeholder="Repeat password" minlength="8" required>
                                    <button type="button" class="password-toggle" onclick="togglePassword('register-confirm-password', this)">
                                        👁️
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="auth-form-grid">
                            <div class="auth-form-group">
                                <label class="auth-label">Department</label>
                                <select name="department" class="auth-input">
                                    <option value="">Select Department</option>
                                    <option value="IT">IT</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Purchasing">Purchasing</option>
                                    <option value="Warehouse">Warehouse</option>
                                    <option value="Administration">Administration</option>
                                </select>
                            </div>
                            <div class="auth-form-group">
                                <label class="auth-label">Role</label>
                                <select name="role" class="auth-input" required>
                                    <option value="">Select Role</option>
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <label class="auth-checkbox">
                            <input type="checkbox" name="terms" required>
                            <span class="checkbox-label">I agree to the Terms and Conditions</span>
                        </label>

                        <button type="submit" class="auth-btn auth-btn-primary">
                            <span>Create Account</span>
                            <span class="btn-arrow">→</span>
                        </button>

                        <div class="auth-divider">
                            <span>Already have an account?</span>
                        </div>

                        <button type="button" class="auth-btn-link" id="show-login-btn">
                            Sign in instead
                        </button>
                    </form>
                </div>
                
                <!-- Footer -->
                <div class="auth-footer">
                    <p>&copy; {{ date('Y') }} BAJ System. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
