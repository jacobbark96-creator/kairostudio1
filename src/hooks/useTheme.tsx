"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light for SSR to match initial render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only execute on the client side after mounting
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Prevent hydration mismatch by rendering children without theme class interference until mounted
  if (!mounted) {
      return (
        <ThemeContext.Provider value={{ theme: 'light', setTheme }}>
          <div className="invisible">{children}</div>
        </ThemeContext.Provider>
      );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

