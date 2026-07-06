import { Flex, Tag } from 'antd';
import { useTranslationFn } from '@/hooks';

export interface ActiveFilterPill {
  key: string;
  facetLabel: string;
  label: string;
  onClose: () => void;
}

interface ActiveFilterTagsProps {
  pills: ActiveFilterPill[];
  onClearAll: () => void;
}

const ActiveFilterTags = ({ pills, onClearAll }: ActiveFilterTagsProps) => {
  const t = useTranslationFn();
  if (pills.length === 0) return null;
  return (
    <Flex wrap gap={4} align="center">
      {pills.map(({ key, facetLabel, label, onClose }) => (
        <Tag key={key} closable onClose={onClose} className="catalogue-filter-tag">
          <span className="catalogue-filter-tag__facet-label">{t(facetLabel)}:</span>
          {label}
        </Tag>
      ))}
      <Tag className="catalogue-clear-tag" onClick={onClearAll}>
        {t('catalogue.toolbar.clear_all')}
      </Tag>
    </Flex>
  );
};

export default ActiveFilterTags;
