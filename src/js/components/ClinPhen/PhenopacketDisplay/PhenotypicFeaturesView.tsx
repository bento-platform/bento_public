import { Space } from 'antd';

import OntologyTermComponent, { OntologyTermStack } from '@Util/ClinPhen/OntologyTerm';
import TimeElementDisplay from '@Util/ClinPhen/TimeElementDisplay';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import TDescriptions from '@Util/TDescriptions';
import Excluded, { ExcludedModel } from '@Util/ClinPhen/Excluded';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import ExternalReference from './ExternalReference';

import type { PhenotypicFeature } from '@/types/clinPhen/phenotypicFeature';
import type { OntologyTerm } from '@/types/ontology';
import type { Evidence as EvidenceType, TimeElement } from '@/types/clinPhen/shared';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { objectToBoolean } from '@/utils/boolean';
import { EM_DASH } from '@/constants/common';

interface EvidenceProps {
  evidence?: EvidenceType;
}

const Evidence = ({ evidence }: EvidenceProps) => {
  if (!evidence) {
    return EM_DASH;
  }

  const externalReference = evidence.reference;

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
      children: externalReference ? <ExternalReference reference={externalReference} /> : null,
      isVisible: externalReference,
    },
  ];

  return <TDescriptions bordered={false} column={1} size="compact" items={items} />;
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
  ];
  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions bordered size="compact" items={items} />
      <ExtraPropertiesDisplay extraProperties={feature.extra_properties} />
    </Space>
  );
}

const isPhenotypicFeatureExpandable = (record: PhenotypicFeature) =>
  !!record.description ||
  !!record.modifiers?.length ||
  (record.evidence && record.evidence.length > 0) ||
  objectToBoolean(record.extra_properties);

interface PhenotypicFeaturesViewProps {
  features: PhenotypicFeature[];
}

const PHENOTYPIC_FEATURES_COLUMNS: CustomTableColumns<PhenotypicFeature> = [
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
    alwaysShow: true,
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
    render: (onset: TimeElement) => <TimeElementDisplay element={onset} />,
  },
  {
    title: 'phenotypic_features.resolution',
    dataIndex: 'resolution',
    key: 'resolution',
    render: (resolution: TimeElement) => <TimeElementDisplay element={resolution} />,
  },
];

const PhenotypicFeaturesView = ({ features }: PhenotypicFeaturesViewProps) => {
  return (
    <CustomTable<PhenotypicFeature>
      dataSource={features}
      columns={PHENOTYPIC_FEATURES_COLUMNS}
      expandedRowRender={(record) => <PhenotypicFeatureExpandedRow feature={record} />}
      queryKey="phenotypic_feature"
      rowKey={(record) => record.type.id}
      isRowExpandable={isPhenotypicFeatureExpandable}
    />
  );
};

export default PhenotypicFeaturesView;
