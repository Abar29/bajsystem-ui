import '../css/app.css';
import { initializeApp } from './ui/app';
import { darkMode } from './ui/components/DarkMode';
import { initializeAccountMenu } from './ui/components/AccountSettings';

// Authentication check
const CURRENT_USER_KEY = 'baj_current_user';

function checkAuth(): boolean {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return !!currentUser;
}

function getCurrentUser(): any {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
}

// Check if user is authenticated
if (!checkAuth()) {
  // Redirect to login page if not authenticated
  window.location.href = '/login';
} else {
  // Update header with current user info if authenticated
  const currentUser = getCurrentUser();
  const adminNameElement = document.querySelector('.admin-name');
  const userAvatarElement = document.querySelector('.user-avatar');
  
  if (adminNameElement && currentUser) {
    adminNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  }
  
  if (userAvatarElement && currentUser) {
    userAvatarElement.textContent = currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
  }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  
  // Setup dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => darkMode.toggle());
    // Set initial icon
    darkModeToggle.innerHTML = darkMode.isDarkMode() ? '☀️' : '🌙';
  }

  // Setup account menu
  initializeAccountMenu();
  
  // Setup logout functionality
  const logoutLinks = document.querySelectorAll('[data-action="logout"]');
  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear authentication data
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('baj_remember_me');
      
      // Redirect to login
      window.location.href = '/login';
    });
  });

  // Setup header scroll lift effect
  setupHeaderScrollEffect();
});

/**
 * Header Lift on Scroll Effect
 * Adds 'scrolled' class to header when main content is scrolled
 */
function setupHeaderScrollEffect(): void {
  const header = document.querySelector('.app-header') as HTMLElement;
  const mainContent = document.getElementById('main-content');
  
  if (!header || !mainContent) return;

  let ticking = false;

  const updateHeaderState = () => {
    const scrollTop = mainContent.scrollTop;
    
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    ticking = false;
  };

  mainContent.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  });
}

