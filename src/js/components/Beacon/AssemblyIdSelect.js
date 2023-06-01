import React from 'react';
import { Form, Select } from 'antd';

const AssemblyIdSelect = ({ field, options, style }) => {
  return (
    <Form.Item name={field.name} label={field.name} rules={field.rules} help={field.help} style={style}>
      <Select defaultValue={field.defaultValue} style={{ width: '150px' }}>
        {options}
      </Select>
    </Form.Item>
  );
};

export default AssemblyIdSelect;
