'use client';

/**
 * Minimal client-side routing layer on top of the History API, which Next.js's app router patches so that
 * usePathname / useSearchParams stay in sync with pushState / replaceState (see
 * node_modules/next/dist/docs/01-app/02-guides/single-page-applications.md).
 *
 * We deliberately do not use next/navigation's router.push here: the whole app lives under a single
 * [[...slug]] catch-all page, and a router.push would change that segment's key and remount the whole tree.
 */

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';

import { getPathPageIndex, pathParts } from '@/utils/router';
import { BentoRoute } from '@/types/routes';

export interface RouterLocation {
  pathname: string;
  search: string;
  hash: string;
}

export interface NavigateOptions {
  replace?: boolean;
  /** Resolve a relative `to` against the current path's segments ('..' pops one segment). */
  relative?: 'path' | 'route';
}

const SERVER_LOCATION: RouterLocation = { pathname: '/', search: '', hash: '' };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

let cachedLocation: RouterLocation | null = null;

const getLocationSnapshot = (): RouterLocation => {
  const { pathname, search, hash } = window.location;

  // useSyncExternalStore needs a referentially-stable snapshot while nothing has changed.
  if (
    cachedLocation &&
    cachedLocation.pathname === pathname &&
    cachedLocation.search === search &&
    cachedLocation.hash === hash
  ) {
    return cachedLocation;
  }

  cachedLocation = { pathname, search, hash };
  return cachedLocation;
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener('popstate', emit);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('popstate', emit);
  };
};

export const useLocation = (): RouterLocation =>
  useSyncExternalStore(subscribe, getLocationSnapshot, () => SERVER_LOCATION);

const resolveUrl = (to: string): string => {
  if (to.startsWith('/')) return to;
  if (to.startsWith('?')) return window.location.pathname + to;
  if (to.startsWith('#')) return window.location.pathname + window.location.search + to;

  // Relative path: resolve against the current path's segments, ignoring any trailing slash.
  const m = /^([^?#]*)(.*)$/.exec(to)!;
  const segments = window.location.pathname.replace(/\/+$/, '').split('/');
  for (const part of m[1].split('/')) {
    if (part === '..') segments.pop();
    else if (part !== '.' && part !== '') segments.push(part);
  }
  return (segments.join('/') || '/') + m[2];
};

export const navigate = (to: string, { replace = false }: NavigateOptions = {}) => {
  const url = resolveUrl(to);
  if (replace) {
    window.history.replaceState(null, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
  emit();
};

/** Returns a stable navigate function. */
export const useNavigate = () => navigate; // eslint-disable-line react-x/no-unnecessary-use-prefix

type SearchParamsInit = URLSearchParams | string[][] | Record<string, string>;
type SearchParamsNext = SearchParamsInit | ((prev: URLSearchParams) => SearchParamsInit);

const withDefaults = (searchString: string, defaultsString: string) => {
  const params = new URLSearchParams(searchString);
  const defaults = new URLSearchParams(defaultsString);
  defaults.forEach((_, key) => {
    if (!params.has(key)) defaults.getAll(key).forEach((v) => params.append(key, v));
  });
  return params;
};

/**
 * Mirrors react-router's useSearchParams: `defaultInit` supplies values for keys missing from the URL, and the setter
 * navigates to the current path with the new query string.
 */
export const useSearchParams = (defaultInit?: SearchParamsInit) => {
  const { search } = useLocation();

  // Defaults are usually a fresh object each render, so key everything off their serialized form.
  const defaultsString = defaultInit ? new URLSearchParams(defaultInit).toString() : '';
  const defaultsRef = useRef(defaultsString);
  useEffect(() => {
    defaultsRef.current = defaultsString;
  }, [defaultsString]);

  const searchParams = useMemo(() => withDefaults(search, defaultsString), [search, defaultsString]);

  const setSearchParams = useCallback((next: SearchParamsNext, options?: NavigateOptions) => {
    const prev = withDefaults(window.location.search, defaultsRef.current);
    const params = new URLSearchParams(typeof next === 'function' ? next(prev) : next);
    const qs = params.toString();
    navigate(window.location.pathname + (qs ? `?${qs}` : ''), options);
  }, []);

  return [searchParams, setSearchParams] as const;
};

export interface RouteMatch {
  lang?: string;
  projectId?: string;
  datasetId?: string;
  /** One of BentoRoute's values, or BentoRoute.NotFound if the path doesn't match any known page. */
  page: string;
  packetId?: string;
  tab?: string;
}

/**
 * Parses a pathname of the form /:lang[/(p|d)/:id][/<page>[/...]] into its params and page; replaces react-router's
 * <Routes>/useParams matching. Unknown or malformed paths get page === BentoRoute.NotFound.
 */
export const matchRoute = (pathname: string): RouteMatch => {
  const parts = pathParts(pathname);
  const lang = parts[0] || undefined;
  const match: RouteMatch = { lang, page: BentoRoute.NotFound };

  const scoped = parts[1] === 'p' || parts[1] === 'd';
  if (scoped) {
    if (!parts[2]) return match;
    if (parts[1] === 'p') match.projectId = parts[2];
    else match.datasetId = parts[2];
  }

  const rest = parts.slice(getPathPageIndex(parts));
  while (rest.length && rest[rest.length - 1] === '') rest.pop();

  const [page, ...args] = rest;

  if (page === undefined) {
    match.page = BentoRoute.Explore;
  } else if (page === BentoRoute.Explore || page === BentoRoute.About || page === BentoRoute.Beacon) {
    if (args.length === 0) match.page = page;
  } else if (page === BentoRoute.BeaconNetwork) {
    // Beacon network is only available at the top level - scoping does not make sense for it.
    if (args.length === 0 && !scoped) match.page = page;
  } else if (page === BentoRoute.Phenopackets) {
    if (args.length === 1 || args.length === 2) {
      match.page = page;
      [match.packetId, match.tab] = args;
    }
  }

  return match;
};

export const useRouteMatch = (): RouteMatch => {
  const { pathname } = useLocation();
  return useMemo(() => matchRoute(pathname), [pathname]);
};

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  replace?: boolean;
  children?: ReactNode;
};

/** Client-side-navigating anchor; falls through to normal browser behaviour for modified / non-left clicks. */
export const Link = ({ to, replace, onClick, target, children, ...rest }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      (target && target !== '_self') ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a {...rest} href={to} target={target} onClick={handleClick}>
      {children}
    </a>
  );
};
