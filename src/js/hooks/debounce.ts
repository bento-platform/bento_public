import { useCallback, useEffect, useRef } from 'react';

type DebounceOptions = {
  /** Call immediately at the start of a burst of calls, rather than only after it. */
  leading?: boolean;
  /** Longest time a call can be held back during a continuous burst of calls, in ms. */
  maxWait?: number;
};

/**
 * Shared implementation behind useDebounce and useThrottle. Calls `callback` with the latest arguments once calls have
 * stopped for `wait` ms, optionally also at the start of a burst (`leading`) and at least every `maxWait` ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  wait: number,
  { leading = false, maxWait }: DebounceOptions = {}
) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowStart = useRef(0);
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
      const fire = () => {
        const latestArgs = pendingArgs.current;
        pendingArgs.current = null;
        if (!latestArgs) {
          timeout.current = null; // quiet for a whole window, so the burst is over
          return;
        }
        callback(...latestArgs);
        // Keep a window open after calling, so calls straight after are delayed rather than treated as a new burst
        windowStart.current = Date.now();
        timeout.current = setTimeout(fire, wait);
      };

      const now = Date.now();
      if (timeout.current) {
        clearTimeout(timeout.current);
        pendingArgs.current = args;
      } else {
        windowStart.current = now;
        if (leading) callback(...args);
        else pendingArgs.current = args;
      }

      const delay = maxWait === undefined ? wait : Math.min(wait, windowStart.current + maxWait - now);
      timeout.current = setTimeout(fire, Math.max(0, delay));
    },
    [callback, wait, leading, maxWait]
  );
};

/**
 * Debounce function creator hook. The returned function calls `callback` once calls have stopped for `delay` ms, with
 * the arguments of the last call.
 * @param callback - The function to debounce.
 * @param delay - How long to wait after the last call, in ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) =>
  useDebouncedCallback(callback, delay);
