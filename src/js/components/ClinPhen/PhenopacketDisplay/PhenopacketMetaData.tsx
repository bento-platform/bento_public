import { Space } from 'antd';

import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import DateTime from '@Util/DateTime';
import TDescriptions from '@Util/TDescriptions';
import ExternalReference from './ExternalReference';

import { useMemo } from 'react';
import { useTranslationFn } from '@/hooks';

import { objectToBoolean } from '@/utils/boolean';

import type { MetaData, Update } from '@/types/clinPhen/metaData';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

const MetaDataUpdate = ({ index, update }: { index: number; update: Update }) => {
  const t = useTranslationFn();
  return (
    <TDescriptions
      bordered
      size="compact"
      className="fixed-item-label-width"
      column={1}
      title={
        <span>
          {t('phenopacket.update')} {index}
        </span>
      }
      items={[
        { key: 'timestamp', children: <DateTime isoString={update.timestamp} /> },
        { key: 'updated_by', children: <span>{update.updated_by}</span>, isVisible: !!update.updated_by },
        { key: 'comment', children: <span>{update.comment}</span>, isVisible: !!update.comment },
      ]}
      defaultI18nPrefix="phenopacket."
    />
  );
};

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
      { key: 'created', children: <DateTime isoString={metaData.created} />, isVisible: !!metaData.created },
      {
        key: 'updates',
        children: metaData.updates ? (
          <Space direction="vertical">
            {[...metaData.updates]
              .sort(({ timestamp: a }, { timestamp: b }) => -1 * a.localeCompare(b))
              .map((update, uIdx) => (
                <MetaDataUpdate key={uIdx} index={(metaData.updates ?? []).length - uIdx} update={update} />
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
