import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type DialogProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'open' | 'onClose' | 'onCancel'
> & {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
};

export default function Dialog({
  open,
  onClose,
  label,
  children,
  className,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pointerStartedOutside = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const ownerDocument = dialog.ownerDocument;
    const previousOverflow = ownerDocument.body.style.overflow;
    const previousFocus = ownerDocument.activeElement;
    dialog.showModal();
    ownerDocument.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      ownerDocument.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [open]);

  return (
    <dialog
      {...props}
      ref={ref}
      data-lk="dialog"
      aria-label={label}
      aria-modal="true"
      className={clsx(styles.dialog, className)}
      onClose={(event) => {
        if (open && !event.currentTarget.open) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        pointerStartedOutside.current =
          event.target === event.currentTarget &&
          (event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom);
        props.onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        if (
          pointerStartedOutside.current &&
          event.target === event.currentTarget &&
          (event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom)
        )
          onClose();
        pointerStartedOutside.current = false;
        props.onPointerUp?.(event);
      }}
    >
      {children}
    </dialog>
  );
}
