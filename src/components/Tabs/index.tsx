import { useId, useRef, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import Icon from '../Icon/index.js';
import styles from '../Segmented/styles.module.css';
import tabStyles from './styles.module.css';

export interface TabItem<T> {
  value: T;
  label: string;
  icon?: string;
  id?: string;
  panelId?: string;
  disabled?: boolean;
}

export interface TabsProps<T> {
  value: T;
  items: TabItem<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function Tabs<T>({
  value,
  items,
  onChange,
  ariaLabel,
  size = 'md',
  orientation = 'horizontal',
  className,
}: TabsProps<T>) {
  const generatedId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index >= 0);
  const selected = items.findIndex((item) => !item.disabled && item.value === value);
  const focusIndex = selected < 0 ? enabled[0] : selected;

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const [previous, next] =
      orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    if (![previous, next, 'Home', 'End'].includes(event.key) || enabled.length === 0) return;
    event.preventDefault();
    const current = enabled.indexOf(index);
    const target =
      event.key === 'Home'
        ? enabled[0]
        : event.key === 'End'
          ? enabled[enabled.length - 1]
          : enabled[(current + (event.key === next ? 1 : -1) + enabled.length) % enabled.length];
    onChange(items[target].value);
    refs.current[target]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      data-lk="tabs"
      data-size={size}
      className={clsx(
        styles.segmented,
        tabStyles.tabs,
        size === 'sm' && styles.small,
        orientation === 'horizontal' && styles.horizontal,
        orientation === 'horizontal' && styles.keepHorizontal,
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={String(item.value)}
          ref={(element) => {
            refs.current[index] = element;
          }}
          id={item.id ?? `${generatedId}-tab-${index}`}
          type="button"
          role="tab"
          data-lk="tab"
          aria-selected={item.value === value}
          aria-controls={item.panelId}
          tabIndex={index === focusIndex ? 0 : -1}
          disabled={item.disabled}
          className={clsx(styles.item, tabStyles.tab, item.value === value && styles.itemActive)}
          onClick={() => onChange(item.value)}
          onKeyDown={(event) => moveFocus(event, index)}
        >
          {item.icon && <Icon icon={item.icon} className={styles.icon} />}
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
