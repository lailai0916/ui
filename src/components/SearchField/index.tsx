import { useRef, type ComponentProps, type ReactNode } from 'react';
import clsx from 'clsx';
import { useLaikit } from '../../provider.js';
import { Input, InputGroup } from '../Field/index.js';
import Icon from '../Icon/index.js';
import IconButton from '../IconButton/index.js';
import styles from './styles.module.css';

export type SearchFieldProps = Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'prefix'
> & {
  value: string;
  onValueChange: (value: string) => void;
  prefix?: ReactNode;
  clearLabel?: string;
};

export default function SearchField({
  value,
  onValueChange,
  prefix,
  clearLabel,
  className,
  ...props
}: SearchFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { messages } = useLaikit();
  return (
    <InputGroup
      className={clsx(styles.search, className)}
      invalid={props.invalid}
      disabled={props.disabled}
    >
      <Icon icon="lucide:search" className={styles.icon} aria-hidden="true" />
      {prefix}
      <Input
        {...props}
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {value && (
        <IconButton
          size="xs"
          label={clearLabel ?? messages.clearSearch}
          disabled={props.disabled || props.readOnly}
          onClick={() => {
            onValueChange('');
            ref.current?.focus();
          }}
        >
          <Icon icon="lucide:x" width={16} height={16} aria-hidden="true" />
        </IconButton>
      )}
    </InputGroup>
  );
}
