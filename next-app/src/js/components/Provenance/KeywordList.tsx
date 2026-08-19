import { Flex } from 'antd';
import type { StringOrOntologyClass } from '@/types/ontology';
import { useTranslationFn } from '@/hooks';
import ProvenanceTag from '@/components/Util/ProvenanceTag';

const getLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

interface KeywordListProps {
  keywords: StringOrOntologyClass[];
  max?: number;
  className?: string;
}

const KeywordList = ({ keywords, max, className }: KeywordListProps) => {
  const t = useTranslationFn();
  const items = max !== undefined ? keywords.slice(0, max) : keywords;
  if (items.length === 0) return null;
  return (
    <Flex wrap gap={4} className={className}>
      {items.map((k, i) => (
        <ProvenanceTag key={i}>{t(getLabel(k))}</ProvenanceTag>
      ))}
    </Flex>
  );
};

export default KeywordList;
