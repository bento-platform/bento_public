import { type DescriptionsProps, Table } from 'antd';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { OntologyTerm } from '@/types/ontology';

import { EM_DASH } from '@/constants/common';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

const BiosampleExpandedRow = ({ biosample }: { biosample: Biosample }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'biosample_expanded_row.description',
      children: biosample.description || EM_DASH,
    },
    {
      key: 'derived_from_id',
      label: 'biosample_expanded_row.derived_from',
      children: biosample.derived_from_id || EM_DASH,
    },
    {
      key: 'sample_type',
      label: 'biosample_expanded_row.sample_type',
      children: <OntologyTermComponent term={biosample.sample_type} />,
    },
    {
      key: 'time_of_collection',
      label: 'biosample_expanded_row.collection_time',
      children: biosample.time_of_collection ? <TimeElementDisplay element={biosample.time_of_collection} /> : EM_DASH,
    },
    {
      key: 'histological_diagnosis',
      label: 'biosample_expanded_row.histological_diagnosis',
      children: <OntologyTermComponent term={biosample.histological_diagnosis} />,
    },
    {
      key: 'pathological_stage',
      label: 'biosample_expanded_row.pathological_stage',
      children: <OntologyTermComponent term={biosample.pathological_stage} />,
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

interface BiosampleViewProps {
  biosamples: Biosample[];
}

//TODO: add button that links to experiment (like bento web)
const BiosampleView = ({ biosamples }: BiosampleViewProps) => {
  const columns = useTranslatedTableColumnTitles<Biosample>([
    {
      title: 'biosample_table.biosample_id',
      dataIndex: 'id',
    },
    {
      title: 'biosample_table.sampled_tissue',
      dataIndex: 'sampled_tissue',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    },
  ]);

  return (
    <Table<Biosample>
      dataSource={biosamples}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <BiosampleExpandedRow biosample={record} />,
      }}
      rowKey="id"
      pagination={false}
      bordered
    />
  );
};

export default BiosampleView;
