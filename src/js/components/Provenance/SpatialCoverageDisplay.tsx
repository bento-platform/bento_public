import { Descriptions, Typography } from 'antd';
import { PointMap } from 'bento-charts/dist/maps';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';

const SpatialCoverageDisplay = ({ spatialCoverage }: { spatialCoverage: NonNullable<Dataset['spatial_coverage']> }) => {
  const t = useTranslationFn();

  if (typeof spatialCoverage === 'string') {
    return <Typography.Paragraph className="mb-0">{spatialCoverage}</Typography.Paragraph>;
  }

  const name = spatialCoverage.properties.name;
  const geometry = spatialCoverage.geometry;
  const isPoint = geometry?.type === 'Point';

  // TODO: better map display for generic geometries
  return (
    <>
      <Descriptions style={{ paddingTop: '8px' }}>
        <Descriptions.Item span={24} label={t('Spatial Coverage')}>
          {name}
        </Descriptions.Item>
      </Descriptions>
      {isPoint && (
        <div style={{ position: 'relative', zIndex: 0 }}>
          <PointMap
            data={[{ coordinates: geometry.coordinates as [number, number], title: name }]}
            center={[geometry.coordinates[1], geometry.coordinates[0]]}
            zoom={5}
            height={300}
          />
        </div>
      )}
    </>
  );
};

export default SpatialCoverageDisplay;
