import { Space } from 'antd';
import { WIDTH_100P_STYLE } from '@/constants/common';
import { useMetadata } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import CatalogueCard from './CatalogueCard';

const Catalogue = () => {
  const isSmallScreen = useSmallScreen();
  const { projects } = useMetadata();
  return (
    <Space
      align="center"
      direction="vertical"
      size={isSmallScreen ? 'small' : 'large'}
      style={WIDTH_100P_STYLE}
      styles={{ item: WIDTH_100P_STYLE }}
    >
      {projects.map((project) => (
        <CatalogueCard project={project} key={project.identifier} />
      ))}
    </Space>
  );
};

export default Catalogue;
