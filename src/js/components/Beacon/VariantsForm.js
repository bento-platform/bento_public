import React from 'react';
import { Col, Form, Input, Row, Select } from 'antd';

// TODOs:
// show which fields are required without removing the ability to leave the form blank

// form state has to be one of these:
// empty (except for autofilled assemblyID)
// chrom, start, assemblyID, end
// chrom, start, assemblyID, ref, alt

const VariantsForm = ({ assemblyIdOptions, form }) => {
  const formStyle = {
    maxWidth: '1200px',
    display: 'flex',
    background: 'white',
    padding: '10px',
    borderRadius: '10px',
  };

  // forgiving chromosome regex
  // accepts X, Y, etc and any one- or two-digit non-zero number
  // note that, eg, polar bears have 37 pairs of chromosomes...
  const chromosomeRegex = /^([1-9][0-9]?|X|x|Y|y|M|m|MT|mt)$/;  

  const nucleotidesRegex = /^(a|c|g|t|n|A|C|G|T|N)*$/;
  const digitsRegex = /^[0-9]+$/;

  const formFields = {
    referenceName: {
      name: 'Chromosome',
      rules: [{ pattern: chromosomeRegex, message: 'Enter a chromosome name, eg: "17" or "X"' }],
      placeholder: '1-22, X, Y, M',
      initialValue: '',
      type: 'string',
    },
    start: {
      name: 'Variant start',
      rules: [{ pattern: digitsRegex, message: 'enter a postion number, eg "100"' }],
      placeholder: 'eg 100',
      initialValue: '',
      type: 'number',
    },
    end: {
      name: 'Variant end',
      rules: [{ pattern: digitsRegex, message: 'enter a postion number, eg "200"' }],
      placeholder: 'eg 200',
      initialValue: '',
      type: 'number',
    },
    referenceBases: {
      name: 'Reference base(s)',
      rules: [{ pattern: nucleotidesRegex, message: 'enter any combination of A, C, G, T, or N' }],
      placeholder: 'A, C, G, G, T or N',
      initialValue: '',
      type: 'string',
    },
    alternateBases: {
      name: 'Alternate base(s)',
      rules: [{ pattern: nucleotidesRegex, message: 'enter any combination of A, C, G, T, or N' }],
      placeholder: 'A, C, G, T or N',
      initialValue: '',
      type: 'string',
    },
    assemblyId: { name: 'Assembly ID', rules: [{}], placeholder: '', initialValue: '' },
  };

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
