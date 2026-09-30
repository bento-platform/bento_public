import { useDebouncedCallback } from './debounce';

/**
 * Throttle function creator hook. The returned function calls `callback` at most once every `interval` ms: the first
 * call in a burst fires immediately, and the last call made during each interval fires when it ends.
 * @param callback - The function to throttle.
 * @param interval - Minimum time between calls, in ms.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(callback: T, interval: number) =>
  useDebouncedCallback(callback, interval, { leading: true, maxWait: interval });
