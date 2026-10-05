import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { HeaderActionButton } from '../../internal/HeaderActionButton.js';
import { useLaikit } from '../../provider.js';
import Icon from '../Icon/index.js';
import type { ResolvedTheme } from '../ThemeProvider/index.js';

const themeIcons = {
  light: {
    body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g>',
    width: 24,
    height: 24,
  },
  dark: {
    body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
    width: 24,
    height: 24,
  },
};

export type ThemeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  theme: ResolvedTheme;
  onThemeChange: (theme: ResolvedTheme) => void;
  label?: string;
};

export const ThemeButton = forwardRef<HTMLButtonElement, ThemeButtonProps>(function ThemeButton(
  { theme, onThemeChange, label, onClick, ...props },
  ref
) {
  const { locale } = useLaikit();
  const chinese = locale.startsWith('zh');
  const description =
    theme === 'dark'
      ? chinese
        ? '当前主题：深色，切换至浅色'
        : 'Current theme: dark. Switch to light'
      : chinese
        ? '当前主题：浅色，切换至深色'
        : 'Current theme: light. Switch to dark';

  return (
    <HeaderActionButton
      {...props}
      ref={ref}
      kind="theme"
      data-theme={theme}
      label={label ?? props['aria-label'] ?? description}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onThemeChange(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      <Icon key={theme} icon={themeIcons[theme]} ssr width={17} height={17} aria-hidden="true" />
    </HeaderActionButton>
  );
});

export default ThemeButton;
