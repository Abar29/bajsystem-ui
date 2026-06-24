// Auth page functionality

interface LoginData {
  username: string;
  password: string;
  remember: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  terms: boolean;
}

// Mock user database (localStorage)
const USERS_KEY = 'baj_users';
const CURRENT_USER_KEY = 'baj_current_user';

// Initialize with demo user if not exists
function initializeMockUsers(): void {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const demoUsers = [
      {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@bajsystem.com',
        password: 'admin123', // In production, this would be hashed
        department: 'Administration',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@bajsystem.com',
        password: 'password123',
        department: 'Purchasing',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }
}

// Get all users
function getUsers(): any[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users: any[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Login function
function handleLogin(data: LoginData): boolean {
  const users = getUsers();
  const user = users.find(
    (u) =>
      (u.username === data.username || u.email === data.username) &&
      u.password === data.password
  );

  if (user) {
    // Store current user (without password)
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    // Store remember me preference
    if (data.remember) {
      localStorage.setItem('baj_remember_me', 'true');
    }
    
    return true;
  }
  
  return false;
}

// Register function
function handleRegister(data: RegisterData): { success: boolean; message: string } {
  // Validation
  if (data.password !== data.confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }

  if (data.password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters' };
  }

  if (!data.terms) {
    return { success: false, message: 'You must agree to the Terms and Conditions' };
  }

  const users = getUsers();

  // Check if username already exists
  if (users.some((u) => u.username === data.username)) {
    return { success: false, message: 'Username already exists' };
  }

  // Check if email already exists
  if (users.some((u) => u.email === data.email)) {
    return { success: false, message: 'Email already exists' };
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    email: data.email,
    password: data.password, // In production, this would be hashed
    department: data.department || 'Not Assigned',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Registration successful' };
}

// Show notification
function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  // Remove existing notification
  const existing = document.querySelector('.auth-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = `auth-notification auth-notification-${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
    <span class="notification-message">${message}</span>
  `;

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeMockUsers();

  const loginForm = document.getElementById('login-form') as HTMLFormElement;
  const registerForm = document.getElementById('register-form') as HTMLFormElement;
  const showRegisterBtn = document.getElementById('show-register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const loginFormContainer = document.getElementById('login-form-container');
  const registerFormContainer = document.getElementById('register-form-container');

  // Toggle between login and register forms
  showRegisterBtn?.addEventListener('click', () => {
    loginFormContainer!.style.display = 'none';
    registerFormContainer!.style.display = 'block';
  });

  showLoginBtn?.addEventListener('click', () => {
    registerFormContainer!.style.display = 'none';
    loginFormContainer!.style.display = 'block';
  });

  // Forgot password handler
  forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Password reset functionality will be available soon', 'error');
  });

  // Login form submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const data: LoginData = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      remember: formData.get('remember') === 'on',
    };

    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Signing In...</span>';

    // Simulate network delay
    setTimeout(() => {
      const success = handleLogin(data);
      
      if (success) {
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showNotification('Invalid username or password', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 800);
  });

  // Register form submission
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const data: RegisterData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      department: formData.get('department') as string,
      terms: formData.get('terms') === 'on',
    };

    // Show loading state
    const submitBtn = registerForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Creating Account...</span>';

    // Simulate network delay
    setTimeout(() => {
      const result = handleRegister(data);
      
      if (result.success) {
        showNotification(result.message + ' Please sign in.', 'success');
        
        // Switch to login form after 1.5 seconds
        setTimeout(() => {
          registerForm.reset();
          registerFormContainer!.style.display = 'none';
          loginFormContainer!.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1500);
      } else {
        showNotification(result.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 800);
  });

  // Add input validation animations
  const inputs = document.querySelectorAll('.auth-input');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement?.classList.remove('focused');
    });
  });
});
