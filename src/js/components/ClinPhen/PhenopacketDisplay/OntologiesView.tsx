import { Table, Typography } from 'antd';
import { Resource } from '@/types/clinPhen/resource';
const { Link } = Typography;

interface OntologiesProps {
  resources: Resource[];
}

const OntologiesView = ({ resources }: OntologiesProps) => {
  const columns = [
    { title: 'Resource ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Namespace Prefix', dataIndex: 'namespace_prefix', key: 'namespace_prefix' },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string) => (
        <Link href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </Link>
      ),
    },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'IRI Prefix', dataIndex: 'iri_prefix', key: 'iri_prefix' },
  ];
  return <Table<Resource> dataSource={resources} columns={columns} />;
};

export default OntologiesView;
