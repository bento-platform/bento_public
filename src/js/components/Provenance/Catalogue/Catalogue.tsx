import { Space } from 'antd';
import CatalogueCard from './CatalogueCard';
import { useMetadata } from '@/features/metadata/hooks';

const Catalogue = () => {
  const { projects } = useMetadata();
  return (
    <Space align="center" direction="vertical" size="large" style={{ width: '100%' }}>
      {projects.map((project) => (
        <CatalogueCard project={project} key={project.identifier} />
      ))}
    </Space>
  );
};

export default Catalogue;
