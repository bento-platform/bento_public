import { useEffect, useState } from 'react';

import { Col, Flex, Form, Row } from 'antd';
import type { DefaultOptionType } from 'antd/es/select/index';

import { useTranslationFn } from '@/hooks';
import { useReference } from '@/features/reference/hooks';
import type { Contig } from '@/features/reference/types';
import type { BeaconAssemblyIds } from '@/types/beacon';

import VariantInput from './VariantInput';
import AssemblyIdSelect from './AssemblyIdSelect';

type ContigOptionType = DefaultOptionType & { value: string };

// form state has to be one of these:
// empty (except for autofilled assemblyID)
// chrom, start, assemblyID, end
// chrom, start, assemblyID, ref, alt

const NUCLEOTIDES_REGEX = /^([acgtnACGTN])*$/;
const DIGITS_REGEX = /^\d+$/;

const HUMAN_LIKE_CONTIG_REGEX = /^(?:chr)?(\d+|X|Y|M)$/;
const HUMAN_LIKE_EXCLUDE_CONTIG_REGEX = /^(?:chr)?(\d+|X|Y|M|Un)_.+$/;

const contigToOption = (c: Contig): ContigOptionType => ({ value: c.name });

const contigOptionSort = (a: ContigOptionType, b: ContigOptionType) => {
  const aMatch = a.value.match(HUMAN_LIKE_CONTIG_REGEX);
  const bMatch = b.value.match(HUMAN_LIKE_CONTIG_REGEX);
  if (aMatch) {
    if (bMatch) {
      const aNoPrefix = aMatch[1];
      const bNoPrefix = bMatch[1];
      const aNumeric = !!aNoPrefix.match(DIGITS_REGEX);
      const bNumeric = !!bNoPrefix.match(DIGITS_REGEX);
      if (aNumeric) {
        if (bNumeric) {
          return parseInt(aNoPrefix, 10) - parseInt(bNoPrefix, 10);
        } else {
          return -1;
        }
      } else if (bNumeric) {
        return 1;
      } else {
        return aNoPrefix.localeCompare(bNoPrefix);
      }
    } else {
      // chr## type contigs put before other types
      return -1;
    }
  }
  return a.value.localeCompare(b.value);
};

const filterOutHumanLikeExtraContigs = (opt: ContigOptionType) => !opt.value.match(HUMAN_LIKE_EXCLUDE_CONTIG_REGEX);

const FORM_ROW_GUTTER: [number, number] = [12, 0];

const VariantsForm = ({ isNetworkQuery, beaconAssemblyIds }: VariantsFormProps) => {
  const { genomesByID } = useReference();

  // Pick up form context from outside
  const form = Form.useFormInstance();
  const currentAssemblyID = Form.useWatch('Assembly ID', form);

  const [availableContigs, setAvailableContigs] = useState<ContigOptionType[]>([]);

  useEffect(() => {
    // Right now, we cannot figure out the contig options for the network, so we fall back to a normal input box.
    if (!isNetworkQuery && currentAssemblyID && genomesByID[currentAssemblyID]) {
      setAvailableContigs(
        genomesByID[currentAssemblyID].contigs
          .map(contigToOption)
          .sort(contigOptionSort)
          .filter(filterOutHumanLikeExtraContigs)
      );
    } else {
      // Keep existing memory address for existing empty array if availableContigs was already empty, to avoid
      // re-render/clearing effect.
      setAvailableContigs((ac) => (ac.length ? [] : ac));
    }
  }, [isNetworkQuery, currentAssemblyID, genomesByID]);

  const assemblySelect = !!availableContigs.length;

  useEffect(() => {
    // Clear contig value when list of available contigs changes:
    form.setFieldValue('Chromosome', '');
  }, [form, availableContigs]);

  const t = useTranslationFn();
  const formFields = {
    referenceName: {
      name: 'Chromosome',
      placeholder: !isNetworkQuery && !currentAssemblyID ? t('beacon.select_asm') : '',
      initialValue: '',
    },
    start: {
      name: 'Variant start',
      rules: [{ pattern: DIGITS_REGEX, message: t('Enter a position number, e.g. "100"') }],
      placeholder: `${t('e.g.')} 100`,
      initialValue: '',
    },
    end: {
      name: 'Variant end',
      rules: [{ pattern: DIGITS_REGEX, message: t('Enter a position number, e.g. "200"') }],
      placeholder: `${t('e.g.')} 200`,
      initialValue: '',
    },
    referenceBases: {
      name: 'Reference base(s)',
      rules: [{ pattern: NUCLEOTIDES_REGEX, message: t('Enter any combination of A, C, G, T, or N') }],
      placeholder: `A, C, G, T ${t('or')} N`,
      initialValue: '',
    },
    alternateBases: {
      name: 'Alternate base(s)',
      rules: [{ pattern: NUCLEOTIDES_REGEX, message: t('Enter any combination of A, C, G, T, or N') }],
      placeholder: `A, C, G, T ${t('or')} N`,
      initialValue: '',
    },
    assemblyId: { name: 'Assembly ID', placeholder: '', initialValue: '' },
  };

  const variantsError = beaconAssemblyIds.includes('error');

  return (
    <Flex vertical={true}>
      <Row gutter={FORM_ROW_GUTTER}>
        <Col span={8}>
          <VariantInput
            field={formFields.referenceName}
            disabled={variantsError || (!isNetworkQuery && !currentAssemblyID)}
            mode={assemblySelect ? { type: 'select', options: availableContigs } : { type: 'input' }}
          />
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
    </Flex>
  );
};

export interface VariantsFormProps {
  isNetworkQuery?: boolean;
  beaconAssemblyIds: BeaconAssemblyIds;
}

export default VariantsForm;
