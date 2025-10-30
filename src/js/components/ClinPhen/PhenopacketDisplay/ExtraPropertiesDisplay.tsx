import type { JSONObject } from '@/types/json';
import JsonView from '@Util/JsonView';
import TDescriptions from '@Util/TDescriptions';
import { EM_DASH } from '@/constants/common';

const ExtraPropertiesDisplay = ({ extraProperties }: { extraProperties?: JSONObject }) => {
  const extraPropertiesFinal = Object.entries(extraProperties ?? {}).map(([key, value]) => ({
    key,
    label: key,
    children: (typeof value === 'string' || typeof value === 'number' ? value : <JsonView src={value} />) ?? EM_DASH,
  }));

  return (
    <>
      {!!extraPropertiesFinal.length && (
        <TDescriptions items={extraPropertiesFinal} column={1} bordered size="compact" />
      )}
    </>
  );
};

export default ExtraPropertiesDisplay;
