import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  mode?: 'preference' | 'system';
  storageKey?: string;
  themeColors?: Record<ResolvedTheme, string>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const defaultColors = { light: '#ffffff', dark: '#1b1b1d' };

function readPreference(storageKey: string): ThemePreference {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({
  children,
  mode = 'preference',
  storageKey = 'lailai.theme',
  themeColors = defaultColors,
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [ready, setReady] = useState(false);
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => {
      setSystemTheme(query.matches ? 'dark' : 'light');
      if (mode === 'system') setPreferenceState('system');
    };
    const syncPreference = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) {
        setPreferenceState(readPreference(storageKey));
      }
    };
    setPreferenceState(mode === 'system' ? 'system' : readPreference(storageKey));
    syncSystem();
    setReady(true);
    query.addEventListener('change', syncSystem);
    if (mode === 'preference') window.addEventListener('storage', syncPreference);
    return () => {
      query.removeEventListener('change', syncSystem);
      window.removeEventListener('storage', syncPreference);
    };
  }, [storageKey, mode]);

  useEffect(() => {
    // Preserve the host's pre-paint theme until the selected mode has initialized.
    if (!ready) return;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolvedTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[resolvedTheme]);
  }, [preference, resolvedTheme, ready, themeColors]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      if (mode === 'system') return;
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Theme selection still works when the browser blocks persistent storage.
      }
    },
    [storageKey, mode]
  );

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider.');
  return value;
}

export default ThemeProvider;
