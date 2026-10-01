import { useCallback, useEffect, useRef } from 'react';

/**
 * Debounce / throttle function creator hook, shared by useDebounce and useThrottle.
 * @param callback - The function to debounce.
 * @param delay - How long to delay the debounced call.
 * @param maxDelay - If set, turns the returned function into a throttled function (throttled to every maxDelay ms).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounceOrThrottle = <T extends (...args: any[]) => void>(callback: T, delay: number, maxDelay?: number) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutLastFired = useRef<number>(null);
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeoutLastFired.current = null;
  }, []);
  return useCallback(
    (...args: Parameters<T>) => {
      const nextDelay = Math.min(
        delay,
        timeoutLastFired.current && maxDelay ? timeoutLastFired.current + maxDelay - Date.now() : 999999999999999
      );

      if (!timeout.current || nextDelay === delay) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          timeout.current = null;
          timeoutLastFired.current = Date.now();
          return callback(...args);
        }, nextDelay);
      }
      // Otherwise, we've hit maxDelay, so we need to wait for the current interval to fire
    },
    [callback, delay, maxDelay]
  );
};

/**
 * Debounce function creator hook.
 * @param callback - The function to debounce.
 * @param delay - How long to delay the debounced call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delay: number) =>
  useDebounceOrThrottle(callback, delay);

/**
 * Throttle function creator hook.
 * @param callback - The function to throttle.
 * @param delay - How long to delay the throttled call.
 * @param maxDelay - Throttle the returned function to every maxDelay ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(callback: T, delay: number, maxDelay: number) =>
  useDebounceOrThrottle(callback, delay, maxDelay);
