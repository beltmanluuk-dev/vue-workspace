import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  graySubtle: string;
  grayLight: string;
  silver: string;
  charcoal: string;
  systemGreen: string;
  systemRed: string;
  border: string;
  glass: string;
  glassBorder: string;
  text: string;
  textSecondary: string;
}

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  primary: '#000000',
  secondary: '#F5F5F7',
  background: '#FFFFFF',
  surface: '#FAFAFA',
  graySubtle: '#86868B',
  grayLight: '#D2D2D7',
  silver: '#A1A1A6',
  charcoal: '#6E6E73',
  systemGreen: '#30D158',
  systemRed: '#FF453A',
  border: '#E8E8ED',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  text: '#000000',
  textSecondary: '#86868B',
};

const darkColors: ThemeColors = {
  primary: '#FFFFFF',
  secondary: '#1C1C1E',
  background: '#000000',
  surface: '#1C1C1E',
  graySubtle: '#98989D',
  grayLight: '#48484A',
  silver: '#8E8E93',
  charcoal: '#AEAEB2',
  systemGreen: '#30D158',
  systemRed: '#FF453A',
  border: '#38383A',
  glass: 'rgba(28, 28, 30, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textSecondary: '#98989D',
};

const defaultContext: ThemeContextType = {
  isDark: false,
  themeMode: 'system',
  setThemeMode: () => {},
  colors: lightColors,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
