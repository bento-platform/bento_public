'use client';

/**
 * Routing for the single [[...slug]] catch-all page. The app itself is rendered by the root layout (which Next.js
 * doesn't remount on navigation); components read the URL with next/navigation's usePathname / useSearchParams.
 *
 * Navigation goes through the native History API rather than router.push / next/link: Next.js syncs pushState /
 * replaceState with its hooks (see node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md,
 * "Native History API"), whereas router.push would fetch the [[...slug]] segment from the server on every navigation
 * just to render nothing, then scroll to the top.
 *
 * TEMPORARY until the app moves to file-based routes, at which point next/link and router.push can be used directly.
 */

import { type AnchorHTMLAttributes, type MouseEvent, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { getPathPageIndex, pathParts } from '@/utils/router';
import { BentoRoute } from '@/types/routes';

export const navigate = (url: string, { replace = false }: { replace?: boolean } = {}) => {
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
};

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; replace?: boolean };

/** Anchor that navigates client-side; modified / non-left clicks and other targets fall through to the browser. */
export const Link = ({ href, replace, onClick, target, children, ...rest }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || (target && target !== '_self')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href, { replace });
  };
  return (
    <a {...rest} href={href} target={target} onClick={handleClick}>
      {children}
    </a>
  );
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
  const pathname = usePathname();
  return useMemo(() => matchRoute(pathname), [pathname]);
};
