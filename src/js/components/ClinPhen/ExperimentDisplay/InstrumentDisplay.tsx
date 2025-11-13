import { Typography } from 'antd';

import type { Instrument } from '@/types/clinPhen/experiments/instrument';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { useTranslationFn } from '@/hooks';

import ExtraPropertiesDisplay from '@/components/ClinPhen/PhenopacketDisplay/ExtraPropertiesDisplay';
import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import TDescriptions from '@Util/TDescriptions';

type InstrumentDisplayProps = { instrument: Instrument };

const InstrumentDisplay = ({ instrument }: InstrumentDisplayProps) => {
  const t = useTranslationFn();

  const items: ConditionalDescriptionItem[] = [
    { key: 'description', children: instrument.description },
    {
      // Combined rendering for both device and device ontology
      key: 'device',
      isVisible: !!(instrument.device || instrument.device_ontology),
      children: instrument.device ? (
        instrument.device_ontology ? (
          <>
            {instrument.device} ({t('general.ontology_class')}:{' '}
            <OntologyTermComponent term={instrument.device_ontology} />)
          </>
        ) : (
          instrument.device
        )
      ) : (
        <OntologyTermComponent term={instrument.device_ontology} />
      ),
    },
  ];

  return (
    <div className="instrument">
      <Typography.Title level={4} style={{ fontSize: 14 }}>
        {t('instrument.instrument')}: {instrument.identifier}
      </Typography.Title>
      <TDescriptions bordered size="compact" column={{ lg: 1, xl: 3 }} items={items} defaultI18nPrefix="instrument." />
      <ExtraPropertiesDisplay extraProperties={instrument.extra_properties} />
    </div>
  );
};

export default InstrumentDisplay;
