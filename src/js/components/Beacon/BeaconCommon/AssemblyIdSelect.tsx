import { Form, Select } from 'antd';
import { WIDTH_100P_STYLE } from '@/constants/common';
import { useTranslationFn } from '@/hooks';
import type { FormField, BeaconAssemblyIds } from '@/types/beacon';

const AssemblyIdSelect = ({ field, beaconAssemblyIds, disabled }: AssemblyIdSelectProps) => {
  const t = useTranslationFn();
  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => ({ value: assembly, label: assembly }));

  return (
    <Form.Item name={field.name} label={t(field.name)} rules={field.rules}>
      <Select style={WIDTH_100P_STYLE} disabled={disabled} options={assemblyIdOptions} />
    </Form.Item>
  );
};

export interface AssemblyIdSelectProps {
  field: FormField;
  beaconAssemblyIds: BeaconAssemblyIds;
  disabled: boolean;
}

export default AssemblyIdSelect;
