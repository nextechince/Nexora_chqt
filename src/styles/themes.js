import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './colors';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [accentColor, setAccentColor] = useState(COLORS.primary);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const dark = await AsyncStorage.getItem('@nexora_theme_dark');
      const accent = await AsyncStorage.getItem('@nexora_theme_accent');
      if (dark !== null) setIsDark(JSON.parse(dark));
      if (accent) setAccentColor(accent);
    } catch (error) {
      console.log('Theme load error:', error);
    }
  };

  const toggleTheme = async () => {
    const newDark = !isDark;
    setIsDark(newDark);
    await AsyncStorage.setItem('@nexora_theme_dark', JSON.stringify(newDark));
  };

  const setAccent = async (color) => {
    setAccentColor(color);
    await AsyncStorage.setItem('@nexora_theme_accent', color);
  };

  const theme = {
    isDark,
    colors: isDark ? COLORS : {
      ...COLORS,
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F3F4F6',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      bgGlass: 'rgba(0, 0, 0, 0.05)',
      borderGlass: 'rgba(0, 0, 0, 0.1)',
    },
    accentColor,
    toggleTheme,
    setAccent,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
