import { EM_DASH } from '@/constants/common';
import JsonView from './JsonView';
import type { JSONType } from '@/types/json';

interface ExtraPropertiesProps {
  extraProperties: JSONType;
}

function ExtraProperties({ extraProperties }: ExtraPropertiesProps) {
  if (!extraProperties || Object.keys(extraProperties).length === 0) {
    return EM_DASH;
  }
  return <JsonView src={extraProperties} />;
}

export default ExtraProperties;
