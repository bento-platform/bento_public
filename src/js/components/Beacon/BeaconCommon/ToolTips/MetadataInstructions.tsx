import React from 'react';
import { ToolTipText } from './ToolTipText';
import { useTranslationDefault } from '@/hooks';

const METADATA_INSTRUCTIONS = 'Search over clinical or phenotypic properties.';

export const MetadataInstructions = () => {
  const td = useTranslationDefault();
  return <ToolTipText>{td(METADATA_INSTRUCTIONS)}</ToolTipText>;
};
