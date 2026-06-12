import { Descriptions, Typography } from 'antd';
import BentoMapContainer from 'bento-charts/dist/Components/Maps/BentoMapContainer';
import { GeoJSON } from 'react-leaflet';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';

const SpatialCoverageDisplay = ({ spatialCoverage }: { spatialCoverage: NonNullable<Dataset['spatial_coverage']> }) => {
  const t = useTranslationFn();

  if (typeof spatialCoverage === 'string') {
    return <Typography.Paragraph className="mb-0">{spatialCoverage}</Typography.Paragraph>;
  }

  const name = spatialCoverage.properties.name;

  // TODO: better map display for generic geometries
  return (
    <>
      <Descriptions style={{ paddingTop: '8px' }}>
        <Descriptions.Item span={24} label={t('Spatial Coverage')}>
          {name}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ maxWidth: 1100 }}>
        <BentoMapContainer center={[45.5345883, -73.5869592]} zoom={4} height={400}>
          <GeoJSON data={spatialCoverage} />
        </BentoMapContainer>
      </div>
    </>
  );
};

export default SpatialCoverageDisplay;
