import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { HeaderActionButton } from '../../internal/HeaderActionButton.js';

export type ButtonLocale = 'en' | 'zh-Hans';

export type LanguageButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  locale: ButtonLocale;
  onLocaleChange: (locale: ButtonLocale) => void;
  label?: string;
};

export const LanguageButton = forwardRef<HTMLButtonElement, LanguageButtonProps>(
  function LanguageButton({ locale, onLocaleChange, label, onClick, ...props }, ref) {
    return (
      <HeaderActionButton
        {...props}
        ref={ref}
        kind="language"
        data-locale={locale}
        label={
          label ??
          props['aria-label'] ??
          (locale === 'en'
            ? 'Current language: English. Switch to 中文'
            : '当前语言：中文，切换至 English')
        }
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onLocaleChange(locale === 'en' ? 'zh-Hans' : 'en');
        }}
      >
        {locale === 'en' ? 'EN' : '中'}
      </HeaderActionButton>
    );
  }
);

export default LanguageButton;
