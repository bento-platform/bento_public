import React from 'react';
import { Form, Input } from 'antd';

const VariantInput = ({ field, style }) => {
    return (
      <div style={style}>
        <Form.Item name={field.name} label={field.name} rules={field.rules} help={field.help}>
          <Input placeholder={field.placeholder} />
        </Form.Item>
      </div>
    );
  };

  export default VariantInput;
