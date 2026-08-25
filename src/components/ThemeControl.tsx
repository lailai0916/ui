import { useTheme, type ThemePreference } from '../theme/ThemeProvider';

type ThemeControlProps = {
  labels: Record<ThemePreference, string>;
};

const preferences: ThemePreference[] = ['system', 'light', 'dark'];

export function ThemeControl({ labels }: ThemeControlProps) {
  const { preference, setPreference } = useTheme();

  return (
    <div className="lui-theme-control" role="group" aria-label={labels.system}>
      {preferences.map((value) => (
        <button
          key={value}
          type="button"
          className="lui-theme-control__button"
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}
