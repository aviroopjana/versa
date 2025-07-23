"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always use light theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Always apply light theme
    applyTheme('light');
    
    // Remove any saved theme preference
    localStorage.removeItem('theme');
    
  }, []);
  
  const applyTheme = (mode: string) => {
    // Always remove dark class, enforcing light mode
    document.documentElement.classList.remove('dark');
  };
  
  // This function now does nothing since we're enforcing light mode
  const updateTheme = (newTheme: string) => {
    // Always maintain light theme
    setTheme('light');
    applyTheme('light');
  };
  
  const contextValue = {
    theme,
    setTheme: updateTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
