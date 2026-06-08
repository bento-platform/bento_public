import { useEffect, useMemo } from 'react';
import { Divider, Empty, Button, Flex, Typography } from 'antd';
import { useMetadata } from '@/features/metadata/hooks';
import { useCatalogueFilter, useCatalogueState } from '@/features/catalogue/hooks';
import { useAppDispatch } from '@/hooks';
import { useTranslationFn } from '@/hooks';
import { clearAll, setProjectColors } from '@/features/catalogue/catalogue.store';
import { useCatalogueUrlSync } from '@/features/catalogue/useCatalogueUrlSync';
import { assignColors } from '@/features/catalogue/hooks';
import { RequestStatus } from '@/types/requests';
import Error from '@Util/Error';
import CatalogueBanner from './CatalogueBanner';
import CatalogueRail from './CatalogueRail';
import CatalogueToolbar from './CatalogueToolbar';
import CatalogueInsights from './CatalogueInsights';
import CatalogueCard from './CatalogueCard';

const { Text } = Typography;

const Catalogue = () => {
  useCatalogueUrlSync();

  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { projects, projectsStatus, projectsError } = useMetadata();
  const { view, insightsOpen } = useCatalogueState();

  const allDatasets = useMemo(
    () => projects.flatMap((p) => (p.datasets ?? []).map((d) => ({ dataset: d, project: p }))),
    [projects]
  );

  const { filtered, facetOptions } = useCatalogueFilter(allDatasets);

  useEffect(() => {
    const names = [...new Set(allDatasets.map(({ project }) => project.title))];
    dispatch(setProjectColors(assignColors(names)));
  }, [allDatasets, dispatch]);

  const gridStyle: React.CSSProperties =
    view === 'grid'
      ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }
      : { display: 'flex', flexDirection: 'column', gap: 14 };

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
        <CatalogueRail totalCount={filtered.length} facetOptions={facetOptions} />

        {/* Right: toolbar + insights + grid */}
        <div className="flex-1 min-w-0">
          <CatalogueToolbar filteredCount={filtered.length} />

          {insightsOpen && (
            <div className="catalogue-insights-container">
              <CatalogueInsights filteredDatasets={filtered} />
            </div>
          )}

          {/* DATASETS separator */}
          <Flex align="center" gap={8} className="catalogue-datasets-separator">
            <Text className="catalogue-section-label">
              {t('Datasets')}
            </Text>
            <Divider className="m-0 flex-1" />
          </Flex>

          {filtered.length === 0 ? (
            <Empty description={t('No datasets match your filters')}>
              <Button type="primary" onClick={() => dispatch(clearAll())}>
                {t('Clear all filters')}
              </Button>
            </Empty>
          ) : (
            <div style={gridStyle}>
              {filtered.map(({ dataset, project }) => (
                <CatalogueCard key={dataset.identifier} dataset={dataset} project={project} />
              ))}
            </div>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default Catalogue;
