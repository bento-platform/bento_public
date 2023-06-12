import React from 'react';
import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form'; 

const VariantInput = ({ field }: VariantInputProps) => {
  return (
    <div >
      <Form.Item name={field.name} label={field.name} rules={field.rules} help={field.help}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
    </div>
  );
};

export interface FormField {
  name: string;
  rules: Rule[];
  placeholder: string;
  initialValue: string;
  type: string;
  help?: string
}

export interface VariantInputProps {
  field: FormField
}

export default VariantInput;
