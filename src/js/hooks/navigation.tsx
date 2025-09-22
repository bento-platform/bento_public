import { type ReactNode, useCallback } from 'react';
import { type NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { BookOutlined, PieChartOutlined, ShareAltOutlined, SolutionOutlined } from '@ant-design/icons';

import BeaconLogo from '@/components/Beacon/BeaconLogo';

import { FORCE_CATALOGUE } from '@/config';
import { useMetadata } from '@/features/metadata/hooks';
import { type DiscoveryScope, selectScope } from '@/features/metadata/metadata.store';
import { BentoRoute } from '@/types/routes';
import { useAppDispatch, useLanguage } from '@/hooks';
import { scopeToUrl } from '@/utils/router';

export const useNavigateToRoot = () => {
  const language = useLanguage();
  const navigate = useNavigate();
  return useCallback(() => navigate(`/${language}`), [navigate, language]);
};

/**
 * The purpose of useNavigateToScope is to provide a `navigate(...)`-like hook which goes to a possibly-new scope, and
 * sets the Redux scope at the same time as setting the URL to prevent weird state-update / URL-update race conditions
 * with downstream search processing.
 */
export const useNavigateToScope = () => {
  const language = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useCallback(
    (
      newScope: DiscoveryScope,
      suffix: string = '',
      fixedProjectAndDataset: boolean = false,
      navigateOptions: NavigateOptions | undefined = undefined
    ) => {
      dispatch(selectScope(newScope));
      navigate(scopeToUrl(newScope, language, suffix, fixedProjectAndDataset), navigateOptions);
    },
    [dispatch, navigate, language]
  );
};

export const useIsInCatalogueMode = () => {
  const { projects } = useMetadata();
  return projects.length !== 1 || FORCE_CATALOGUE;
};

export const useGetRouteTitleAndIcon = () => {
  const location = useLocation();
  const catalogueMode = useIsInCatalogueMode();

  // Use location for catalogue page detection instead of selectedProject, since it gives us faster UI rendering at the
  // cost of only being wrong with a redirect edge case (and being slightly more brittle).
  const overviewIsCatalogue = !location.pathname.includes('/p/') && catalogueMode;

  return useCallback(
    (routeId: string): [string, ReactNode] => {
      /* eslint-disable react/jsx-key */
      switch (routeId) {
        case BentoRoute.Overview:
          return overviewIsCatalogue ? ['Catalogue', <BookOutlined />] : ['Overview', <PieChartOutlined />];
        case BentoRoute.Provenance:
          return ['Provenance', <SolutionOutlined />];
        case BentoRoute.Beacon:
          return ['Beacon', <BeaconLogo />];
        case BentoRoute.BeaconNetwork:
          return ['Beacon Network', <ShareAltOutlined />];
        case BentoRoute.Phenopackets:
          return ['entities.phenopacket_other', <SolutionOutlined />];
        default:
          console.error('Unknown page', routeId);
          return ['', null];
      }
      /* eslint-enable react/jsx-key */
    },
    [overviewIsCatalogue]
  );
};
