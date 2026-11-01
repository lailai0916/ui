import { useEffect } from 'react';
import { loadIcons } from '@iconify/react';
import { useLaikit } from '../../provider.js';
import { useClipboard, type ClipboardValue } from '../../hooks/useClipboard.js';
import Button, { type ButtonProps } from '../Button/index.js';
import Icon from '../Icon/index.js';
import IconButton from '../IconButton/index.js';
import styles from './styles.module.css';

export type CopyButtonProps = Omit<
  ButtonProps,
  'children' | 'onClick' | 'leftIcon' | 'size' | 'value'
> & {
  value: ClipboardValue;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  onCopied?: () => void;
  onError?: (error: unknown) => void;
};

export default function CopyButton({
  value,
  label,
  copiedLabel,
  errorLabel,
  onCopied,
  onError,
  disabled,
  size = 'sm',
  iconOnly = false,
  variant,
  rounded,
  active,
  fullWidth,
  ...props
}: CopyButtonProps) {
  const { locale } = useLaikit();
  const chinese = locale.startsWith('zh');
  const { status, copy, reset } = useClipboard();
  useEffect(() => {
    reset();
  }, [value, reset]);
  useEffect(() => {
    loadIcons(['lucide:clipboard', 'lucide:check', 'lucide:x']);
  }, []);
  const text =
    status === 'copied'
      ? (copiedLabel ?? (chinese ? '已复制' : 'Copied'))
      : status === 'error'
        ? (errorLabel ?? (chinese ? '复制失败' : 'Copy failed'))
        : (label ?? (chinese ? '复制' : 'Copy'));
  const icon = (
    <Icon
      icon={
        status === 'copied' ? 'lucide:check' : status === 'error' ? 'lucide:x' : 'lucide:clipboard'
      }
      aria-hidden="true"
    />
  );
  async function onClick() {
    const result = await copy(value);
    if (result.copied) onCopied?.();
    else if ('failed' in result) onError?.(result.error);
  }
  const unavailable = disabled || (typeof value === 'string' && !value);
  if (iconOnly) {
    return (
      <IconButton
        {...props}
        size={size === 'lg' ? 'md' : size}
        label={text}
        disabled={Boolean(unavailable)}
        onClick={() => void onClick()}
      >
        {icon}
        <span className={styles.status} role="status" aria-live="polite">
          {status === 'idle' ? '' : text}
        </span>
      </IconButton>
    );
  }
  return (
    <Button
      {...props}
      variant={variant}
      rounded={rounded}
      active={active}
      fullWidth={fullWidth}
      size={size === 'xs' ? 'sm' : size}
      disabled={Boolean(unavailable)}
      onClick={() => void onClick()}
      aria-live="polite"
      leftIcon={icon}
    >
      {text}
    </Button>
  );
}
