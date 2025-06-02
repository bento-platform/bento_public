import { Table, Typography } from 'antd';

import type { Resource } from '@/types/clinPhen/resource';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

const { Link } = Typography;

interface OntologiesProps {
  resources: Resource[];
}

const OntologiesView = ({ resources }: OntologiesProps) => {
  const columns = useTranslatedTableColumnTitles<Resource>([
    { title: 'ontologies.resource_id', dataIndex: 'id', key: 'id' },
    { title: 'ontologies.name', dataIndex: 'name', key: 'name' },
    { title: 'ontologies.namespace_prefix', dataIndex: 'namespace_prefix', key: 'namespace_prefix' },
    {
      title: 'ontologies.url',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => (
        <Link href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </Link>
      ),
    },
    { title: 'ontologies.version', dataIndex: 'version', key: 'version' },
    { title: 'ontologies.iri_prefix', dataIndex: 'iri_prefix', key: 'iri_prefix' },
  ]);
  return <Table<Resource> dataSource={resources} columns={columns} />;
};

export default OntologiesView;
