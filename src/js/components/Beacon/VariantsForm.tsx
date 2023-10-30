import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import VariantInput from './VariantInput';
import AssemblyIdSelect from './AssemblyIdSelect';
import { BeaconAssemblyIds } from '@/types/beacon';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';

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

const FORM_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const FORM_ROW_GUTTER: [number, number] = [12, 0];

const VariantsForm = ({ beaconAssemblyIds }: VariantsFormProps) => {
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);
  const formFields = {
    referenceName: {
      name: 'Chromosome',
      rules: [{ pattern: CHROMOSOME_REGEX, message: td('Enter a chromosome name, e.g.: "17" or "X"') }],
      placeholder: '1-22, X, Y, M',
      initialValue: '',
    },
    start: {
      name: 'Variant start',
      rules: [{ pattern: DIGITS_REGEX, message: td('enter a position number, e.g. "100"') }],
      placeholder: `${td('e.g.')} 100`,
      initialValue: '',
    },
    end: {
      name: 'Variant end',
      rules: [{ pattern: DIGITS_REGEX, message: td('enter a position number, e.g. "200"') }],
      placeholder: `${td('e.g.')} 200`,
      initialValue: '',
    },
    referenceBases: {
      name: 'Reference base(s)',
      rules: [{ pattern: NUCLEOTIDES_REGEX, message: td('enter any combination of A, C, G, T, or N') }],
      placeholder: `A, C, G, T ${td('or')} N`,
      initialValue: '',
    },
    alternateBases: {
      name: 'Alternate base(s)',
      rules: [{ pattern: NUCLEOTIDES_REGEX, message: td('enter any combination of A, C, G, T, or N') }],
      placeholder: `A, C, G, T ${td('or')} N`,
      initialValue: '',
    },
    assemblyId: { name: 'Assembly ID', rules: [{}], placeholder: '', initialValue: '' },
  };

  const variantsError = beaconAssemblyIds.includes('error');

  return (
    <div style={FORM_STYLE}>
      <Row gutter={FORM_ROW_GUTTER}>
        <Col span={8}>
          <VariantInput field={formFields.referenceName} disabled={variantsError} />
        </Col>
        <Col span={8}>
          <VariantInput field={formFields.start} disabled={variantsError} />
        </Col>
        <Col span={8}>
          <VariantInput field={formFields.end} disabled={variantsError} />
        </Col>
        <Col span={8}>
          <VariantInput field={formFields.referenceBases} disabled={variantsError} />
        </Col>
        <Col span={8}>
          <VariantInput field={formFields.alternateBases} disabled={variantsError} />
        </Col>
        <Col span={8}>
          <AssemblyIdSelect
            field={formFields.assemblyId}
            beaconAssemblyIds={beaconAssemblyIds}
            disabled={variantsError}
          />
        </Col>
      </Row>
    </div>
  );
};

export interface VariantsFormProps {
  beaconAssemblyIds: BeaconAssemblyIds;
}

export default VariantsForm;
