import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react';
import { Select } from '@base-ui/react/select';
import clsx from 'clsx';
import Icon from '../Icon/index.js';
import styles from './styles.module.css';

export type DropdownSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type DropdownSelectProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'defaultValue' | 'name' | 'onChange' | 'type' | 'value'
> & {
  options: readonly DropdownSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  invalid?: boolean;
};

export type DropdownSelectFieldProps = DropdownSelectProps & {
  label: string;
  description?: string;
  error?: string;
  wrapperClassName?: string;
};

export const DropdownSelect = forwardRef<HTMLButtonElement, DropdownSelectProps>(
  function DropdownSelect(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      name,
      form,
      id,
      disabled,
      required,
      invalid,
      className,
      ...props
    },
    ref
  ) {
    const initialValue = useRef(defaultValue ?? null);
    const selectionRevision = useRef(0);
    const [uncontrolledValue, setUncontrolledValue] = useState(initialValue.current);
    const [triggerElement, setTriggerElement] = useState<HTMLButtonElement | null>(null);
    const controlled = value !== undefined;
    const selectedValue = controlled ? value : uncontrolledValue;
    // Native modal dialogs make body portals inert and place them behind the top layer.
    const portalContainer = triggerElement?.closest('dialog') ?? undefined;
    const triggerRef = useCallback(
      (element: HTMLButtonElement | null) => {
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
        setTriggerElement(element);
      },
      [ref]
    );

    useEffect(() => {
      const ownerForm = triggerElement?.form;
      if (controlled || !ownerForm) return;
      const pendingResets = new Set<ReturnType<typeof setTimeout>>();
      const reset = (event: Event) => {
        const revision = selectionRevision.current;
        // React's delegated reset handler can run after a native listener's microtasks.
        const timer = setTimeout(() => {
          pendingResets.delete(timer);
          if (!event.defaultPrevented && selectionRevision.current === revision) {
            selectionRevision.current += 1;
            setUncontrolledValue(initialValue.current);
          }
        }, 0);
        pendingResets.add(timer);
      };
      ownerForm.addEventListener('reset', reset);
      return () => {
        ownerForm.removeEventListener('reset', reset);
        pendingResets.forEach(clearTimeout);
      };
    }, [controlled, form, triggerElement]);

    return (
      <span className={styles.root} data-lk="dropdown-select">
        <Select.Root<string>
          items={options}
          value={selectedValue}
          onValueChange={(nextValue) => {
            if (typeof nextValue !== 'string') return;
            selectionRevision.current += 1;
            if (nextValue === selectedValue) return;
            if (!controlled) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue);
          }}
          id={id}
          name={name}
          form={form}
          disabled={disabled}
          required={required}
        >
          <Select.Trigger
            {...props}
            ref={triggerRef}
            id={id}
            form={form}
            className={clsx(styles.trigger, className)}
            data-lk="dropdown-select-trigger"
            aria-invalid={invalid || props['aria-invalid'] || undefined}
            aria-required={required || undefined}
          >
            <Select.Value
              className={(state) =>
                clsx(
                  styles.value,
                  !options.some((option) => option.value === state.value) && styles.placeholder
                )
              }
            >
              {(selectedValue) =>
                typeof selectedValue === 'string'
                  ? (options.find((option) => option.value === selectedValue)?.label ??
                    placeholder ??
                    selectedValue)
                  : placeholder
              }
            </Select.Value>
            <Select.Icon className={styles.icon}>
              <Icon icon="lucide:chevron-down" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal container={portalContainer}>
            <Select.Positioner
              className={styles.positioner}
              positionMethod="fixed"
              align="start"
              sideOffset={6}
              alignItemWithTrigger={false}
              collisionBoundary={portalContainer}
              collisionPadding={8}
            >
              <Select.Popup className={styles.popup} data-lk="dropdown-select-popup">
                <Select.List className={styles.list}>
                  {options.map((option) => (
                    <Select.Item
                      key={option.value}
                      className={styles.option}
                      value={option.value}
                      label={option.label}
                      disabled={option.disabled}
                      data-lk="dropdown-select-option"
                    >
                      <Select.ItemText className={styles.optionText}>
                        {option.label}
                      </Select.ItemText>
                      <Select.ItemIndicator className={styles.indicator} keepMounted>
                        <Icon icon="lucide:check" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </span>
    );
  }
);

export const DropdownSelectField = forwardRef<HTMLButtonElement, DropdownSelectFieldProps>(
  function DropdownSelectField(
    { label, description, error, wrapperClassName, id, invalid, ...props },
    ref
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const describedBy = [
      props['aria-describedby'],
      description && `${fieldId}-description`,
      error && `${fieldId}-error`,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={clsx(styles.field, wrapperClassName)} data-lk="field">
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
        <DropdownSelect
          {...props}
          ref={ref}
          id={fieldId}
          invalid={Boolean(error) || invalid}
          aria-describedby={describedBy || undefined}
        />
        {description && (
          <p id={`${fieldId}-description`} className={styles.description}>
            {description}
          </p>
        )}
        {error && (
          <p id={`${fieldId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default DropdownSelect;
