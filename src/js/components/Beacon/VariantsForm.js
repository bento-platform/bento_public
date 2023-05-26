import React from 'react';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';

// TODOs:
// some form validation
// show which fields are required without removing the ability to leave the form blank

// chrom
// start
// assemblyId
// end OR (alt + ref)
// (end OR alternate)

// so form state has to be one of these:
// empty (except for autofilled assemblyID)
// chrom, start, assemblyID, end
// chrom, start, assemblyID, ref, alt

const VariantsForm = ({ assemblyIdOptions, form }) => {
  console.log({ form });

  const formStyle = {
    maxWidth: '1200px',
    display: 'flex',
    background: 'white',
    padding: '10px',
    borderRadius: '10px',
  };

  const formFields = {
    referenceName: { name: 'Chromosome', rules: [{}], placeholder: '1-22, X, Y, MT', initialValue: '', type: 'string' },
    start: {
      name: 'Variant start',
      rules: [{}],
      placeholder: 'eg 100',
      initialValue: '',
      type: 'number',
    },
    end: {
      name: 'Variant end',
      rules: [{}],
      placeholder: 'eg 200',
      initialValue: '',
      type: 'number',
    },
    referenceBases: {
      name: 'Reference base(s)',
      rules: [{}],
      placeholder: 'A, C, G, T or N',
      initialValue: '',
      type: 'string',
    },
    alternateBases: {
      name: 'Alternate base(s)',
      rules: [{}],
      placeholder: 'A, C, G, T or N',
      initialValue: '',
      type: 'string',
    },
    assemblyId: { name: 'Assembly ID', rules: [{}], placeholder: '', initialValue: '' },
  };

  const isChromosome = (c) => {
    // forgiving chromosome regex that accepts X, Y, M or any number with one or two digits
    const chrRegex = /^([0-9]{1,2}|X|x|Y|y|M|m)$/;
    return chrRegex.test(c);
  };

  const isNucleotide = (n) => {
    const nucRegex = /(a|c|g|t|n|A|C|G|T|N)*/;
    return nucRegex.test(n);
  };

  const hasDigitsOnly = (d) => {
    // non-empty string of digits
    const digitsRegex = /^[0-9]+$/;
    return digitsRegex.test(d);
  };

  const handleChange = (e) => {
    console.log({e})
  }

  const formItemStyle = { width: '150px', padding: '0 5px 0 0px' };

  const VariantInput = ({ field }) => {
    return (
      <div style={formItemStyle}>
      <Form.Item name={field.name} label={field.name} rules={field.rules} help={field.help}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
      </div>
    );
  };

  const AssemblyIdSelect = ({ field, options }) => {
    return (
      <Form.Item name={field.name} label={field.name} rules={field.rules} help={field.help} style={formItemStyle}>
        <Select defaultValue={field.defaultValue} style={{ width: '150px' }}>
          {options}
        </Select>
      </Form.Item>
    );
  };

  return (
    <div style={formStyle}>
      <Col>
        <Row>
          <VariantInput field={formFields.referenceName} />
          <VariantInput field={formFields.start} />
          <VariantInput field={formFields.end} />
        </Row>
        <Row>
          <VariantInput field={formFields.referenceBases} />
          <VariantInput field={formFields.alternateBases} />
          <AssemblyIdSelect field={formFields.assemblyId} options={assemblyIdOptions} />
        </Row>
      </Col>
    </div>
  );
};

export default VariantsForm;
