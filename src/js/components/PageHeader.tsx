import { type CSSProperties, type ReactNode, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { CATALOGUE_HEADER_BACKGROUND, CATALOGUE_HEADER_TEXT_COLOR } from '@/config';

import type { BentoUICountEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';

import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useRenderCount } from '@/hooks/counts';
import { useSearchQuery } from '@/features/search/hooks';

import { performKatsuDiscovery } from '@/features/search/query.store';
import { COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';

const PAGE_HEADER_CATALOGUE_STYLE: CSSProperties = {
  background: CATALOGUE_HEADER_BACKGROUND,
  color: CATALOGUE_HEADER_TEXT_COLOR,
};

const CataloguePageHeaderStats = () => {
  const dispatch = useAppDispatch();
  const { projectsStatus, datasetsByID } = useMetadata();
  const renderCount = useRenderCount();
  const { nodeCountsOrBools, nodeCountsOrBoolsFetched } = useSearchQuery();
  const { scopeSet } = useSelectedScope();
  const t = useTranslationFn();

  useEffect(() => {
    if (scopeSet && !nodeCountsOrBoolsFetched) dispatch(performKatsuDiscovery());
  }, [dispatch, scopeSet, nodeCountsOrBoolsFetched]);

  const stats = useMemo<{ count: number | boolean; entity: BentoUICountEntity; loading: boolean }[]>(() => {
    const nDatasets = Object.keys(datasetsByID).length;
    const otherCountsLoading = !nodeCountsOrBoolsFetched;
    return [
      { count: nDatasets, entity: 'dataset', loading: projectsStatus === RequestStatus.Pending },
      { count: nodeCountsOrBools?.individual, entity: 'individual', loading: otherCountsLoading },
      { count: nodeCountsOrBools?.biosample, entity: 'biosample', loading: otherCountsLoading },
      // { count: nWGS, entity: 'whole_genome_sequence' },  TODO: PCGL need support from backend for this
    ];
  }, [datasetsByID, nodeCountsOrBools, nodeCountsOrBoolsFetched, projectsStatus]);

  return (
    <ul id="page-header-stats">
      {stats.map(({ count, entity, loading }) => {
        const k = `page-header-stats__${entity}`;
        return (
          <li id={k} key={k} className={loading ? 'loading' : ''}>
            {COUNT_ENTITY_REGISTRY[entity].icon}
            <strong style={{ marginLeft: '0.3em' }}>
              {loading ? (
                <Spin
                  indicator={<LoadingOutlined spin />}
                  style={{ color: 'var(--antd-gray-7)', marginRight: '0.2em' }}
                />
              ) : (
                renderCount(count)
              )}
            </strong>{' '}
            {t(`entities.${entity}`, { count }).toLocaleLowerCase()}
          </li>
        );
      })}
    </ul>
  );
};

const PageHeader = ({ children, catalogue }: { children: ReactNode; catalogue?: boolean }) => {
  const isSmallScreen = useSmallScreen();

  // Effect for adding the data-stuck attribute to the page header when we scroll down.
  useEffect(() => {
    if (catalogue) return; // no sticky header in catalogue mode
    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1),
      { threshold: [1], root: document.getElementById('content-layout') }
    );

    const pageHeaderElement = document.getElementById('page-header');

    if (pageHeaderElement) {
      observer.observe(pageHeaderElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [catalogue]);

  return (
    <header
      id="page-header"
      className={clsx({ 'catalogue-mode': catalogue, sticky: !catalogue })}
      style={catalogue ? PAGE_HEADER_CATALOGUE_STYLE : {}}
    >
      <Flex id="page-header__content" gap="middle" vertical={isSmallScreen}>
        <div className="flex-1">{children}</div>
        {catalogue && <CataloguePageHeaderStats />}
      </Flex>
    </header>
  );
};

export default PageHeader;
