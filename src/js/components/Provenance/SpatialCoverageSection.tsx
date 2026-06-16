import { EnvironmentOutlined } from '@ant-design/icons';
import { PointMap } from 'bento-charts/dist/maps';

import type { SpatialCoverageFeature } from '@/types/dataset';
import { SectionHead } from './cards';

type SpatialCoverageSectionProps = {
  spatialCoverage: string | SpatialCoverageFeature;
  collapsed: boolean;
  onToggle: () => void;
};

const GeoSpatialContent = ({ sc }: { sc: SpatialCoverageFeature }) => {
  const name = sc.properties?.name;
  const geometry = sc.geometry;
  const isPoint = geometry?.type === 'Point';
  return (
    <div className={isPoint ? 'pm-coverwrap' : undefined}>
      <div className="pm-cover-info">
        {name && (
          <div className="pm-cover-place">
            <EnvironmentOutlined />
            {name}
          </div>
        )}
      </div>
      {isPoint && geometry && (
        <div className="pm-mapbox">
          <PointMap
            data={[{ coordinates: geometry.coordinates as [number, number], title: name ?? '' }]}
            center={[geometry.coordinates[1] as number, geometry.coordinates[0] as number]}
            zoom={5}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

const SpatialCoverageSection = ({ spatialCoverage, collapsed, onToggle }: SpatialCoverageSectionProps) => (
  <section id="spatial" className={`pm-sec${collapsed ? ' collapsed' : ''}`}>
    <SectionHead title="Spatial Coverage" collapsed={collapsed} onToggle={onToggle} />
    <div className="pm-sec-body">
      {typeof spatialCoverage === 'string' ? (
        <div className="pm-cover-place">
          <EnvironmentOutlined />
          {spatialCoverage}
        </div>
      ) : (
        <GeoSpatialContent sc={spatialCoverage} />
      )}
    </div>
  </section>
);

export default SpatialCoverageSection;
