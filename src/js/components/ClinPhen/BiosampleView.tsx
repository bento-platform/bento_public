import { Descriptions, DescriptionsProps, Table } from 'antd';
import { Biosample } from '@/types/clinPhen/biosample';
import { OntologyTerm } from '@/types/ontology';

const BiosampleExpandedRow: React.FC<{ biosample: Biosample }> = ({ biosample }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'Description',
      children: biosample.description || 'N/A',
    },
    {
      key: 'derived_from_id',
      label: 'Derived From',
      children: biosample.derived_from_id || 'N/A',
    },
    {
      key: 'sample_type',
      label: 'Sample Type',
      children: biosample.sample_type?.label || 'N/A',
    },
    {
      key: 'time_of_collection',
      label: 'Collection Time',
      children: biosample.time_of_collection ? JSON.stringify(biosample.time_of_collection) : 'N/A',
    },
    {
      key: 'histological_diagnosis',
      label: 'Histological Diagnosis',
      children: biosample.histological_diagnosis?.label || 'N/A',
    },
    {
      key: 'pathological_stage',
      label: 'Pathological Stage',
      children: biosample.pathological_stage?.label || 'N/A',
    },
  ];

  return <Descriptions bordered size="small" items={items} />;
};

interface BiosampleViewProps {
  biosamples: Biosample[];
}

const BiosampleView: React.FC<BiosampleViewProps> = ({ biosamples }) => {
  const columns = [
    {
      title: 'Biosample ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sampled Tissue',
      dataIndex: 'sampled_tissue',
      key: 'sampled_tissue',
      render: (text: OntologyTerm) => text?.label || 'N/A',
    },
  ];
  return (
    <Table<Biosample>
      dataSource={biosamples}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <BiosampleExpandedRow biosample={record} />,
      }}
    />
  );
};

export default BiosampleView;
