import { Form, Select } from 'antd';
import { useTranslationFn } from '@/hooks';
import type { FormField, BeaconAssemblyIds } from '@/types/beacon';

const AssemblyIdSelect = ({ field, beaconAssemblyIds, disabled }: AssemblyIdSelectProps) => {
  const t = useTranslationFn();
  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => (
    <Select.Option key={assembly} value={assembly}>
      {assembly}
    </Select.Option>
  ));

  return (
    <Form.Item name={field.name} label={t(field.name)} rules={field.rules}>
      <Select style={{ width: '100%' }} disabled={disabled}>
        {assemblyIdOptions}
      </Select>
    </Form.Item>
  );
};

export interface AssemblyIdSelectProps {
  field: FormField;
  beaconAssemblyIds: BeaconAssemblyIds;
  disabled: boolean;
}

export default AssemblyIdSelect;
