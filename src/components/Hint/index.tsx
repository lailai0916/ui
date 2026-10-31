import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  onlyWhenTruncated?: boolean;
  truncationTarget?: string;
};

const HintAncestorContext = createContext<(() => void) | null>(null);

export default function Hint({
  label,
  children,
  side = 'bottom',
  delay = 500,
  disabled = false,
  onlyWhenTruncated = false,
  truncationTarget,
  id: providedId,
  className,
  ...props
}: HintProps) {
  const dismissAncestor = useContext(HintAncestorContext);
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const triggerRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<TooltipPrimitive.Root.Actions | null>(null);
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const dismiss = useCallback(() => {
    setOpen(false);
    dismissAncestor?.();
  }, [dismissAncestor]);
  const describedBy = [children.props['aria-describedby'], open ? id : undefined]
    .filter(Boolean)
    .join(' ');

  const getTruncationElement = () => {
    const trigger = triggerRef.current;
    return truncationTarget ? trigger?.querySelector<HTMLElement>(truncationTarget) : trigger;
  };
  const isTruncated = () => {
    const element = getTruncationElement();
    return (
      !!element &&
      (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)
    );
  };

  useEffect(() => {
    if (!open || !onlyWhenTruncated) return undefined;
    const trigger = triggerRef.current;
    const element = truncationTarget
      ? trigger?.querySelector<HTMLElement>(truncationTarget)
      : trigger;
    if (!element) {
      setOpen(false);
      return undefined;
    }
    const check = () => {
      if (
        element.scrollWidth <= element.clientWidth &&
        element.scrollHeight <= element.clientHeight
      ) {
        setOpen(false);
      }
    };
    check();
    const resizeObserver = new ResizeObserver(check);
    const mutationObserver = new MutationObserver(check);
    resizeObserver.observe(element);
    mutationObserver.observe(element, { childList: true, characterData: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [open, onlyWhenTruncated, truncationTarget, label]);

  return (
    <HintAncestorContext.Provider value={dismiss}>
      <TooltipPrimitive.Provider delay={delay}>
        <TooltipPrimitive.Root
          actionsRef={actionsRef}
          open={open}
          disabled={disabled || !label}
          onOpenChange={(next, details) => {
            if (next && onlyWhenTruncated && !isTruncated()) {
              details.cancel();
              return;
            }
            if (details.reason === 'escape-key') {
              // Leave Escape's default action available to native dialogs as well.
              details.cancel();
              details.allowPropagation();
              actionsRef.current?.close();
              return;
            }
            if (next) {
              // A focused row yields when a nested pointer hint opens.
              dismissAncestor?.();
              // Keep hints inside a native dialog's top layer when their trigger is modal.
              setContainer(triggerRef.current?.closest('dialog') ?? null);
            }
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
    </HintAncestorContext.Provider>
  );
}
