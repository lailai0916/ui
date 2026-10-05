import {
  cloneElement,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import styles from './styles.module.css';

export type HintProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label: string;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
};

export default function Hint({
  label,
  children,
  side = 'bottom',
  delay = 500,
  disabled = false,
  id: providedId,
  className,
  ...props
}: HintProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const triggerRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<TooltipPrimitive.Root.Actions | null>(null);
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const describedBy = [children.props['aria-describedby'], open ? id : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <TooltipPrimitive.Provider delay={delay}>
      <TooltipPrimitive.Root
        actionsRef={actionsRef}
        disabled={disabled || !label}
        onOpenChange={(next, details) => {
          if (details.reason === 'escape-key') {
            // Leave Escape's default action available to native dialogs as well.
            details.cancel();
            details.allowPropagation();
            actionsRef.current?.close();
            return;
          }
          // Keep hints inside a native dialog's top layer when their trigger is modal.
          if (next) setContainer(triggerRef.current?.closest('dialog') ?? null);
          setOpen(next);
        }}
      >
        <TooltipPrimitive.Trigger
          ref={(element: HTMLElement | null) => {
            triggerRef.current = element;
          }}
          render={cloneElement(children, {
            title: undefined,
            'aria-describedby': describedBy || undefined,
          })}
          aria-describedby={describedBy || undefined}
          closeDelay={100}
        />
        <TooltipPrimitive.Portal container={container ?? undefined}>
          <TooltipPrimitive.Positioner
            side={side}
            sideOffset={6}
            collisionPadding={8}
            positionMethod="fixed"
            className={styles.positioner}
          >
            <TooltipPrimitive.Popup
              data-lk="hint"
              {...props}
              id={id}
              role="tooltip"
              className={clsx(styles.hint, className)}
            >
              {label}
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
