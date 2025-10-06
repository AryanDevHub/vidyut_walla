/**
 * Settings Manager - Handles user preferences like theme.
 */
class SettingsManager {
  constructor() {
    this.theme = 'system';
  }

  /**
   * Initialize the settings manager.
   */
  init() {
    this.theme = this.getTheme();
    this.applyTheme();
    
    // Listen for OS theme changes if the setting is 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.getTheme() === 'system') {
        this.applyTheme();
      }
    });
  }

  /**
   * Get the current theme from localStorage or default to 'system'.
   * @returns {string} The current theme ('light', 'dark', or 'system').
   */
  getTheme() {
    return localStorage.getItem('theme') || 'system';
  }

  /**
   * Save the theme preference to localStorage.
   * @param {string} theme - The theme to set ('light', 'dark').
   */
  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  /**
   * Apply the current theme to the DOM by setting a data attribute.
   */
  applyTheme() {
    const currentTheme = this.getTheme();
    let themeToApply;

    if (currentTheme === 'system') {
      // Use the OS preference
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      themeToApply = currentTheme;
    }

    document.documentElement.setAttribute('data-color-scheme', themeToApply);
  }
}

export default new SettingsManager();