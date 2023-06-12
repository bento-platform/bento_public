import React from 'react';
import { Form, Select } from 'antd';
import { FormField, AssemblyIdOptionsType } from '@/types/beacon';

const AssemblyIdSelect = ({ field, options }: AssemblyIdSelectProps) => {
  return (
    <Form.Item name={field.name} label={field.name} rules={field.rules} >
      <Select style={{ width: '100%' }}>
        {options}
      </Select>
    </Form.Item>
  );
};

export interface AssemblyIdSelectProps {
  field: FormField;
  options: AssemblyIdOptionsType;
}

export default AssemblyIdSelect;
