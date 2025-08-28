import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import TDescriptions from '@Util/TDescriptions';
import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraProperties from '@Util/ExtraProperties';
import Excluded, { ExcludedModel } from '@Util/ClinPhen/Excluded';

import type { Disease } from '@/types/clinPhen/disease';
import type { TimeElement } from '@/types/clinPhen/shared';
import type { OntologyTerm } from '@/types/ontology';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { objectToBoolean } from '@/utils/boolean';
import { EM_DASH } from '@/constants/common';

const DiseaseExpandedRow = ({ disease }: { disease: Disease }) => {
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'disease_stage',
      label: 'diseases_expanded_row.disease_stage',
      children: <OntologyTermStack terms={disease.disease_stage} />,
      isVisible: disease.disease_stage?.length,
    },
    {
      key: 'clinical_tnm_finding',
      label: 'diseases_expanded_row.clinical_tnm_finding',
      children: <OntologyTermStack terms={disease.clinical_tnm_finding} />,
      isVisible: disease.clinical_tnm_finding?.length,
    },
    {
      key: 'primary_site',
      label: 'diseases_expanded_row.primary_site',
      children: <OntologyTermComponent term={disease.primary_site} />,
      isVisible: disease.primary_site,
    },
    {
      key: 'laterality',
      label: 'diseases_expanded_row.laterality',
      children: <OntologyTermComponent term={disease.laterality} />,
      isVisible: disease.laterality,
    },
    {
      key: 'extra_properties',
      label: 'diseases_expanded_row.extra_properties',
      children: <ExtraProperties extraProperties={disease.extra_properties} />,
      isVisible: objectToBoolean(disease.extra_properties),
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

interface DiseasesViewProps {
  diseases: Disease[];
}

const isDiseaseRowExpandable = (r: Disease) =>
  !!(r.disease_stage?.length || r.clinical_tnm_finding?.length || r.primary_site || r.laterality || r.extra_properties);

const DISEASES_VIEW_COLUMNS: CustomTableColumns<Disease> = [
  {
    title: 'diseases_table.disease',
    dataIndex: 'term',
    render: (term: OntologyTerm, record: Disease) => (
      <>
        <OntologyTermComponent term={term} />
        {record.excluded && <Excluded model={ExcludedModel.DISEASE} />}
      </>
    ),
    alwaysShow: true,
  },
  {
    title: 'diseases_table.onset',
    dataIndex: 'onset',
    render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
  },
  {
    title: 'diseases_table.resolution',
    dataIndex: 'resolution',
    render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
  },
];

const DiseasesView = ({ diseases }: DiseasesViewProps) => {
  return (
    <CustomTable<Disease>
      dataSource={diseases}
      columns={DISEASES_VIEW_COLUMNS}
      expandedRowRender={(record) => <DiseaseExpandedRow disease={record} />}
      rowKey={(record) => record.term.id}
      isRowExpandable={isDiseaseRowExpandable}
    />
  );
};

export default DiseasesView;
