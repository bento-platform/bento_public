import { Space } from 'antd';

import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import TDescriptions from '@Util/TDescriptions';
import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
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
      key: 'clinical_tnm_finding',
      children: <OntologyTermStack terms={disease.clinical_tnm_finding} />,
      isVisible: disease.clinical_tnm_finding?.length,
    },
    {
      key: 'primary_site',
      children: <OntologyTermComponent term={disease.primary_site} />,
      isVisible: disease.primary_site,
    },
    {
      key: 'laterality',
      children: <OntologyTermComponent term={disease.laterality} />,
      isVisible: disease.laterality,
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" items={items} defaultI18nPrefix="disease." />
      <ExtraPropertiesDisplay extraProperties={disease.extra_properties} />
    </Space>
  );
};

interface DiseasesViewProps {
  diseases: Disease[];
}

const isDiseaseRowExpandable = (r: Disease) =>
  !!(r.clinical_tnm_finding?.length || r.primary_site || r.laterality || objectToBoolean(r.extra_properties));

const DISEASES_VIEW_COLUMNS: CustomTableColumns<Disease> = [
  {
    title: 'disease.disease',
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
    title: 'disease.disease_stage',
    dataIndex: 'disease_stage',
    render: (diseaseStage: OntologyTerm[]) => <OntologyTermStack terms={diseaseStage} />,
    isEmpty: (diseaseStage?: OntologyTerm[]) => !diseaseStage?.length,
  },
  {
    title: 'disease.onset',
    dataIndex: 'onset',
    render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
  },
  {
    title: 'disease.resolution',
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
      queryKey="diseases"
      rowKey={(record) => record.term.id}
      isRowExpandable={isDiseaseRowExpandable}
    />
  );
};

export default DiseasesView;
