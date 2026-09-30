import { useCallback, useEffect, useRef } from 'react';

/**
 * Throttle function creator hook. The returned function calls `callback` at most once every `interval` ms: the first
 * call in a window fires immediately, and the last call made during the window fires once it ends, with its arguments.
 * @param callback - The function to throttle.
 * @param interval - Minimum time between calls, in ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(callback: T, interval: number) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFired = useRef(0);
  const pendingArgs = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
      pendingArgs.current = null;
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const remaining = lastFired.current + interval - Date.now();

      if (remaining <= 0) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = null;
        pendingArgs.current = null;
        lastFired.current = Date.now();
        callback(...args);
        return;
      }

      // Inside the window: remember the latest arguments and make sure a trailing call is scheduled
      pendingArgs.current = args;
      if (!timeout.current) {
        timeout.current = setTimeout(() => {
          timeout.current = null;
          lastFired.current = Date.now();
          const latestArgs = pendingArgs.current;
          pendingArgs.current = null;
          if (latestArgs) callback(...latestArgs);
        }, remaining);
      }
    },
    [callback, interval]
  );
};
