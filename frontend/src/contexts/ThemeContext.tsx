import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SettingsAPI } from '../lib/api';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Store in localStorage for immediate access on next load
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadTheme = async () => {
    try {
      // First check localStorage for immediate theme application
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) {
        setThemeState(storedTheme);
      }

      // Then fetch from API to sync with server
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await SettingsAPI.getPreferences();
        if (response.data.success && response.data.data.theme) {
          const serverTheme = response.data.data.theme as Theme;
          setThemeState(serverTheme);
          localStorage.setItem('theme', serverTheme);
        }
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Fallback to localStorage or default
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      // Update UI immediately
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);

      // Save to server in background
      const token = localStorage.getItem('auth_token');
      if (token) {
        await SettingsAPI.updateTheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      // Theme is already applied locally, so user won't notice the error
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
