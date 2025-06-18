import { Table } from 'antd';

import TDescriptions from '@Util/TDescriptions';
import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraProperties from '@Util/ExtraProperties';
import Excluded, { ExcludedModel } from '@Util/ClinPhen/Excluded';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

import type { DescriptionsProps } from 'antd';
import type { Disease } from '@/types/clinPhen/disease';
import type { TimeElement } from '@/types/clinPhen/shared';
import type { OntologyTerm } from '@/types/ontology';

import { EM_DASH } from '@/constants/common';

const DiseaseExpandedRow = ({ disease }: { disease: Disease }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'disease_stage',
      label: 'diseases_expanded_row.disease_stage',
      children: disease.disease_stage ? <OntologyTermStack terms={disease.disease_stage} /> : EM_DASH,
    },
    {
      key: 'clinical_tnm_finding',
      label: 'diseases_expanded_row.clinical_tnm_finding',
      children: disease.clinical_tnm_finding ? <OntologyTermStack terms={disease.clinical_tnm_finding} /> : EM_DASH,
    },
    {
      key: 'primary_site',
      label: 'diseases_expanded_row.primary_site',
      children: disease.primary_site ? <OntologyTermComponent term={disease.primary_site} /> : EM_DASH,
    },
    {
      key: 'extra_properties',
      label: 'diseases_expanded_row.extra_properties',
      children: <ExtraProperties extraProperties={disease.extra_properties} />,
    },
  ];

  return <TDescriptions bordered size="small" items={items} />;
};

interface DiseasesViewProps {
  diseases: Disease[];
}

const DiseasesView = ({ diseases }: DiseasesViewProps) => {
  const columns = useTranslatedTableColumnTitles<Disease>([
    {
      title: 'diseases_table.disease',
      dataIndex: 'term',
      render: (term: OntologyTerm, { excluded }) => (
        <>
          <OntologyTermComponent term={term} />
          {excluded && <Excluded model={ExcludedModel.DISEASE} />}
        </>
      ),
    },
    {
      title: 'diseases_table.onset_age',
      dataIndex: 'onset',
      render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
    },
    {
      title: 'diseases_table.resolution_age',
      dataIndex: 'resolution',
      render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
    },
  ]);

  return (
    <Table<Disease>
      dataSource={diseases}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <DiseaseExpandedRow disease={record} />,
      }}
      rowKey={(record) => record.term.id}
      pagination={false}
      bordered
    />
  );
};

export default DiseasesView;
