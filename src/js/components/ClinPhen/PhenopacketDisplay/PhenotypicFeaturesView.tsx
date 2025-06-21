import { LinkOutlined } from '@ant-design/icons';

import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraProperties from '@Util/ExtraProperties';
import TDescriptions from '@Util/TDescriptions';
import Excluded, { ExcludedModel } from '@Util/ClinPhen/Excluded';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';

import type { PhenotypicFeature } from '@/types/clinPhen/phenotypicFeature';
import type { OntologyTerm } from '@/types/ontology';
import type { Evidence as EvidenceType, TimeElement } from '@/types/clinPhen/shared';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { objectToBoolean } from '@/utils/boolean';
import { EM_DASH } from '@/constants/common';
import { isValidUrl } from '@/utils/strings';

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

  const items: ConditionalDescriptionItem[] = [
    {
      key: 'evidence_code',
      label: 'phenotypic_features.evidence_code',
      children: <OntologyTermComponent term={evidence.evidence_code} />,
      isVisible: evidence.evidence_code,
    },
    {
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
      isVisible: externalReference,
    },
  ];

  return <TDescriptions bordered={false} column={1} size="small" items={items} />;
};

function PhenotypicFeatureExpandedRow({ feature }: { feature: PhenotypicFeature }) {
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'description',
      label: 'phenotypic_features.description',
      children: feature.description,
    },
    {
      key: 'modifiers',
      label: 'phenotypic_features.modifiers',
      children: <OntologyTermStack terms={feature.modifiers} />,
      isVisible: feature.modifiers?.length,
    },
    {
      key: 'evidence',
      label: 'phenotypic_features.evidence',
      children: feature.evidence?.length ? feature.evidence.map((e, i) => <Evidence key={i} evidence={e} />) : EM_DASH,
      isVisible: feature.evidence?.length,
    },
    {
      key: 'extra_properties',
      label: 'phenotypic_features.extra_properties',
      children: <ExtraProperties extraProperties={feature?.extra_properties} />,
      isVisible: objectToBoolean(feature?.extra_properties),
    },
  ];
  return <TDescriptions bordered size="small" items={items} />;
}

const isPhenotypicFeatureExpandedRowVisible = (record: PhenotypicFeature) =>
  !!record.description ||
  !!record.modifiers?.length ||
  (record.evidence && record.evidence.length > 0) ||
  objectToBoolean(record.extra_properties);

interface PhenotypicFeaturesViewProps {
  features: PhenotypicFeature[];
}

function PhenotypicFeaturesView({ features }: PhenotypicFeaturesViewProps) {
  const columns: CustomTableColumns<PhenotypicFeature> = [
    {
      title: 'phenotypic_features.feature',
      dataIndex: 'type',
      key: 'type',
      render: (type: OntologyTerm, record: PhenotypicFeature) => (
        <>
          <OntologyTermComponent term={type} />
          {record.excluded && <Excluded model={ExcludedModel.PHENOTYPE} />}
        </>
      ),
    },
    {
      title: 'phenotypic_features.severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: OntologyTerm) => <OntologyTermComponent term={severity} />,
      isEmptyDefaultCheck: true,
    },
    {
      title: 'phenotypic_features.onset',
      dataIndex: 'onset',
      key: 'onset',
      render: (onset: TimeElement) => (onset ? <TimeElementDisplay element={onset} /> : EM_DASH),
      isEmptyDefaultCheck: true,
    },
    {
      title: 'phenotypic_features.resolution',
      dataIndex: 'resolution',
      key: 'resolution',
      render: (resolution: TimeElement) => (resolution ? <TimeElementDisplay element={resolution} /> : EM_DASH),
      isEmptyDefaultCheck: true,
    },
  ];
  return (
    <CustomTable<PhenotypicFeature>
      dataSource={features}
      columns={columns}
      expandedRowRender={(record) => <PhenotypicFeatureExpandedRow feature={record} />}
      rowKey={(record) => record.type.id}
      isDataKeyVisible={isPhenotypicFeatureExpandedRowVisible}
    />
  );
}

export default PhenotypicFeaturesView;
