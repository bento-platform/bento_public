import { Descriptions, DescriptionsProps, Table, Space } from 'antd';
import { Disease } from '@/types/clinPhen/disease';
import OntologyTermComponent from './OntologyTerm';
import TimeElementDisplay from './TimeElementDisplay';
import ExtraProperties from '../Util/ExtraProperties';
import { TimeElement } from '@/types/clinPhen/shared';
import { EM_DASH } from '@/constants/common';
import { Resource } from '@/types/clinPhen/resource';
import { OntologyTerm } from '@/types/ontology';

const DiseaseExpandedRow: React.FC<{ disease: Disease; resources: Resource[] }> = ({ disease, resources }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'disease_stage',
      label: 'Disease Stage(s)',
      children: (
        <Space direction="vertical">
          {disease.disease_stage?.map((stage) => (
            <OntologyTermComponent key={stage.id} term={stage} resources={resources} />
          )) || EM_DASH}
        </Space>
      ),
    },
    {
      key: 'clinical_tnm_finding',
      label: 'Clinical TNM Finding(s)',
      children: (
        <Space direction="vertical">
          {disease.clinical_tnm_finding?.map((finding) => (
            <OntologyTermComponent key={finding.id} term={finding} resources={resources} />
          )) || EM_DASH}
        </Space>
      ),
    },
    {
      key: 'primary_site',
      label: 'Primary Site',
      children: (
        <Space direction="vertical">
          {disease.primary_site ? <OntologyTermComponent term={disease.primary_site} resources={resources} /> : EM_DASH}
        </Space>
      ),
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
  resources: Resource[];
}

const DiseasesView: React.FC<DiseasesViewProps> = ({ diseases, resources }) => {
  const columns = [
    {
      title: 'Disease',
      dataIndex: 'term',
      key: 'term',
      render: (term: OntologyTerm) => <OntologyTermComponent term={term} resources={resources} />,
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
        expandedRowRender: (record) => <DiseaseExpandedRow disease={record} resources={resources} />,
      }}
      rowKey={(record) => record.term.id}
    />
  );
};

export default DiseasesView;
