import { useCallback, useEffect, useRef, useState } from 'react';
import { writeClipboard } from '../utils/clipboard.js';

export type ClipboardValue = string | (() => string | Promise<string>);
export type ClipboardStatus = 'idle' | 'copied' | 'error';

export function useClipboard({ resetAfter = 2000 }: { resetAfter?: number } = {}) {
  const [status, setStatus] = useState<ClipboardStatus>('idle');
  const request = useRef(0);
  const mounted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reset = useCallback(() => {
    request.current++;
    clearTimeout(timer.current);
    setStatus('idle');
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current++;
      clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    async (value: ClipboardValue) => {
      const current = ++request.current;
      clearTimeout(timer.current);
      let error: unknown;
      let failed = false;
      try {
        const result = typeof value === 'function' ? value() : value;
        // Keep ready text inside the click's activation; only await genuinely deferred sources.
        const text = typeof result === 'string' ? result : await result;
        if (!mounted.current || current !== request.current) return { copied: false };
        await writeClipboard(text);
      } catch (cause) {
        failed = true;
        error = cause;
      }
      if (!mounted.current || current !== request.current) return { copied: false };
      setStatus(failed ? 'error' : 'copied');
      timer.current = setTimeout(() => setStatus('idle'), resetAfter);
      return failed ? { copied: false, failed: true, error } : { copied: true };
    },
    [resetAfter]
  );

  return { status, copy, reset };
}
