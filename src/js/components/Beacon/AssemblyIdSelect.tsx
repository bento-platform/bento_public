import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select } from 'antd';
import { FormField, BeaconAssemblyIds } from '@/types/beacon';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

const AssemblyIdSelect = ({ field, beaconAssemblyIds }: AssemblyIdSelectProps) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => (
    <Select.Option key={assembly} value={assembly}>
      {assembly}
    </Select.Option>
  ));

  return (
    <Form.Item name={field.name} label={td(field.name)} rules={field.rules}>
      <Select style={{ width: '100%' }}>{assemblyIdOptions}</Select>
    </Form.Item>
  );
};

export interface AssemblyIdSelectProps {
  field: FormField;
  beaconAssemblyIds: BeaconAssemblyIds;
}

export default AssemblyIdSelect;
