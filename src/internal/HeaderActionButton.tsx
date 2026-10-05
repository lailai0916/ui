import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './header-action.module.css';

const useClientLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

type HeaderActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  kind: 'language' | 'theme';
};

export const HeaderActionButton = forwardRef<HTMLButtonElement, HeaderActionButtonProps>(
  function HeaderActionButton(
    {
      label,
      kind,
      className,
      children,
      type = 'button',
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onFocus,
      onBlur,
      'aria-describedby': describedBy,
      ...props
    },
    ref
  ) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const tooltipRef = useRef<HTMLSpanElement | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const id = useId();
    useImperativeHandle(ref, () => buttonRef.current!, []);

    function close() {
      clearTimeout(timer.current);
      setOpen(false);
    }

    function show(delay = 0) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(true), delay);
    }

    useEffect(() => () => clearTimeout(timer.current), []);

    useEffect(() => {
      if (!open) return;
      const dismiss = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      };
      document.addEventListener('keydown', dismiss);
      return () => document.removeEventListener('keydown', dismiss);
    }, [open]);

    useClientLayoutEffect(() => {
      if (!open) return;
      const update = () => {
        const button = buttonRef.current?.getBoundingClientRect();
        const tooltip = tooltipRef.current?.getBoundingClientRect();
        if (!button || !tooltip) return;
        setPosition({
          left: Math.max(
            8,
            Math.min(button.x + (button.width - tooltip.width) / 2, innerWidth - tooltip.width - 8)
          ),
          top:
            button.bottom + tooltip.height + 6 <= innerHeight
              ? button.bottom + 6
              : button.top - tooltip.height - 6,
        });
      };
      update();
      window.addEventListener('resize', update);
      window.addEventListener('scroll', update, true);
      return () => {
        window.removeEventListener('resize', update);
        window.removeEventListener('scroll', update, true);
      };
    }, [open, label]);

    return (
      <>
        <button
          {...props}
          ref={buttonRef}
          type={type}
          data-lk={`${kind}-button`}
          className={clsx(styles.button, kind === 'language' && styles.language, className)}
          aria-label={label}
          aria-describedby={
            [describedBy, open ? id : undefined].filter(Boolean).join(' ') || undefined
          }
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            if (!event.defaultPrevented && event.pointerType !== 'touch') show(500);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            clearTimeout(timer.current);
            timer.current = setTimeout(close, 100);
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event);
            close();
          }}
          onFocus={(event) => {
            onFocus?.(event);
            if (!event.defaultPrevented && event.currentTarget.matches(':focus-visible')) show();
          }}
          onBlur={(event) => {
            onBlur?.(event);
            close();
          }}
        >
          {children}
        </button>
        {open &&
          createPortal(
            <span
              ref={tooltipRef}
              id={id}
              role="tooltip"
              data-lk="action-hint"
              className={styles.hint}
              style={position}
              onPointerEnter={() => {
                clearTimeout(timer.current);
              }}
              onPointerLeave={close}
            >
              {label}
            </span>,
            document.body
          )}
      </>
    );
  }
);
