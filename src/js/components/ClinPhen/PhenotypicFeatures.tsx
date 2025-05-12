import { Descriptions, DescriptionsProps, Table } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { Resource } from '@/types/clinPhen/resource';
import type { PhenotypicFeature } from '@/types/clinPhen/phenotypicFeature';
import OntologyTermComponent from './OntologyTerm';
import { EM_DASH } from '@/constants/common';
import { OntologyTerm } from '@/types/ontology';
import { TimeElement } from '@/types/clinPhen/shared';
import TimeElementDisplay from './TimeElementDisplay';
import { Space } from 'antd';
import { isValidUrl } from '@/utils/strings';

import type { Evidence as EvidenceType } from '@/types/clinPhen/shared';
import ExtraProperties from '../Util/ExtraProperties';

interface EvidenceProps {
  evidence?: EvidenceType;
  resources: Resource[];
}

const Evidence = ({ evidence, resources }: EvidenceProps) => {
  if (!evidence) {
    return EM_DASH;
  }

  const externalReference = evidence.reference;
  const hasReferenceUrl = isValidUrl(externalReference?.reference);

  const items: DescriptionsProps['items'] = [
    {
      key: 'evidence_code',
      label: 'Evidence Code',
      children: <OntologyTermComponent term={evidence.evidence_code} resources={resources} />,
    },
    externalReference && {
      key: 'reference',
      label: 'Reference',
      children: (
        <>
          {externalReference?.id && (
            <>
              <strong>ID:</strong> {externalReference.id}{' '}
              {hasReferenceUrl && (
                <a href={externalReference.reference} target="_blank" rel="noopener noreferrer">
                  <LinkOutlined />
                </a>
              )}
              <br />
            </>
          )}
          {externalReference?.description && (
            <>
              <strong>Description:</strong> {externalReference?.description}
              <br />
            </>
          )}
        </>
      ),
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return <Descriptions bordered={false} column={1} size="small" items={items} />;
};

function PhenotypicFeatureExpandedRow({ feature, resources }: { feature: PhenotypicFeature; resources: Resource[] }) {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'Description',
      children: feature.description || EM_DASH,
    },
    {
      key: 'modifiers',
      label: 'Modifiers',
      children: feature.modifiers?.length ? (
        <Space direction="vertical">
          {feature.modifiers.map((m) => (
            <OntologyTermComponent key={m.id} term={m} resources={resources} />
          ))}
        </Space>
      ) : (
        EM_DASH
      ),
    },
    {
      key: 'evidence',
      label: 'Evidence',
      children: feature.evidence?.length
        ? feature.evidence.map((e, i) => <Evidence key={i} evidence={e} resources={resources} />)
        : EM_DASH,
    },
    {
      key: 'extra_properties',
      label: 'Extra Properties',
      children: <ExtraProperties extraProperties={feature?.extra_properties} />,
    },
  ] as DescriptionsProps['items'];
  return <Descriptions bordered size="small" items={items} />;
}

interface PhenotypicFeaturesViewProps {
  features: PhenotypicFeature[];
  resources: Resource[];
}

function PhenotypicFeaturesView({ features, resources }: PhenotypicFeaturesViewProps) {
  const columns = [
    {
      title: 'Feature',
      dataIndex: 'type',
      key: 'type',
      render: (type: OntologyTerm) => <OntologyTermComponent term={type} resources={resources} />,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: OntologyTerm) =>
        severity ? <OntologyTermComponent term={severity} resources={resources} /> : EM_DASH,
    },
    {
      title: 'Onset',
      dataIndex: 'onset',
      key: 'onset',
      render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
    },
    {
      title: 'Resolution',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
    },
  ];
  return (
    <Table<PhenotypicFeature>
      dataSource={features}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <PhenotypicFeatureExpandedRow feature={record} resources={resources} />,
      }}
      rowKey={(record) => record.type.id}
    />
  );
}

export default PhenotypicFeaturesView;
