import { type DescriptionsProps, Table } from 'antd';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { OntologyTerm } from '@/types/ontology';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { HiddenDescriptionsProps } from '@/types/descriptions';

const BiosampleExpandedRow = ({ biosample }: { biosample: Biosample }) => {
  const items: HiddenDescriptionsProps[] = [
    {
      key: 'description',
      label: 'biosample_expanded_row.description',
      children: biosample.description,
    },
    {
      key: 'derived_from_id',
      label: 'biosample_expanded_row.derived_from',
      children: biosample.derived_from_id,
    },
    {
      key: 'sample_type',
      label: 'biosample_expanded_row.sample_type',
      children: <OntologyTermComponent term={biosample.sample_type} />,
      hidden: !biosample.sample_type,
    },
    {
      key: 'time_of_collection',
      label: 'biosample_expanded_row.collection_time',
      children: <TimeElementDisplay element={biosample.time_of_collection} />,
      hidden: !biosample.time_of_collection,
    },
    {
      key: 'histological_diagnosis',
      label: 'biosample_expanded_row.histological_diagnosis',
      children: <OntologyTermComponent term={biosample.histological_diagnosis} />,
      hidden: !biosample.histological_diagnosis,
    },
    {
      key: 'pathological_stage',
      label: 'biosample_expanded_row.pathological_stage',
      children: <OntologyTermComponent term={biosample.pathological_stage} />,
      hidden: !biosample.pathological_stage,
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

const isBiosampleRowVisible = (r: Biosample) => {
  return !!(
    r.description ||
    r.derived_from_id ||
    r.sample_type ||
    r.time_of_collection ||
    r.histological_diagnosis ||
    r.pathological_stage
  );
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
        rowExpandable: (record) => isBiosampleRowVisible(record),
      }}
      rowKey="id"
      pagination={false}
      bordered
    />
  );
};

export default BiosampleView;
