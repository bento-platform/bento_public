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
// accepts X, Y, etc and any one- or two-digit non-zero number
// note that, eg, polar bears have 37 pairs of chromosomes...
const CHROMOSOME_REGEX = /^([1-9][0-9]?|X|x|Y|y|M|m|MT|mt)$/;

const NUCLEOTIDES_REGEX = /^(a|c|g|t|n|A|C|G|T|N)*$/;
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

const FORM_ITEM_STYLE = { width: '150px', padding: '0 5px 0 0px' };

const VariantsForm = ({ assemblyIdOptions }) => {
  const formStyle = {
    maxWidth: '1200px',
    display: 'flex',
    background: 'white',
    padding: '10px',
    borderRadius: '10px',
  };

  return (
    <div style={formStyle}>
      <Col>
        <Row>
          <VariantInput field={FORM_FIELDS.referenceName} style={FORM_ITEM_STYLE} />
          <VariantInput field={FORM_FIELDS.start} style={FORM_ITEM_STYLE} />
          <VariantInput field={FORM_FIELDS.end} style={FORM_ITEM_STYLE} />
        </Row>
        <Row>
          <VariantInput field={FORM_FIELDS.referenceBases} style={FORM_ITEM_STYLE} />
          <VariantInput field={FORM_FIELDS.alternateBases} style={FORM_ITEM_STYLE} />
          <AssemblyIdSelect field={FORM_FIELDS.assemblyId} options={assemblyIdOptions} style={FORM_ITEM_STYLE} />
        </Row>
      </Col>
    </div>
  );
};

export default VariantsForm;
