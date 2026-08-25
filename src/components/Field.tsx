import {
  useId,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

type FieldCopy = {
  description?: string;
  error?: string;
  label: string;
};

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldCopy;
type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldCopy;
type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & FieldCopy;

function FieldFrame({
  children,
  description,
  error,
  id,
  label,
}: FieldCopy & { children: React.ReactNode; id: string }) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className="lui-field" htmlFor={id}>
      <span className="lui-field__label">{label}</span>
      {children}
      {description && (
        <p id={descriptionId} className="lui-field__description">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="lui-field__error" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export function TextField({ description, error, id, label, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [description && `${fieldId}-description`, error && `${fieldId}-error`]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <input
        {...props}
        id={fieldId}
        className="lui-field__control"
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
      />
    </FieldFrame>
  );
}

export function TextAreaField({ description, error, id, label, ...props }: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [description && `${fieldId}-description`, error && `${fieldId}-error`]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <textarea
        {...props}
        id={fieldId}
        className="lui-field__control"
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
      />
    </FieldFrame>
  );
}

export function SelectField({ description, error, id, label, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = [description && `${fieldId}-description`, error && `${fieldId}-error`]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <select
        {...props}
        id={fieldId}
        className="lui-field__control"
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
      />
    </FieldFrame>
  );
}
