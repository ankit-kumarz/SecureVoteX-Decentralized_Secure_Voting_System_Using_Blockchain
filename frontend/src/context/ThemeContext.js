import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeTheme, setStoredTheme, applyTheme, watchSystemTheme } from '../utils/themeDetector';

const ThemeContext = createContext();

export { ThemeContext };

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return initializeTheme();
  });

  useEffect(() => {
    const cleanup = watchSystemTheme((newTheme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
    });
    
    return cleanup;
  }, []);

  useEffect(() => {
    setStoredTheme(theme);
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Keep isDarkMode for backwards compatibility
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
