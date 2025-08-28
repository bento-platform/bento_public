import { type ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOutlined, PieChartOutlined, SearchOutlined, ShareAltOutlined, SolutionOutlined } from '@ant-design/icons';

import BeaconLogo from '@/components/Beacon/BeaconLogo';

import { FORCE_CATALOGUE } from '@/config';
import { useMetadata } from '@/features/metadata/hooks';
import { BentoRoute } from '@/types/routes';

export const useNavigateToRoot = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return useCallback(() => navigate(`/${i18n.language}`), [navigate, i18n.language]);
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
        case BentoRoute.Search:
          return ['Search', <SearchOutlined />];
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
