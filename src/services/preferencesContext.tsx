import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserPreferences } from '../types';

interface PreferencesContextType {
  preferences: UserPreferences;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setReducedMotion: (enabled: boolean) => void;
  setLowPowerMode: (enabled: boolean) => void;
  setDistanceUnit: (unit: 'km' | 'mi') => void;
  isDark: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  lowPowerMode: false,
  distanceUnit: 'km',
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('wildmumbai_preferences');
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch (e) {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  // Apply dark mode class to root HTML
  useEffect(() => {
    const root = document.documentElement;
    let effectiveDark = true;

    if (preferences.theme === 'system') {
      effectiveDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      effectiveDark = preferences.theme === 'dark';
    }

    setIsDark(effectiveDark);
    if (effectiveDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if (preferences.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    try {
      localStorage.setItem('wildmumbai_preferences', JSON.stringify(preferences));
    } catch (e) {
      // ignore
    }
  }, [preferences]);

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, reducedMotion: enabled }));
  };

  const setLowPowerMode = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, lowPowerMode: enabled }));
  };

  const setDistanceUnit = (unit: 'km' | 'mi') => {
    setPreferences(prev => ({ ...prev, distanceUnit: unit }));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setTheme,
        setReducedMotion,
        setLowPowerMode,
        setDistanceUnit,
        isDark,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
