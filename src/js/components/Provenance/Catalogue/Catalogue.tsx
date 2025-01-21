import { Space } from 'antd';
import CatalogueCard from './CatalogueCard';
import { useMetadata } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

const Catalogue = () => {
  const isSmallScreen = useSmallScreen();
  const { projects } = useMetadata();
  return (
    <Space
      align="center"
      direction="vertical"
      size={isSmallScreen ? 'small' : 'large'}
      style={{ width: '100%' }}
      styles={{ item: { width: '100%' } }}
    >
      {projects.map((project) => (
        <CatalogueCard project={project} key={project.identifier} />
      ))}
    </Space>
  );
};

export default Catalogue;
