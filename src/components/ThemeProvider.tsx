
import { createContext, useContext, useEffect, useState } from "react";
import { colorSchemes, getColorScheme } from "@/utils/colorSchemes";

type Theme = 'light' | 'dark';
type FontFamily = 'system' | 'sans' | 'serif' | 'mono' | 'dyslexic';
type DateFormat = 'mdy' | 'dmy' | 'ymd';
type TimeFormat = '12h' | '24h';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorScheme: string;
  fontSize: number;
  reducedMotion: boolean;
  highContrast: boolean;
  fontFamily: FontFamily;
  compactView: boolean;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  setTheme: (theme: Theme) => void;
  setColorScheme: (schemeId: string) => void;
  setFontSize: (size: number) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setFontFamily: (family: FontFamily) => void;
  setCompactView: (enabled: boolean) => void;
  setDateFormat: (format: DateFormat) => void;
  setTimeFormat: (format: TimeFormat) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  colorScheme: 'blue',
  fontSize: 16,
  reducedMotion: false,
  highContrast: false,
  fontFamily: 'system',
  compactView: false,
  dateFormat: 'mdy',
  timeFormat: '12h',
  setTheme: () => null,
  setColorScheme: () => null,
  setFontSize: () => null,
  setReducedMotion: () => null,
  setHighContrast: () => null,
  setFontFamily: () => null,
  setCompactView: () => null,
  setDateFormat: () => null,
  setTimeFormat: () => null,
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

  const [fontSize, setFontSize] = useState<number>(
    () => Number(localStorage.getItem('hello-doc-font-size')) || 16
  );

  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () => localStorage.getItem('hello-doc-reduced-motion') === 'true'
  );

  const [highContrast, setHighContrast] = useState<boolean>(
    () => localStorage.getItem('hello-doc-high-contrast') === 'true'
  );

  const [fontFamily, setFontFamily] = useState<FontFamily>(
    () => (localStorage.getItem('hello-doc-font-family') as FontFamily) || 'system'
  );

  const [compactView, setCompactView] = useState<boolean>(
    () => localStorage.getItem('hello-doc-compact-view') === 'true'
  );

  const [dateFormat, setDateFormat] = useState<DateFormat>(
    () => (localStorage.getItem('hello-doc-date-format') as DateFormat) || 'mdy'
  );

  const [timeFormat, setTimeFormat] = useState<TimeFormat>(
    () => (localStorage.getItem('hello-doc-time-format') as TimeFormat) || '12h'
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

  useEffect(() => {
    // Apply font size
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    localStorage.setItem('hello-doc-font-size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    // Apply reduced motion preference
    const root = window.document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    localStorage.setItem('hello-doc-reduced-motion', reducedMotion.toString());
  }, [reducedMotion]);

  useEffect(() => {
    // Apply high contrast mode
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('hello-doc-high-contrast', highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    // Apply font family
    const root = window.document.documentElement;
    root.classList.remove('font-system', 'font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    root.classList.add(`font-${fontFamily}`);
    localStorage.setItem('hello-doc-font-family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    // Apply compact view setting
    const root = window.document.documentElement;
    if (compactView) {
      root.classList.add('compact-view');
    } else {
      root.classList.remove('compact-view');
    }
    localStorage.setItem('hello-doc-compact-view', compactView.toString());
  }, [compactView]);

  useEffect(() => {
    localStorage.setItem('hello-doc-date-format', dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem('hello-doc-time-format', timeFormat);
  }, [timeFormat]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    colorScheme,
    fontSize,
    reducedMotion,
    highContrast,
    fontFamily,
    compactView,
    dateFormat,
    timeFormat,
    setTheme,
    setColorScheme,
    setFontSize,
    setReducedMotion,
    setHighContrast,
    setFontFamily,
    setCompactView,
    setDateFormat,
    setTimeFormat,
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
