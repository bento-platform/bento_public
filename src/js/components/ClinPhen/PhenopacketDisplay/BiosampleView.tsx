import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { OntologyTerm } from '@/types/ontology';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { Procedure as ProcedureType } from '@/types/clinPhen/procedure';

import { objectToBoolean } from '@/utils/boolean';

const Procedure = ({ p }: { p: ProcedureType | undefined }) => {
  if (!p) return null;
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'code',
      label: 'biosample_expanded_row.code',
      children: <OntologyTermComponent term={p.code} />,
    },
    {
      key: 'body_site',
      label: 'biosample_expanded_row.body_site',
      children: <OntologyTermComponent term={p?.body_site} />,
    },
    {
      key: 'performed',
      label: 'biosample_expanded_row.performed',
      children: <TimeElementDisplay element={p?.performed} />,
    },
  ];
  return <TDescriptions items={items} />;
};

const BiosampleExpandedRow = ({ biosample }: { biosample: Biosample }) => {
  const items: ConditionalDescriptionItem[] = [
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
      isVisible: biosample.sample_type,
    },
    {
      key: 'time_of_collection',
      label: 'biosample_expanded_row.collection_time',
      children: <TimeElementDisplay element={biosample.time_of_collection} />,
      isVisible: biosample.time_of_collection,
    },
    {
      key: 'histological_diagnosis',
      label: 'biosample_expanded_row.histological_diagnosis',
      children: <OntologyTermComponent term={biosample.histological_diagnosis} />,
      isVisible: biosample.histological_diagnosis,
    },
    {
      key: 'pathological_stage',
      label: 'biosample_expanded_row.pathological_stage',
      children: <OntologyTermComponent term={biosample.pathological_stage} />,
      isVisible: biosample.pathological_stage,
    },
    {
      key: 'procedure',
      label: 'biosample_expanded_row.procedure',
      children: <Procedure p={biosample.procedure} />,
      isVisible: objectToBoolean(biosample),
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

const isBiosampleRowVisible = (r: Biosample) =>
  !!(
    r.description ||
    r.derived_from_id ||
    r.sample_type ||
    r.time_of_collection ||
    r.histological_diagnosis ||
    r.pathological_stage ||
    r.procedure
  );

interface BiosampleViewProps {
  biosamples: Biosample[];
}

const BIOSAMPLE_VIEW_COLUMNS: CustomTableColumns<Biosample> = [
  {
    title: 'biosample_table.biosample_id',
    dataIndex: 'id',
    alwaysShow: true,
  },
  {
    title: 'biosample_table.sampled_tissue',
    dataIndex: 'sampled_tissue',
    render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
  },
];

//TODO: add button that links to experiment (like bento web)
const BiosampleView = ({ biosamples }: BiosampleViewProps) => {
  return (
    <CustomTable<Biosample>
      dataSource={biosamples}
      columns={BIOSAMPLE_VIEW_COLUMNS}
      expandedRowRender={(record) => <BiosampleExpandedRow biosample={record} />}
      rowKey="id"
      isDataKeyVisible={isBiosampleRowVisible}
    />
  );
};

export default BiosampleView;
