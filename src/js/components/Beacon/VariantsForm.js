import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';

TODOs:
// some form validation
// show which fields are required without removing the ability to leave the form blank

const FORM_FIELDS = [
  {
    key: 'referenceName',
    name: 'Chromosome',
    rules: [{}],
    placeholder: '1-22, X, Y, MT',
    initialValue: '',
  },
  { key: 'start', name: 'Variant start', rules: [{}], placeholder: 'eg 100', initialValue: '' },
  { key: 'end', name: 'Variant end', rules: [{}], placeholder: 'eg 200', initialValue: '' },
  {
    key: 'referenceBases',
    name: 'Reference base(s)',
    rules: [{}],
    placeholder: 'A, C, G, T or N',
    initialValue: '',
  },
  {
    key: 'alternateBases',
    name: 'Alternate base(s)',
    rules: [{}],
    placeholder: 'A, C, G, T, N or empty',
    initialValue: '',
  },
  {
    key: 'assemblyId',
    name: 'Assembly Id',
    rules: [{}],
    placeholder: '',
    initialValue: '',
  },
];

const VariantsForm = ({ assemblyIdOptions, form }) => {
  const formStyle = {
    maxWidth: '1200px',
    display: 'flex',
    background: "white",
    padding: "10px",
    borderRadius: '10px'
  };

  const formItemLayout = {
    style: {width: "150px", padding: "0 5px 0 5px"}
  };

  return (
    <div style={formStyle}>
      <Col>
        <Row>
          {FORM_FIELDS.slice(0, 3).map((f) => (
            <Form.Item key={f.key} name={f.name} label={f.name} rules={f.rules} help={f.help} {...formItemLayout}>
              <Input placeholder={f.placeholder} />
            </Form.Item>
          ))}
        </Row>
        <Row>
          {FORM_FIELDS.slice(3).map((f) => (
            <Form.Item key={f.key} name={f.name} label={f.name} rules={f.rules} help={f.help} {...formItemLayout}>
              {f.key != 'assemblyId' ? (
                <Input placeholder={f.placeholder} />
              ) : (
                <Select defaultValue={f.defaultValue} style={{width: "150px"}}>{assemblyIdOptions}</Select>
              )}
            </Form.Item>
          ))}
        </Row>
      </Col>
    </div>
  );
};

export default VariantsForm;
