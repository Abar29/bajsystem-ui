# BAJ System - Authentication Guide

## Overview

The BAJ System now includes a complete authentication system with login and registration functionality. The authentication is implemented using localStorage for mock data, making it easy to test and later integrate with a Spring Boot backend API.

## Features

### ✅ Login System
- Username or Email login
- Password authentication
- Remember me functionality
- Forgot password placeholder
- Success/error notifications
- Auto-redirect to dashboard on success
- Smooth form transitions

### ✅ Registration System
- First name and last name
- Username (unique)
- Email (unique)
- Password with confirmation
- Minimum 8 characters password validation
- Department selection
- Terms & conditions checkbox
- Complete form validation
- Success notification with auto-redirect to login

### ✅ Session Management
- Authentication check on app load
- Auto-redirect to login if not authenticated
- Current user stored in localStorage
- User info displayed in header
- Logout functionality
- Session persistence with "Remember Me"

## Demo Users

Two demo users are pre-configured for testing:

### 1. Admin User
```
Username: admin
Password: admin123
Email: admin@bajsystem.com
Department: Administration
```

### 2. Regular User
```
Username: johndoe
Password: password123
Email: john@bajsystem.com
Department: Purchasing
```

## Usage

### Accessing the Login Page

Navigate to: `http://localhost:8000/login` (or your configured URL)

### Logging In

1. Enter your username or email
2. Enter your password
3. (Optional) Check "Remember me" to stay logged in
4. Click "Sign In"
5. You'll be redirected to the dashboard on success

### Creating a New Account

1. On the login page, click "Create Account"
2. Fill in all required fields:
   - First Name
   - Last Name
   - Username (must be unique)
   - Email (must be unique)
   - Password (min. 8 characters)
   - Confirm Password (must match)
   - Department (optional)
3. Check "I agree to the Terms and Conditions"
4. Click "Create Account"
5. On success, you'll be redirected back to login
6. Login with your new credentials

### Logging Out

1. Click on your name in the top-right header
2. Select "Logout" from the dropdown menu
3. You'll be redirected to the login page

## Technical Implementation

### File Structure

```
resources/
├── js/
│   ├── app.ts                      # Main app with auth check
│   └── auth.ts                     # Login/registration logic
├── css/
│   └── app.css                     # Auth page styles
└── views/
    ├── app.blade.php               # Main dashboard view
    └── auth/
        └── login.blade.php         # Login/registration page
```

### Routes

```php
// routes/web.php

// Login page (public)
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

// Dashboard (requires auth)
Route::get('/', function () {
    return view('app');
})->name('home');

// Logout
Route::get('/logout', function () {
    return redirect('/login');
})->name('logout');
```

### LocalStorage Keys

- `baj_users` - Array of all registered users
- `baj_current_user` - Currently logged-in user object
- `baj_remember_me` - Remember me preference

### Authentication Flow

```
1. User visits dashboard (/)
   ↓
2. app.ts checks for baj_current_user in localStorage
   ↓
3. If not found → Redirect to /login
   ↓
4. User logs in → Validate credentials
   ↓
5. On success → Store user in baj_current_user
   ↓
6. Redirect to dashboard
   ↓
7. User info displayed in header
```

## Form Validations

### Login Form
- ✅ Username/Email required
- ✅ Password required
- ✅ Credentials must match existing user

### Registration Form
- ✅ All fields with * are required
- ✅ Username must be unique
- ✅ Email must be unique and valid format
- ✅ Password minimum 8 characters
- ✅ Confirm password must match password
- ✅ Terms & conditions must be accepted

## Notifications

The system includes a toast notification system that displays:

- ✅ Login success
- ❌ Login failed (invalid credentials)
- ✅ Registration success
- ❌ Registration errors (validation failures)
- ℹ️ Forgot password placeholder message

Notifications appear in the top-right corner and auto-dismiss after 4 seconds.

## UI/UX Features

### Design Elements
- Clean, professional design matching dashboard theme
- Dark green primary color (#1e5631)
- Smooth animations and transitions
- Responsive layout (mobile, tablet, desktop)
- BAJ logo at top of form
- Toggle between login and registration
- Loading states during form submission
- Input focus animations
- Button hover effects with ripple animation

### Accessibility
- Proper label associations
- Required field indicators
- Clear error messages
- Keyboard navigation support
- Focus visible states
- ARIA attributes

## Integration with Backend API

When ready to connect to Spring Boot backend:

### 1. Update Login Handler

Replace the mock login in `auth.ts`:

```typescript
// Current (mock)
function handleLogin(data: LoginData): boolean {
  const users = getUsers();
  const user = users.find(u => 
    (u.username === data.username || u.email === data.username) &&
    u.password === data.password
  );
  return !!user;
}

// Future (API)
async function handleLogin(data: LoginData): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    const { token, user } = await response.json();
    localStorage.setItem('auth_token', token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return true;
  }
  return false;
}
```

### 2. Update Registration Handler

Replace the mock registration in `auth.ts`:

```typescript
// Future (API)
async function handleRegister(data: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  return result;
}
```

### 3. Add Token to API Requests

Update `resources/js/api/client.ts` to include auth token:

```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
}
```

## Security Considerations

### Current Implementation (Development)
⚠️ **Note**: This is a frontend-only mock implementation for development/testing:
- Passwords stored in plain text in localStorage
- No real authentication
- No session expiration
- Client-side only validation

### Production Recommendations
When connecting to real backend:
- ✅ Use JWT tokens for authentication
- ✅ Implement proper password hashing (bcrypt)
- ✅ Add CSRF protection
- ✅ Implement rate limiting
- ✅ Add session expiration
- ✅ Use HTTPS only
- ✅ Implement proper logout (server-side)
- ✅ Add refresh token mechanism
- ✅ Validate on both client and server
- ✅ Implement account lockout after failed attempts
- ✅ Add email verification
- ✅ Implement password reset flow

## Testing

### Manual Testing Checklist

**Login:**
- [ ] Login with admin/admin123
- [ ] Login with johndoe/password123
- [ ] Login with incorrect password (should show error)
- [ ] Login with non-existent user (should show error)
- [ ] Check "Remember me" functionality
- [ ] Test forgot password link (shows placeholder)

**Registration:**
- [ ] Register new user with valid data
- [ ] Try duplicate username (should show error)
- [ ] Try duplicate email (should show error)
- [ ] Try password < 8 chars (should show error)
- [ ] Try mismatched passwords (should show error)
- [ ] Try without accepting terms (should show error)
- [ ] Successfully register and login

**Session:**
- [ ] Access dashboard without login (should redirect to login)
- [ ] Login and verify redirect to dashboard
- [ ] Verify user info in header
- [ ] Logout and verify redirect to login
- [ ] Verify localStorage cleared after logout

**UI:**
- [ ] Toggle between login and registration forms
- [ ] Check responsive design on mobile
- [ ] Verify animations work smoothly
- [ ] Test notifications appear and disappear
- [ ] Verify loading states during submission

## Troubleshooting

### Issue: Redirecting to login in a loop
**Solution**: Check if `baj_current_user` exists in localStorage. Clear it and login again.

### Issue: Can't login with valid credentials
**Solution**: 
1. Open browser console (F12)
2. Go to Application > Local Storage
3. Check if `baj_users` exists with demo users
4. Clear all BAJ-related localStorage items
5. Refresh page (will reinitialize demo users)

### Issue: Registration not working
**Solution**: Check console for validation errors. Ensure all required fields are filled.

### Issue: Notifications not appearing
**Solution**: Check if CSS is loaded properly. Try hard refresh (Ctrl+Shift+R).

## Future Enhancements

Planned improvements:
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Microsoft)
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Session timeout warning
- [ ] Multiple device management
- [ ] Activity log

## Support

For questions or issues:
- Check the browser console for errors
- Verify localStorage contains correct data
- Ensure all files are properly built (`npm run build`)
- Check network tab for any failed requests (when API integrated)

## Summary

The authentication system is now fully functional with:
- ✅ Professional login/registration UI
- ✅ Complete form validation
- ✅ Mock data persistence
- ✅ Session management
- ✅ Ready for backend integration
- ✅ Responsive design
- ✅ Smooth UX with animations

**Test it now**: Visit `/login` and try the demo credentials!
