import React from 'react';
import { Form, Input } from 'antd';
import { FormField } from '@/types/beacon';

const VariantInput = ({ field }: VariantInputProps) => {
  return (
    <div>
      <Form.Item name={field.name} label={field.name} rules={field.rules}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
    </div>
  );
};

export interface VariantInputProps {
  field: FormField;
}

export default VariantInput;
