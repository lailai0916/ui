import { useCallback, useEffect, useRef, useState } from 'react';

const IMAGE_LOAD_TIMEOUT_MS = 3000;

export type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Track an `<img>`'s load state with a timeout fallback to `error`.
 *
 * If the browser finished loading before React attached its handlers (common on
 * SSR + fast cache hits), `onLoad`/`onError` never fire — so we sync from the
 * DOM via the ref. Lazy images start their timeout on entering the viewport.
 * Attach `imgRef` to the image and wire `onLoad`/`onError` to its handlers.
 */
export function useImageStatus(image?: string) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const [state, setState] = useState<{ image?: string; status: ImageStatus }>({
    image,
    status: image ? 'loading' : 'error',
  });
  const status = state.image === image ? state.status : image ? 'loading' : 'error';
  const settle = useCallback(
    (nextStatus: ImageStatus) => {
      cleanupRef.current?.();
      setState({ image, status: nextStatus });
    },
    [image]
  );

  useEffect(() => {
    if (!image) {
      settle('error');
      return;
    }
    const img = imgRef.current;
    if (img?.complete) {
      settle(img.naturalWidth > 0 ? 'loaded' : 'error');
      return;
    }
    let timer: number | undefined;
    let observer: IntersectionObserver | undefined;
    const cleanup = () => {
      observer?.disconnect();
      window.clearTimeout(timer);
    };
    cleanupRef.current = cleanup;
    const startTimeout = () => {
      observer?.disconnect();
      timer = window.setTimeout(() => settle('error'), IMAGE_LOAD_TIMEOUT_MS);
    };

    if (img?.loading === 'lazy' && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) startTimeout();
      });
      observer.observe(img);
    } else {
      startTimeout();
    }

    return () => {
      cleanup();
      if (cleanupRef.current === cleanup) cleanupRef.current = undefined;
    };
  }, [image, settle]);

  return {
    imgRef,
    status,
    onLoad: () => settle('loaded'),
    onError: () => settle('error'),
  };
}
