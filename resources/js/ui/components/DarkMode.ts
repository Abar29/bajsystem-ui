// Dark Mode Manager
class DarkModeManager {
  private isDark: boolean = false;
  private readonly STORAGE_KEY = 'baj-theme';

  constructor() {
    this.loadTheme();
    this.createToggleButton();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    this.isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private saveTheme(): void {
    localStorage.setItem(this.STORAGE_KEY, this.isDark ? 'dark' : 'light');
  }

  toggle(): void {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.saveTheme();
    this.updateToggleButton();
  }

  private createToggleButton(): void {
    // Button will be added in the header via the app initialization
  }

  private updateToggleButton(): void {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = this.isDark ? '☀️' : '🌙';
      toggleBtn.setAttribute('title', this.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }

  isDarkMode(): boolean {
    return this.isDark;
  }
}

export const darkMode = new DarkModeManager();
