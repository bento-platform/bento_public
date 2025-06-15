import { type DescriptionsProps, Space, Table } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraProperties from '@Util/ExtraProperties';
import TDescriptions from '@Util/TDescriptions';
import Excluded, { ExcludedModel } from '@Util/ClinPhen/Excluded';

import type { PhenotypicFeature } from '@/types/clinPhen/phenotypicFeature';
import type { OntologyTerm } from '@/types/ontology';
import type { Evidence as EvidenceType, TimeElement } from '@/types/clinPhen/shared';

import { isValidUrl } from '@/utils/strings';
import { EM_DASH } from '@/constants/common';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useTranslationFn } from '@/hooks';

interface EvidenceProps {
  evidence?: EvidenceType;
}

const Evidence = ({ evidence }: EvidenceProps) => {
  const t = useTranslationFn();

  if (!evidence) {
    return EM_DASH;
  }

  const externalReference = evidence.reference;
  const hasReferenceUrl = isValidUrl(externalReference?.reference);

  const items: DescriptionsProps['items'] = [
    {
      key: 'evidence_code',
      label: 'phenotypic_features.evidence_code',
      children: <OntologyTermComponent term={evidence.evidence_code} />,
    },
    externalReference && {
      key: 'reference',
      label: 'phenotypic_features.reference',
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
              <strong>{t('Description')}:</strong> {t(externalReference?.description)}
              <br />
            </>
          )}
        </>
      ),
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return <TDescriptions bordered={false} column={1} size="small" items={items} />;
};

function PhenotypicFeatureExpandedRow({ feature }: { feature: PhenotypicFeature }) {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'phenotypic_features.description',
      children: feature.description || EM_DASH,
    },
    {
      key: 'modifiers',
      label: 'phenotypic_features.modifiers',
      children: feature.modifiers?.length ? (
        <Space direction="vertical">
          {feature.modifiers.map((m) => (
            <OntologyTermComponent key={m.id} term={m} />
          ))}
        </Space>
      ) : (
        EM_DASH
      ),
    },
    {
      key: 'evidence',
      label: 'phenotypic_features.evidence',
      children: feature.evidence?.length ? feature.evidence.map((e, i) => <Evidence key={i} evidence={e} />) : EM_DASH,
    },
    {
      key: 'extra_properties',
      label: 'phenotypic_features.extra_properties',
      children: <ExtraProperties extraProperties={feature?.extra_properties} />,
    },
  ];
  return <TDescriptions bordered size="small" items={items} />;
}

interface PhenotypicFeaturesViewProps {
  features: PhenotypicFeature[];
}

function PhenotypicFeaturesView({ features }: PhenotypicFeaturesViewProps) {
  const columns = useTranslatedTableColumnTitles<PhenotypicFeature>([
    {
      title: 'phenotypic_features.feature',
      dataIndex: 'type',
      key: 'type',
      render: (type: OntologyTerm, { excluded }: PhenotypicFeature) => (
        <>
          <OntologyTermComponent term={type} />
          {excluded && <Excluded model={ExcludedModel.PHENOTYPE} />}
        </>
      ),
    },
    {
      title: 'phenotypic_features.severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: OntologyTerm) => <OntologyTermComponent term={severity} />,
    },
    {
      title: 'phenotypic_features.onset',
      dataIndex: 'onset',
      key: 'onset',
      render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
    },
    {
      title: 'phenotypic_features.resolution',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
    },
  ]);
  return (
    <Table<PhenotypicFeature>
      dataSource={features}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <PhenotypicFeatureExpandedRow feature={record} />,
      }}
      rowKey={(record) => record.type.id}
      pagination={false}
      bordered
    />
  );
}

export default PhenotypicFeaturesView;
