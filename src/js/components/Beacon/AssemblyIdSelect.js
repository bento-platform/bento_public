import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select } from 'antd';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

const AssemblyIdSelect = ({ field, options, style }) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  return (
    <Form.Item name={field.name} label={td(field.name)} rules={field.rules} help={field.help} style={style}>
      <Select defaultValue={field.defaultValue} style={{ width: '100%' }}>
        {options}
      </Select>
    </Form.Item>
  );
};

export default AssemblyIdSelect;
