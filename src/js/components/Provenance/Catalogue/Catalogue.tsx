import { Space } from 'antd';
import CatalogueCard from '@/components/Provenance/Catalogue/CatalogueCard';
import { useMetadata } from '@/features/metadata/hooks';

const Catalogue = () => {
  const { projects } = useMetadata();
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {projects.map((project) => (
        <CatalogueCard project={project} key={project.title} />
      ))}
    </Space>
  );
};

export default Catalogue;
