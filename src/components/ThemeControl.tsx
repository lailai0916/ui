import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTheme, type ThemePreference } from '../theme/ThemeProvider';

type ThemeControlProps = {
  labels: Record<ThemePreference, string>;
  variant?: 'segmented' | 'compact';
};

const preferences: ThemePreference[] = ['system', 'light', 'dark'];

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  const paths: Record<ThemePreference, ReactNode> = {
    system: (
      <>
        <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
        <path d="M8 20h8M12 16.5V20" />
      </>
    ),
    light: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </>
    ),
    dark: <path d="M20.2 15.4A8.7 8.7 0 0 1 8.6 3.8 8.8 8.8 0 1 0 20.2 15.4Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[preference]}
    </svg>
  );
}

export function ThemeControl({ labels, variant = 'segmented' }: ThemeControlProps) {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [open]);

  if (variant === 'compact') {
    return (
      <div className="lui-theme-picker" ref={rootRef}>
        <button
          ref={triggerRef}
          type="button"
          className="lui-theme-picker__trigger"
          aria-label={`${labels.system}：${labels[preference]}`}
          aria-controls={id}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
        >
          <ThemeIcon preference={preference} />
        </button>
        {open && (
          <div id={id} className="lui-theme-picker__menu" role="menu">
            {preferences.map((value) => (
              <button
                key={value}
                type="button"
                className="lui-theme-picker__option"
                role="menuitemradio"
                aria-checked={preference === value}
                onClick={() => {
                  setPreference(value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <ThemeIcon preference={value} />
                <span>{labels[value]}</span>
                <span className="lui-theme-picker__check" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

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
