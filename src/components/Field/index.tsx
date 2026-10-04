import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import { useLaikit } from '../../provider.js';
import Icon from '../Icon/index.js';
import IconButton from '../IconButton/index.js';
import styles from './styles.module.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  monospace?: boolean;
};
export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  monospace?: boolean;
};
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };
export type PasswordInputProps = Omit<InputProps, 'type'> & {
  showLabel?: string;
  hideLabel?: string;
};
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  description?: ReactNode;
};
export type RadioProps = CheckboxProps;

type FieldCopy = {
  description?: string;
  error?: string;
  label: string;
  wrapperClassName?: string;
};
export type TextFieldProps = InputProps & FieldCopy;
export type TextAreaFieldProps = TextAreaProps & FieldCopy;
export type SelectFieldProps = SelectProps & FieldCopy;
export type PasswordFieldProps = PasswordInputProps & FieldCopy;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, monospace, ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      data-lk="field-control"
      className={clsx(styles.fieldControl, monospace && styles.monospace, className)}
      aria-invalid={invalid ? true : props['aria-invalid']}
    />
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, invalid, monospace, ...props },
  ref
) {
  return (
    <textarea
      {...props}
      ref={ref}
      data-lk="field-control"
      className={clsx(styles.fieldControl, monospace && styles.monospace, className)}
      aria-invalid={invalid ? true : props['aria-invalid']}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, ...props },
  ref
) {
  return (
    <span className={styles.fieldSelect}>
      <select
        {...props}
        ref={ref}
        data-lk="field-control"
        className={clsx(styles.fieldControl, className)}
        aria-invalid={invalid ? true : props['aria-invalid']}
      />
      <svg aria-hidden="true" viewBox="0 0 16 16">
        <path d="m4.5 6 3.5 3.5L11.5 6" />
      </svg>
    </span>
  );
});

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showLabel, hideLabel, disabled, className, ...props }, ref) {
    const { locale } = useLaikit();
    const [visible, setVisible] = useState(false);
    const actionLabel = visible
      ? (hideLabel ?? (locale.startsWith('zh') ? '隐藏密码' : 'Hide password'))
      : (showLabel ?? (locale.startsWith('zh') ? '显示密码' : 'Show password'));

    return (
      <span className={styles.password}>
        <Input
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          {...props}
          ref={ref}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          className={clsx(styles.passwordControl, className)}
        />
        <IconButton
          size="sm"
          label={actionLabel}
          disabled={disabled}
          aria-pressed={visible}
          className={styles.passwordToggle}
          onClick={() => setVisible((current) => !current)}
        >
          <Icon icon={visible ? 'lucide:eye-off' : 'lucide:eye'} />
        </IconButton>
      </span>
    );
  }
);

const Choice = forwardRef<HTMLInputElement, CheckboxProps & { type: 'checkbox' | 'radio' }>(
  function Choice({ className, description, id, label, ...props }, ref) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const describedBy = [props['aria-describedby'], descriptionId].filter(Boolean).join(' ');
    return (
      <label htmlFor={controlId} data-lk={props.type} className={clsx(styles.choice, className)}>
        <input
          {...props}
          ref={ref}
          id={controlId}
          className={styles.choiceControl}
          aria-describedby={describedBy || undefined}
        />
        <span className={styles.choiceCopy}>
          <span>{label}</span>
          {description && (
            <span id={descriptionId} className={styles.fieldDescription}>
              {description}
            </span>
          )}
        </span>
      </label>
    );
  }
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Choice {...props} ref={ref} type="checkbox" />;
});
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  return <Choice {...props} ref={ref} type="radio" />;
});

function FieldFrame({
  children,
  description,
  error,
  id,
  label,
  wrapperClassName,
}: FieldCopy & { children: ReactNode; id: string }) {
  return (
    <div data-lk="field" className={clsx(styles.field, wrapperClassName)}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      {children}
      {description && (
        <p id={`${id}-description`} className={styles.fieldDescription}>
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function useField({
  description,
  error,
  id,
  'aria-describedby': describedBy,
}: FieldCopy & { id?: string; 'aria-describedby'?: string }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return {
    id: fieldId,
    'aria-describedby':
      [describedBy, description && `${fieldId}-description`, error && `${fieldId}-error`]
        .filter(Boolean)
        .join(' ') || undefined,
    invalid: Boolean(error),
  };
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { description, error, label, wrapperClassName, ...props },
  ref
) {
  const field = useField({ ...props, description, error, label });
  return (
    <FieldFrame
      {...field}
      wrapperClassName={wrapperClassName}
      label={label}
      description={description}
      error={error}
    >
      <Input {...props} {...field} invalid={field.invalid || props.invalid} ref={ref} />
    </FieldFrame>
  );
});

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ description, error, label, wrapperClassName, ...props }, ref) {
    const field = useField({ ...props, description, error, label });
    return (
      <FieldFrame
        {...field}
        wrapperClassName={wrapperClassName}
        label={label}
        description={description}
        error={error}
      >
        <TextArea {...props} {...field} invalid={field.invalid || props.invalid} ref={ref} />
      </FieldFrame>
    );
  }
);

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { description, error, label, wrapperClassName, ...props },
  ref
) {
  const field = useField({ ...props, description, error, label });
  return (
    <FieldFrame
      {...field}
      wrapperClassName={wrapperClassName}
      label={label}
      description={description}
      error={error}
    >
      <Select {...props} {...field} invalid={field.invalid || props.invalid} ref={ref} />
    </FieldFrame>
  );
});

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ description, error, label, wrapperClassName, ...props }, ref) {
    const field = useField({ ...props, description, error, label });
    return (
      <FieldFrame
        {...field}
        wrapperClassName={wrapperClassName}
        label={label}
        description={description}
        error={error}
      >
        <PasswordInput {...props} {...field} invalid={field.invalid || props.invalid} ref={ref} />
      </FieldFrame>
    );
  }
);
