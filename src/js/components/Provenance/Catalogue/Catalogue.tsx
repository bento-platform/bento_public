import { Space } from 'antd';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { useMetadata } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import CatalogueCard from './CatalogueCard';
import CatalogueProjectSection from './CatalogueProjectSection';

const Catalogue = () => {
  const isSmallScreen = useSmallScreen();
  const { projects } = useMetadata();
  return (
    <Space
      align="center"
      direction="vertical"
      size={isSmallScreen ? 'small' : 'large'}
      className="w-full"
      styles={SPACE_ITEM_WIDTH_100P_STYLES}
    >
      {/* {projects.map((project) => (
        <CatalogueCard project={project} key={project.identifier} />
      ))} */}
      {projects.map((project) => (
        <CatalogueProjectSection project={project} key={project.identifier} />
      ))}
    </Space>
  );
};

export default Catalogue;
