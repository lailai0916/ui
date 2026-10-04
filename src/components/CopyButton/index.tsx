import { useEffect, useRef, useState } from 'react';
import { useLaikit } from '../../provider.js';
import Button, { type ButtonProps } from '../Button/index.js';
import Icon from '../Icon/index.js';

export type CopyButtonProps = Omit<ButtonProps, 'children' | 'onClick' | 'leftIcon'> & {
  value: string;
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
  ...props
}: CopyButtonProps) {
  const { locale } = useLaikit();
  const chinese = locale.startsWith('zh');
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(value);
      } catch {
        const previousFocus = document.activeElement;
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        try {
          textarea.select();
          if (!document.execCommand('copy')) throw new Error('Copy failed');
        } finally {
          textarea.remove();
          if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
            previousFocus.focus();
        }
      }
      if (mounted.current) setStatus('copied');
      onCopied?.();
    } catch (error) {
      if (mounted.current) setStatus('error');
      onError?.(error);
    }
    if (mounted.current) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus('idle'), 1500);
    }
  };

  const text =
    status === 'copied'
      ? (copiedLabel ?? (chinese ? '已复制' : 'Copied'))
      : status === 'error'
        ? (errorLabel ?? (chinese ? '复制失败' : 'Copy failed'))
        : (label ?? (chinese ? '复制' : 'Copy'));

  return (
    <Button
      {...props}
      size={size}
      disabled={disabled || !value}
      onClick={() => void copy()}
      aria-live="polite"
      leftIcon={<Icon icon={status === 'copied' ? 'lucide:check' : 'lucide:copy'} />}
    >
      {text}
    </Button>
  );
}
