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
import { COLOR_TEXT_SECONDARY } from './constants';

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
    <div style={{ paddingBottom: 'var(--content-padding-v)', maxWidth: 1240, margin: '0 auto', width: '100%' }}>
      {projectsStatus === RequestStatus.Rejected && (
        <Error message="project_fetch" description={projectsError || undefined} />
      )}

      {/* Banner */}
      <div style={{ marginBottom: 16 }}>
        <CatalogueBanner filteredDatasets={filtered} />
      </div>

      {/* Body: rail + main */}
      <Flex gap={20} align="flex-start">
        {/* Left: facet rail */}
        <CatalogueRail totalCount={filtered.length} facetOptions={facetOptions} />

        {/* Right: toolbar + insights + grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <CatalogueToolbar filteredCount={filtered.length} />

          {insightsOpen && (
            <div style={{ marginTop: 14 }}>
              <CatalogueInsights filteredDatasets={filtered} />
            </div>
          )}

          {/* DATASETS separator */}
          <Flex align="center" gap={8} style={{ marginTop: 18, marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: COLOR_TEXT_SECONDARY,
                whiteSpace: 'nowrap',
              }}
            >
              {t('Datasets')}
            </Text>
            <Divider style={{ margin: 0, flex: 1 }} />
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
