import { ToolTipText } from './ToolTipText';
import { useTranslationFn } from '@/hooks';

const METADATA_INSTRUCTIONS = 'Search over clinical or phenotypic properties.';

export const MetadataInstructions = () => {
  const t = useTranslationFn();
  return <ToolTipText>{t(METADATA_INSTRUCTIONS)}</ToolTipText>;
};
