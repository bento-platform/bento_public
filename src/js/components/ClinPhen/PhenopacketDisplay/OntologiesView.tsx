import { Table, Typography } from 'antd';

import type { Resource } from '@/types/clinPhen/resource';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useTranslationFn } from '@/hooks';

const { Link } = Typography;

interface OntologiesProps {
  resources: Resource[] | undefined;
}

const OntologiesView = ({ resources }: OntologiesProps) => {
  const t = useTranslationFn();

  const columns = useTranslatedTableColumnTitles<Resource>([
    { title: 'ontologies.resource_id', dataIndex: 'id' },
    { title: 'ontologies.name', dataIndex: 'name', render: (text: string) => t(text) },
    { title: 'ontologies.namespace_prefix', dataIndex: 'namespace_prefix' },
    {
      title: 'ontologies.url',
      dataIndex: 'url',
      render: (text: string) => (
        <Link key={text} href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </Link>
      ),
    },
    { title: 'ontologies.version', dataIndex: 'version' },
    { title: 'ontologies.iri_prefix', dataIndex: 'iri_prefix' },
  ]);
  return <Table<Resource> dataSource={resources} columns={columns} rowKey="id" pagination={false} bordered />;
};

export default OntologiesView;
