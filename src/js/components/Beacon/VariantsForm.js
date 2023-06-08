import React from 'react';
import { Col, Row } from 'antd';
import VariantInput from './VariantInput';
import AssemblyIdSelect from './AssemblyIdSelect';

// TODOs:
// show which fields are required without removing the ability to leave the form blank

// form state has to be one of these:
// empty (except for autofilled assemblyID)
// chrom, start, assemblyID, end
// chrom, start, assemblyID, ref, alt

// forgiving chromosome regex
// accepts X, Y, etc. and any one- or two-digit non-zero number
// note that, eg, polar bears have 37 pairs of chromosomes...
const CHROMOSOME_REGEX = /^([1-9][0-9]?|X|x|Y|y|M|m|MT|mt)$/;

const NUCLEOTIDES_REGEX = /^([acgtnACGTN])*$/;
const DIGITS_REGEX = /^[0-9]+$/;

const FORM_FIELDS = {
  referenceName: {
    name: 'Chromosome',
    rules: [{ pattern: CHROMOSOME_REGEX, message: 'Enter a chromosome name, eg: "17" or "X"' }],
    placeholder: '1-22, X, Y, M',
    initialValue: '',
    type: 'string',
  },
  start: {
    name: 'Variant start',
    rules: [{ pattern: DIGITS_REGEX, message: 'enter a postion number, eg "100"' }],
    placeholder: 'eg 100',
    initialValue: '',
    type: 'number',
  },
  end: {
    name: 'Variant end',
    rules: [{ pattern: DIGITS_REGEX, message: 'enter a postion number, eg "200"' }],
    placeholder: 'eg 200',
    initialValue: '',
    type: 'number',
  },
  referenceBases: {
    name: 'Reference base(s)',
    rules: [{ pattern: NUCLEOTIDES_REGEX, message: 'enter any combination of A, C, G, T, or N' }],
    placeholder: 'A, C, G, G, T or N',
    initialValue: '',
    type: 'string',
  },
  alternateBases: {
    name: 'Alternate base(s)',
    rules: [{ pattern: NUCLEOTIDES_REGEX, message: 'enter any combination of A, C, G, T, or N' }],
    placeholder: 'A, C, G, T or N',
    initialValue: '',
    type: 'string',
  },
  assemblyId: { name: 'Assembly ID', rules: [{}], placeholder: '', initialValue: '' },
};

const FORM_STYLE = {
  display: 'flex',
  flexDirection: 'column',
};
const FORM_ROW_GUTTER = [12, 0];

const VariantsForm = ({ assemblyIdOptions }) => {
  return (
    <div style={FORM_STYLE}>
      <Row gutter={FORM_ROW_GUTTER}>
        <Col span={8}><VariantInput field={FORM_FIELDS.referenceName} /></Col>
        <Col span={8}><VariantInput field={FORM_FIELDS.start} /></Col>
        <Col span={8}><VariantInput field={FORM_FIELDS.end} /></Col>
        <Col span={8}><VariantInput field={FORM_FIELDS.referenceBases} /></Col>
        <Col span={8}><VariantInput field={FORM_FIELDS.alternateBases} /></Col>
        <Col span={8}>
          <AssemblyIdSelect field={FORM_FIELDS.assemblyId} options={assemblyIdOptions} />
        </Col>
      </Row>
    </div>
  );
};

export default VariantsForm;
