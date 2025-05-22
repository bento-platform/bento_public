import { Descriptions, DescriptionsProps, Table } from 'antd';
import { Biosample } from '@/types/clinPhen/biosample';
import { OntologyTerm } from '@/types/ontology';
import { EM_DASH } from '@/constants/common';
import OntologyTermComponent from '../../Util/ClinPhen/OntologyTerm';

const BiosampleExpandedRow = ({ biosample }: { biosample: Biosample }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'Description',
      children: biosample.description || EM_DASH,
    },
    {
      key: 'derived_from_id',
      label: 'Derived From',
      children: biosample.derived_from_id || EM_DASH,
    },
    {
      key: 'sample_type',
      label: 'Sample Type',
      children: biosample.sample_type?.label || EM_DASH,
    },
    {
      key: 'time_of_collection',
      label: 'Collection Time',
      children: biosample.time_of_collection ? JSON.stringify(biosample.time_of_collection) : EM_DASH,
    },
    {
      key: 'histological_diagnosis',
      label: 'Histological Diagnosis',
      children: biosample.histological_diagnosis?.label || EM_DASH,
    },
    {
      key: 'pathological_stage',
      label: 'Pathological Stage',
      children: biosample.pathological_stage?.label || EM_DASH,
    },
  ];

  return <Descriptions bordered size="small" items={items} />;
};

interface BiosampleViewProps {
  biosamples: Biosample[];
}

//TODO: add button that links to experiment (like bento web)
const BiosampleView = ({ biosamples }: BiosampleViewProps) => {
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
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    },
  ];
  return (
    <Table<Biosample>
      dataSource={biosamples}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <BiosampleExpandedRow biosample={record} />,
      }}
      rowKey="id"
    />
  );
};

export default BiosampleView;
