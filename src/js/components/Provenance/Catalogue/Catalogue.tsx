import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Divider, Empty, Button, Flex, Grid, Pagination, Spin, Typography } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

import { PCGL_MODE } from '@/config';
import { useMetadata } from '@/features/metadata/hooks';
import { useCatalogueSearch, useCatalogueFacetOptions } from '@/features/catalogue/hooks';
import { useAppDispatch } from '@/hooks';
import { useTranslationFn } from '@/hooks';
import { setProjectColors } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlSync, useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { assignColors } from '@/features/catalogue/utils';
import { RequestStatus } from '@/types/requests';
import Error from '@Util/Error';
import CatalogueBanner from './CatalogueBanner';
import CatalogueRail from './CatalogueRail';
import CatalogueToolbar from './CatalogueToolbar';
import CatalogueInsights from './CatalogueInsights';
import Dataset from '@/components/Provenance/Dataset';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const CATALOGUE_PAGE_SIZE = 25; // matches the backend's default page_size

const Catalogue = () => {
  useCatalogueUrlSync();

  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { clearAll, setPage } = useCatalogueUrlActions();
  const { projects } = useMetadata();
  const { view, insightsOpen, page, searchStatus, searchError, searchResults, searchCount, searchTotals } =
    useCatalogueSearch();
  const facetOptions = useCatalogueFacetOptions();

  // Below the `lg` breakpoint the rail becomes a slide-over drawer instead of an inline sticky column,
  // via the same overlay/open Sidebar props SiteSider uses for the Search feature's sidebar.
  const breakpoints = useBreakpoint();
  const railOverlay = !breakpoints.lg;
  const singleCol = view !== 'grid' || !breakpoints.md;
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => {
    // In PCGL mode, assign colours to programs instead of projects for now. Keyed by identifier (not
    // title) for projects, matching the `project` facet's value semantics from GET /api/datasets.
    const colorKeys = PCGL_MODE
      ? [...(new Set(projects.flatMap((p) => p.datasets.map((d) => d.program_name)).filter(Boolean)) as Set<string>)]
      : [...projects].sort((a, b) => a.title.localeCompare(b.title)).map((p) => p.identifier);
    dispatch(setProjectColors(assignColors(colorKeys)));
  }, [projects, dispatch]);

  const showEmpty = searchCount === 0 && searchStatus === RequestStatus.Fulfilled;
  // Idle covers the brief window before the very first request is dispatched; Pending covers that
  // request and every refetch after. Rejected isn't included — the Error banner above covers that case,
  // and the last-good results (still in state) stay visible underneath it rather than looking "stuck loading".
  const isLoading = searchStatus === RequestStatus.Idle || searchStatus === RequestStatus.Pending;

  return (
    <div className="pb-content max-w-catalogue mx-auto w-full">
      {searchStatus === RequestStatus.Rejected && (
        <Error message="search_fetch" description={searchError || undefined} className="mb-4" />
      )}

      {/* Banner */}
      <div className="mb-4">
        <CatalogueBanner count={searchCount} totals={searchTotals} />
      </div>

      {/* Body: rail + main */}
      <Spin spinning={isLoading} indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />}>
        <Flex gap={20} align="flex-start">
          {/* Left: facet rail */}
          <CatalogueRail
            totalCount={searchCount}
            facetOptions={facetOptions}
            overlay={railOverlay}
            open={!railOverlay || railOpen}
            onClose={() => setRailOpen(false)}
          />

          {/* Right: toolbar + insights + grid */}
          <div className="flex-1 min-w-0">
            <CatalogueToolbar
              filteredCount={searchCount}
              showFiltersButton={railOverlay}
              isMobile={!breakpoints.md}
              onOpenFilters={() => setRailOpen(true)}
            />

            {insightsOpen && (
              <div className="catalogue-insights-container">
                <CatalogueInsights totalCount={searchCount} />
              </div>
            )}

            {/* DATASETS separator */}
            <Flex align="center" gap={8} className="catalogue-datasets-separator">
              <Text className="catalogue-section-label">{t('entities.dataset_other')}</Text>
              <Divider className="m-0 flex-1 min-w-0" />
            </Flex>

            {showEmpty ? (
              <Empty description={t('catalogue.datasets.empty')}>
                <Button type="primary" onClick={clearAll}>
                  {t('catalogue.datasets.reset_filters')}
                </Button>
              </Empty>
            ) : (
              <>
                <div className={clsx('catalogue-grid', singleCol && 'catalogue-grid--single-col')}>
                  {searchResults.map((dataset) => (
                    <Dataset
                      key={dataset.identifier}
                      format="card"
                      parentProjectID={dataset.project}
                      dataset={dataset}
                      project={dataset.project_detail}
                    />
                  ))}
                </div>
                {searchCount > CATALOGUE_PAGE_SIZE && (
                  <Flex justify="center" className="mt-4">
                    <Pagination
                      current={page}
                      pageSize={CATALOGUE_PAGE_SIZE}
                      total={searchCount}
                      onChange={setPage}
                      showSizeChanger={false}
                    />
                  </Flex>
                )}
              </>
            )}
          </div>
        </Flex>
      </Spin>
    </div>
  );
};

export default Catalogue;
