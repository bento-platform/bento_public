import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input } from 'antd';
import { FormField } from '@/types/beacon';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

const VariantInput = ({ field }: VariantInputProps) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  return (
    <div>
      <Form.Item name={field.name} label={td(field.name)} rules={field.rules}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
    </div>
  );
};

export interface VariantInputProps {
  field: FormField;
}

export default VariantInput;
