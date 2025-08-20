import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';

import type { Biosample } from '@/types/clinPhen/biosample';
import type { OntologyTerm } from '@/types/ontology';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { Procedure as ProcedureType } from '@/types/clinPhen/procedure';

import { objectToBoolean } from '@/utils/boolean';
import FileTable from '@/components/Util/FileTable';

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
      key: 'taxonomy',
      label: 'biosample_expanded_row.taxonomy',
      children: <OntologyTermComponent term={biosample.taxonomy} />,
      isVisible: biosample.taxonomy,
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
      key: 'pathological_tnm_finding',
      label: 'biosample_expanded_row.pathological_tnm_finding',
      children: <OntologyTermStack terms={biosample.pathological_tnm_finding} />,
      isVisible: biosample.pathological_tnm_finding?.length,
    },
    {
      key: 'diagnostic_markers',
      label: 'biosample_expanded_row.diagnostic_markers',
      children: <OntologyTermStack terms={biosample.diagnostic_markers} />,
      isVisible: biosample.diagnostic_markers?.length,
    },
    {
      key: 'tumor_progression',
      label: 'biosample_expanded_row.tumor_progression',
      children: <OntologyTermComponent term={biosample.tumor_progression} />,
      isVisible: biosample.tumor_progression,
    },
    {
      key: 'tumor_grade',
      label: 'biosample_expanded_row.tumor_grade',
      children: <OntologyTermComponent term={biosample.tumor_grade} />,
      isVisible: biosample.tumor_grade,
    },
    {
      key: 'material_sample',
      label: 'biosample_expanded_row.material_sample',
      children: <OntologyTermComponent term={biosample.material_sample} />,
      isVisible: biosample.material_sample,
    },
    {
      key: 'sample_processing',
      label: 'biosample_expanded_row.sample_processing',
      children: <OntologyTermComponent term={biosample.sample_processing} />,
      isVisible: biosample.sample_processing,
    },
    {
      key: 'sample_storage',
      label: 'biosample_expanded_row.sample_storage',
      children: <OntologyTermComponent term={biosample.sample_storage} />,
      isVisible: biosample.sample_storage,
    },
    {
      key: 'procedure',
      label: 'biosample_expanded_row.procedure',
      children: <Procedure p={biosample.procedure} />,
      isVisible: objectToBoolean(biosample.procedure),
    },
    {
      key: 'files',
      label: 'biosample_expanded_row.files',
      children: <FileTable files={biosample.files ?? []} />,
      isVisible: objectToBoolean(biosample.files),
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

const isBiosampleRowVisible = (r: Biosample) =>
  !!(
    r.description ||
    r.derived_from_id ||
    r.individual_id ||
    r.sample_type ||
    r.taxonomy ||
    r.time_of_collection ||
    r.histological_diagnosis ||
    r.pathological_stage ||
    r.pathological_tnm_finding?.length ||
    r.tumor_progression ||
    r.tumor_grade ||
    r.material_sample ||
    r.sample_processing ||
    r.sample_storage ||
    r.procedure ||
    r.files?.length
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
