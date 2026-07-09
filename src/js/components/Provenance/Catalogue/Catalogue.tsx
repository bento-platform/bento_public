import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Divider, Empty, Button, Flex, Grid, Typography } from 'antd';
import { useMetadata } from '@/features/metadata/hooks';
import { useCatalogueFilter, useCatalogueState } from '@/features/catalogue/hooks';
import { useAppDispatch } from '@/hooks';
import { useTranslationFn } from '@/hooks';
import { setProjectColors } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlSync, useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { assignColors } from '@/features/catalogue/hooks';
import { RequestStatus } from '@/types/requests';
import Error from '@Util/Error';
import CatalogueBanner from './CatalogueBanner';
import CatalogueRail from './CatalogueRail';
import CatalogueToolbar from './CatalogueToolbar';
import CatalogueInsights from './CatalogueInsights';
import Dataset from '@/components/Provenance/Dataset';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const Catalogue = () => {
  useCatalogueUrlSync();

  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { clearAll } = useCatalogueUrlActions();
  const { projects, projectsStatus, projectsError } = useMetadata();
  const { view, insightsOpen } = useCatalogueState();

  // Below the `lg` breakpoint the rail becomes a slide-over drawer instead of an inline sticky column,
  // mirroring the overlay/collapsed pattern SiteSider uses for the Search feature's sidebar.
  const breakpoints = useBreakpoint();
  const railOverlay = !breakpoints.lg;
  const [railOpen, setRailOpen] = useState(false);

  const allDatasets = useMemo(
    () => projects.flatMap((p) => (p.datasets ?? []).map((d) => ({ dataset: d, project: p }))),
    [projects]
  );

  const { filtered, facetOptions } = useCatalogueFilter(allDatasets);

  useEffect(() => {
    const names = [...new Set(allDatasets.map(({ project }) => project.title))];
    dispatch(setProjectColors(assignColors(names)));
  }, [allDatasets, dispatch]);

  return (
    <div className="pb-content max-w-catalogue mx-auto w-full">
      {projectsStatus === RequestStatus.Rejected && (
        <Error message="project_fetch" description={projectsError || undefined} />
      )}

      {/* Banner */}
      <div className="mb-4">
        <CatalogueBanner filteredDatasets={filtered} />
      </div>

      {/* Body: rail + main */}
      <Flex gap={20} align="flex-start">
        {/* Left: facet rail */}
        <CatalogueRail
          totalCount={filtered.length}
          facetOptions={facetOptions}
          overlay={railOverlay}
          open={!railOverlay || railOpen}
          onClose={() => setRailOpen(false)}
        />

        {/* Right: toolbar + insights + grid */}
        <div className="flex-1 min-w-0">
          <CatalogueToolbar
            filteredCount={filtered.length}
            showFilterToggle={railOverlay}
            onOpenFilters={() => setRailOpen(true)}
          />

          {insightsOpen && (
            <div className="catalogue-insights-container">
              <CatalogueInsights filteredDatasets={filtered} />
            </div>
          )}

          {/* DATASETS separator */}
          <Flex align="center" gap={8} className="catalogue-datasets-separator">
            <Text className="catalogue-section-label">{t('entities.dataset_other')}</Text>
            <Divider className="m-0 flex-1 min-w-0" />
          </Flex>

          {filtered.length === 0 ? (
            <Empty description={t('catalogue.datasets.empty')}>
              <Button type="primary" onClick={clearAll}>
                {t('catalogue.datasets.reset_filters')}
              </Button>
            </Empty>
          ) : (
            <div className={clsx('catalogue-grid', view !== 'grid' && 'catalogue-grid--single-col')}>
              {filtered.map(({ dataset, project }) => (
                <Dataset
                  key={dataset.identifier}
                  format="card"
                  parentProjectID={project.identifier}
                  dataset={dataset}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default Catalogue;
