import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ParamsInit = URLSearchParams | [string, string][];
type ParamsUpdater = ParamsInit | ((prev: URLSearchParams) => ParamsInit);

export interface SetSearchParamsOptions {
  replace?: boolean;
}

/**
 * next/navigation's useSearchParams() is read-only, unlike react-router's (which returns a
 * [searchParams, setSearchParams] tuple). This reproduces that tuple - including setSearchParams accepting
 * either a next-params value or a (prev) => next-params updater, same as react-router - on top of
 * usePathname()/useRouter(), so call sites written against react-router's API only need an import swap.
 */
export const useSearchParamsWriter = (): [
  URLSearchParams,
  (init: ParamsUpdater, options?: SetSearchParamsOptions) => void,
] => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = useCallback(
    (init: ParamsUpdater, options: SetSearchParamsOptions = {}) => {
      const resolved = typeof init === 'function' ? init(new URLSearchParams(searchParams)) : init;
      const next = resolved instanceof URLSearchParams ? resolved : new URLSearchParams(resolved);
      const qs = next.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      if (options.replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    },
    [searchParams, pathname, router]
  );

  return useMemo(() => [searchParams, setSearchParams], [searchParams, setSearchParams]);
};
