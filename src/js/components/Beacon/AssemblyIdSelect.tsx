import React from 'react';
import { Form, Select } from 'antd';
import { FormField, BeaconAssemblyIds } from '@/types/beacon';

const AssemblyIdSelect = ({ field, beaconAssemblyIds }: AssemblyIdSelectProps) => {
  const assemblyIdOptions = beaconAssemblyIds.map((assembly) => (
    <Select.Option key={assembly} value={assembly}>
      {assembly}
    </Select.Option>
  ));

  return (
    <Form.Item name={field.name} label={field.name} rules={field.rules}>
      <Select style={{ width: '100%' }}>{assemblyIdOptions}</Select>
    </Form.Item>
  );
};

export interface AssemblyIdSelectProps {
  field: FormField;
  beaconAssemblyIds: BeaconAssemblyIds;
}

export default AssemblyIdSelect;
