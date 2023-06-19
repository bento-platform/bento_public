import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input } from 'antd';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

const VariantInput = ({ field, style }) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  return (
    <div style={style}>
      <Form.Item name={field.name} label={td(field.name)} rules={field.rules} help={field.help}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
    </div>
  );
};

export default VariantInput;
