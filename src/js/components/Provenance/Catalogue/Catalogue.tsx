import { useMemo } from 'react';
import { Col, Row, Space } from 'antd';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { useMetadata } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import Error from '@Util/Error';
import CatalogueCard from './CatalogueCard';
import { RequestStatus } from '@/types/requests';

const GRID_THRESHOLD = 3;

const Catalogue = () => {
  const isSmallScreen = useSmallScreen();
  const { projects, projectsStatus, projectsError } = useMetadata();

  const flatDatasets = useMemo(() => {
    const real = projects.flatMap((p) => (p.datasets ?? []).map((d) => ({ dataset: d, project: p })));
    // TESTING ONLY: set true to double datasets and force grid mode with a small catalogue
    const DUPLICATE_DATASETS_FOR_GRID_TESTING = true;
    if (DUPLICATE_DATASETS_FOR_GRID_TESTING) {
      return [
        ...real,
        ...real.map(({ dataset, project }) => ({ dataset: { ...dataset, identifier: dataset.identifier + '-dup' }, project })),
      ];
    }
    return real;
  }, [projects]);

  const isGridMode = flatDatasets.length > GRID_THRESHOLD;

  const errorNode =
    projectsStatus === RequestStatus.Rejected ? (
      <Error message="project_fetch" description={projectsError || undefined} />
    ) : null;

  return (
    <div
      className="w-full"
      /* Double-up on space between content + footer since the solid colour block (with PCGL footer) looks congested
         otherwise: */
      style={{ paddingBottom: 'var(--content-padding-v)' }}
    >
      {errorNode}
      {isGridMode ? (
        <Row gutter={[16, 16]} style={{ maxWidth: 1200, margin: '0 auto' }}>
          {flatDatasets.map(({ dataset, project }) => (
            <Col key={dataset.identifier} xs={24} md={12}>
              <CatalogueCard dataset={dataset} project={project} compact />
            </Col>
          ))}
        </Row>
      ) : (
        <Space
          align="center"
          direction="vertical"
          size={isSmallScreen ? 'small' : 'large'}
          className="w-full"
          styles={SPACE_ITEM_WIDTH_100P_STYLES}
        >
          {flatDatasets.map(({ dataset, project }) => (
            <CatalogueCard dataset={dataset} project={project} key={dataset.identifier} />
          ))}
        </Space>
      )}
    </div>
  );
};

export default Catalogue;
