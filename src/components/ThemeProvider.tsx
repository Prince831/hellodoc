
import { createContext, useContext, useEffect, useState } from "react";
import { colorSchemes, getColorScheme } from "@/utils/colorSchemes";

type Theme = 'light' | 'dark';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorScheme: string;
  setTheme: (theme: Theme) => void;
  setColorScheme: (schemeId: string) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  colorScheme: 'blue',
  setTheme: () => null,
  setColorScheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'hello-doc-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [colorScheme, setColorScheme] = useState<string>(
    () => localStorage.getItem('hello-doc-color-scheme') || 'blue'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    const scheme = getColorScheme(colorScheme);
    
    // Apply the color scheme to CSS variables
    document.documentElement.style.setProperty('--primary', scheme.primary);
    document.documentElement.style.setProperty('--secondary', scheme.secondary);
    document.documentElement.style.setProperty('--accent', scheme.accent);
    
    localStorage.setItem('hello-doc-color-scheme', colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
