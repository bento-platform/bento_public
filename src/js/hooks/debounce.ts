import { useCallback, useEffect, useRef } from 'react';

/**
 * Debounce function creator hook. The returned function calls `callback` once calls have stopped for `delay` ms, with
 * the arguments of the last call.
 * @param callback - The function to debounce.
 * @param delay - How long to wait after the last call, in ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
    };
  }, []);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        timeout.current = null;
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
