/**
 * Theme Detector Utility
 * Detects OS theme preference and manages theme state
 */

export const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const getStoredTheme = () => {
  return localStorage.getItem('theme') || null;
};

export const setStoredTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Apply data-theme attribute
  root.setAttribute('data-theme', theme);
  
  // Apply Tailwind dark mode class
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0f0f17' : '#ffffff');
  }
};

export const initializeTheme = () => {
  const storedTheme = getStoredTheme();
  const theme = storedTheme || 'dark'; // Default to dark mode
  applyTheme(theme);
  return theme;
};

// Listen for system theme changes
export const watchSystemTheme = (callback) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e) => {
    const storedTheme = getStoredTheme();
    if (!storedTheme) {
      // Only auto-switch if user hasn't manually set a preference
      callback(e.matches ? 'dark' : 'light');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
};
