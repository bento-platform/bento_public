import { Flex, Tag, type TagProps } from 'antd';
import type { StringOrOntologyClass } from '@/types/ontology';
import { useTranslationFn } from '@/hooks';

// TODO: display as actual ontology class with injected resource
const keywordLabel = (k: StringOrOntologyClass): string => (typeof k === 'string' ? k : k.label);

const TagDisplay = ({
  tags,
  color,
  tagClass,
}: {
  tags: StringOrOntologyClass[];
  color: TagProps['color'];
  tagClass?: string | ((k: StringOrOntologyClass) => string);
}) => {
  const t = useTranslationFn();
  return (
    <Flex wrap>
      {tags.map((k, i) => (
        <Tag
          key={i}
          color={color}
          className={typeof tagClass === 'function' ? tagClass(k) : tagClass}
          style={{ marginBottom: 2 }}
        >
          {t(keywordLabel(k))}
        </Tag>
      ))}
    </Flex>
  );
};

export default TagDisplay;
