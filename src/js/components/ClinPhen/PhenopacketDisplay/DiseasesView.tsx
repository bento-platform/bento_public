import { Descriptions, Table } from 'antd';

import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraProperties from '@Util/ExtraProperties';

import type { DescriptionsProps } from 'antd';
import type { Disease } from '@/types/clinPhen/disease';
import type { TimeElement } from '@/types/clinPhen/shared';
import type { OntologyTerm } from '@/types/ontology';

import { EM_DASH } from '@/constants/common';

const DiseaseExpandedRow = ({ disease }: { disease: Disease }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'disease_stage',
      label: 'Disease Stage(s)',
      children: disease.disease_stage ? <OntologyTermStack terms={disease.disease_stage} /> : EM_DASH,
    },
    {
      key: 'clinical_tnm_finding',
      label: 'Clinical TNM Finding(s)',
      children: disease.clinical_tnm_finding ? <OntologyTermStack terms={disease.clinical_tnm_finding} /> : EM_DASH,
    },
    {
      key: 'primary_site',
      label: 'Primary Site',
      children: disease.primary_site ? <OntologyTermComponent term={disease.primary_site} /> : EM_DASH,
    },
    {
      key: 'extra_properties',
      label: 'Extra Properties',
      children: <ExtraProperties extraProperties={disease.extra_properties} />,
    },
  ];

  return <Descriptions bordered size="small" items={items} />;
};

interface DiseasesViewProps {
  diseases: Disease[];
}

const DiseasesView = ({ diseases }: DiseasesViewProps) => {
  const columns = [
    {
      title: 'Disease',
      dataIndex: 'term',
      key: 'term',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} />,
    },
    {
      title: 'Onset Age',
      dataIndex: 'onset',
      key: 'onset',
      render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
    },
    {
      title: 'Resolution Age',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
    },
  ];

  return (
    <Table<Disease>
      dataSource={diseases}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <DiseaseExpandedRow disease={record} />,
      }}
      rowKey={(record) => record.term.id}
    />
  );
};

export default DiseasesView;
