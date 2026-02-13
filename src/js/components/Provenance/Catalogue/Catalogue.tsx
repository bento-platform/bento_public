import { Space } from 'antd';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { useMetadata } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import Error from '@Util/Error';
import CatalogueCard from './CatalogueCard';
import { RequestStatus } from '@/types/requests';

const Catalogue = () => {
  const isSmallScreen = useSmallScreen();
  const { projects, projectsStatus, projectsError } = useMetadata();
  return (
    <Space
      align="center"
      direction="vertical"
      size={isSmallScreen ? 'small' : 'large'}
      className="w-full"
      styles={SPACE_ITEM_WIDTH_100P_STYLES}
    >
      {projectsStatus === RequestStatus.Rejected ? (
        <Error message="project_fetch" description={projectsError || undefined} />
      ) : null}
      {projects.map((project) => (
        <CatalogueCard project={project} key={project.identifier} />
      ))}
    </Space>
  );
};

export default Catalogue;
