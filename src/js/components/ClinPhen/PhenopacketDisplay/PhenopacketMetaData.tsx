import { Space } from 'antd';

import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import TDescriptions from '@Util/TDescriptions';
import ExternalReference from './ExternalReference';

import { useMemo } from 'react';

import { objectToBoolean } from '@/utils/boolean';

import type { MetaData, Update } from '@/types/clinPhen/metaData';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

const MetaDataUpdate = ({ update }: { update: Update }) => (
  <TDescriptions
    items={[
      { key: 'timestamp', children: update.timestamp },
      { key: 'updated_by', children: update.updated_by },
      { key: 'comment', children: update.comment },
    ]}
    defaultI18nPrefix="phenopacket."
  />
);

const PhenopacketMetaData = ({ phenopacket }: { phenopacket: Phenopacket }) => {
  const metaData: MetaData = phenopacket.meta_data;

  const refItems: ConditionalDescriptionItem[] = useMemo(
    () => [
      { key: 'id', children: phenopacket.id },
      {
        key: 'dataset',
        label: 'entities.dataset_one',
        children: phenopacket.dataset,
      },
    ],
    [phenopacket]
  );

  const items: ConditionalDescriptionItem[] = useMemo(
    () => [
      { key: 'phenopacket_schema_version', children: metaData.phenopacket_schema_version },
      { key: 'created_by', children: metaData.created_by },
      { key: 'submitted_by', children: metaData.submitted_by },
      { key: 'created', children: metaData.created },
      {
        key: 'updates',
        children: metaData.updates ? (
          <Space direction="vertical">
            {metaData.updates.map((update, uIdx) => (
              <MetaDataUpdate key={uIdx} update={update} />
            ))}
          </Space>
        ) : null,
        isVisible: objectToBoolean(metaData.updates),
      },
      {
        key: 'external_references',
        children: metaData.external_references ? (
          <Space direction="vertical">
            {metaData.external_references.map((reference) => (
              <ExternalReference key={reference.id} reference={reference} />
            ))}
          </Space>
        ) : null,
        isVisible: objectToBoolean(metaData.external_references),
      },
    ],
    [metaData]
  );

  return (
    <Space direction="vertical" className="w-full">
      <TDescriptions
        bordered
        size="compact"
        className="fixed-item-label-width"
        defaultI18nPrefix="phenopacket."
        items={refItems}
        column={1}
      />
      <TDescriptions
        bordered
        size="compact"
        className="fixed-item-label-width"
        defaultI18nPrefix="phenopacket."
        items={items}
        column={1}
      />
      <ExtraPropertiesDisplay extraProperties={metaData.extra_properties} />
    </Space>
  );
};

export default PhenopacketMetaData;
