import React from 'react';
import { ToolTipText } from './ToolTipText';
import { useTranslationDefault } from '@/hooks';
import { Space, Typography } from 'antd';
const { Title } = Typography;

// complexity of instructions suggests the form isn't intuitive enough
const VARIANTS_INSTRUCTIONS_TITLE = 'Variant search';
const VARIANTS_INSTRUCTIONS_LINE1a =
  'To search for all variants inside a range: fill both "Variant start" and "Variant end",';
const VARIANTS_INSTRUCTIONS_LINE1b =
  'all variants inside the range will be returned. You can optionally filter by reference or alternate bases.';

const VARIANTS_INSTRUCTIONS_LINE2a =
  'To search for a variant at a particular position, either set "Variant end" to the same value in "Variant start",';
const VARIANTS_INSTRUCTIONS_LINE2b = 'or fill in values for both reference and alternate bases.';
const VARIANTS_INSTRUCTIONS_LINE3 = '"Chromosome", "Variant start" and "Assembly ID" are always required.';
const VARIANTS_INSTRUCTIONS_LINE4a = 'Coordinates are one-based.';
const VARIANTS_INSTRUCTIONS_LINE4b = 'Leave this form blank to search by metadata only.';

const VariantsInstructions = () => {
  const td = useTranslationDefault();
  return (
    <Space direction="vertical" style={{ minWidth: '510px' }}>
      <Title level={4} style={{ color: 'white', marginTop: '10px' }}>
        {VARIANTS_INSTRUCTIONS_TITLE}
      </Title>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE1a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE1b)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE2a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE2b)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE3)}</ToolTipText>
      <ToolTipText>{td(VARIANTS_INSTRUCTIONS_LINE4a) + ' ' + td(VARIANTS_INSTRUCTIONS_LINE4b)}</ToolTipText>
    </Space>
  );
};

export default VariantsInstructions;
