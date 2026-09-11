import { type ReactNode, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  BookOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  ShareAltOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import BeaconLogo from '@/components/Beacon/BeaconLogo';

import { CATALOGUE_SEARCH_STORAGE_KEY } from '@/features/catalogue/useCatalogueUrlSync';
import { FORCE_CATALOGUE } from '@/config';
import { useMetadata, useScopeHasData, useSelectedScope } from '@/features/metadata/hooks';
import { type DiscoveryScope, selectScope } from '@/features/metadata/metadata.store';
import type { MenuItem } from '@/types/navigation';
import { BentoRoute } from '@/types/routes';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { scopeSelectionToUrl, scopeToUrl, useCurrentPage } from '@/utils/router';
import { useAppRouter, useLangHref } from '@/hooks/useAppRouter';

export const useNavigateToRoot = () => {
  const router = useAppRouter();
  return useCallback(() => router.push('/'), [router]);
};

/**
 * Like useNavigateToRoot, but for "back to catalogue" links: restores the catalogue's last query
 * string (facet filters, search, sort, view) from sessionStorage, since this is a fresh navigation
 * rather than a browser-history pop and would otherwise land on the catalogue with no filters applied.
 *
 * Dispatches the blank scope synchronously before navigating, same as useNavigateToScope: otherwise
 * ScopedRoute's URL/scope reconciliation effect briefly sees the *old* (dataset/project) scope next to
 * the new blank-scope URL, decides they mismatch, and replaces the URL back to the old scoped path -
 * clobbering the restored query string.
 */
export const useNavigateToCatalogue = () => {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(selectScope({}));
    const search = sessionStorage.getItem(CATALOGUE_SEARCH_STORAGE_KEY) ?? '';
    router.push('/' + search);
  }, [dispatch, router]);
};

export interface NavigateToScopeOptions {
  replace?: boolean;
  // Tags the destination URL so the scope's back button can tell it was reached from the parent project's own
  // page (rather than from the catalogue), in which case it should go back there instead of to the catalogue.
  // A query param rather than router history state, since next/navigation's router has no state mechanism.
  fromProjectScope?: boolean;
}

/**
 * The purpose of useNavigateToScope is to provide a `navigate(...)`-like hook which goes to a possibly-new scope, and
 * sets the Redux scope at the same time as setting the URL to prevent weird state-update / URL-update race conditions
 * with downstream search processing.
 */
export const useNavigateToScope = () => {
  const router = useAppRouter();
  const dispatch = useAppDispatch();

  return useCallback(
    (
      newScope: DiscoveryScope,
      suffix: string = '',
      fixedProjectAndDataset: boolean = false,
      options: NavigateToScopeOptions = {}
    ) => {
      // This action will internally handle already-equal scope selections to avoid accidental re-renders:
      dispatch(selectScope(newScope));
      const url = scopeToUrl(newScope, suffix, fixedProjectAndDataset);
      const finalUrl = options.fromProjectScope ? `${url}${url.includes('?') ? '&' : '?'}from=project` : url;
      (options.replace ? router.replace : router.push)(finalUrl);
    },
    [dispatch, router]
  );
};

/**
 * Hook which returns a URL suffix prefixed by the currently-selected scope.
 */
export const useCurrentScopePrefixedUrl = (suffix: string) => {
  const selectedScope = useSelectedScope();
  const toHref = useLangHref();
  return toHref(scopeSelectionToUrl(selectedScope, suffix));
};

/**
 * The purpose of useNavigateToSameScopeUrl is to provide a `navigate(...)`-like hook which goes to page within the same
 * scope as the one currently in Redux.
 */
export const useNavigateToSameScopeUrl = () => {
  const router = useAppRouter();
  const selectedScope = useSelectedScope();

  return useCallback(
    (suffix: string, replace: boolean = true) => {
      const url = scopeSelectionToUrl(selectedScope, suffix);
      (replace ? router.replace : router.push)(url);
    },
    [router, selectedScope]
  );
};

export const useIsInCatalogueMode = () => {
  const { projects } = useMetadata();
  return projects.length !== 1 || FORCE_CATALOGUE;
};

export const useGetRouteTitleAndIcon = () => {
  const pathname = usePathname();
  const catalogueMode = useIsInCatalogueMode();

  // Use the pathname for catalogue page detection instead of selectedProject, since it gives us faster UI rendering
  // at the cost of only being wrong with a redirect edge case (and being slightly more brittle).
  const exploreIsCatalogue = !pathname.includes('/p/') && !pathname.includes('/d/') && catalogueMode;

  return useCallback(
    (routeId: string): [string, ReactNode] => {
      /* eslint-disable react/jsx-key */
      switch (routeId) {
        case BentoRoute.Explore:
          return exploreIsCatalogue ? ['Catalogue', <BookOutlined />] : ['Explore', <PieChartOutlined />];
        case BentoRoute.About:
          return ['About', <SolutionOutlined />];
        case BentoRoute.Beacon:
          return ['Beacon', <BeaconLogo />];
        case BentoRoute.BeaconNetwork:
          return ['Beacon Network', <ShareAltOutlined />];
        case BentoRoute.Phenopackets:
          return ['entities.phenopacket_other', <SolutionOutlined />];
        case BentoRoute.NotFound: // should not be used, but not unknown
          return ['errors.page_not_found', <CloseCircleOutlined />];
        default:
          console.error('Unknown page', routeId);
          return ['', null];
      }
      /* eslint-enable react/jsx-key */
    },
    [exploreIsCatalogue]
  );
};

/**
 * Hook returning a 'tuple' of [site header menu items, scope header menu items]. Menu item arrays with only one entry
 * should not be displayed by the UI.
 */
export const useSiteMenuItems = (): [MenuItem[], MenuItem[]] => {
  const t = useTranslationFn();
  const { fixedProject, fixedDataset, scope } = useSelectedScope();
  const page = useCurrentPage();

  const scopeHasData = useScopeHasData();

  const createMenuItem = useCallback(
    (key: string, label: string, icon?: ReactNode, children?: MenuItem[]): MenuItem => ({
      key,
      icon,
      children,
      label: t(label),
    }),
    [t]
  );

  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();

  return useMemo(() => {
    // Serves weird overloaded purpose as both catalogue and data explore route:
    const exploreItem = createMenuItem(BentoRoute.Explore, ...getRouteTitleAndIcon(BentoRoute.Explore));

    const topBarItems: MenuItem[] = [exploreItem];
    const scopeItems: MenuItem[] = [exploreItem];

    const putInTopBar = fixedDataset || (fixedProject && !scope.dataset) || !scope.project;

    if (page !== BentoRoute.Phenopackets && (page !== BentoRoute.BeaconNetwork || putInTopBar)) {
      const itemsRef = putInTopBar ? topBarItems : scopeItems;

      if (BentoRoute.Beacon && scopeHasData) {
        itemsRef.push(createMenuItem(BentoRoute.Beacon, ...getRouteTitleAndIcon(BentoRoute.Beacon)));
      }

      // TODO: can enable for project if we get a more extensive project model
      if (scope.dataset) {
        itemsRef.push(createMenuItem(BentoRoute.About, ...getRouteTitleAndIcon(BentoRoute.About)));
      }
    }

    if (BentoRoute.BeaconNetwork && putInTopBar) {
      topBarItems.push(createMenuItem(BentoRoute.BeaconNetwork, ...getRouteTitleAndIcon(BentoRoute.BeaconNetwork)));
    }

    return (scopeItems.length > 1 ? [[], scopeItems] : [topBarItems, []]) as [MenuItem[], MenuItem[]];
  }, [getRouteTitleAndIcon, createMenuItem, scope, fixedProject, fixedDataset, scopeHasData, page]);
};
