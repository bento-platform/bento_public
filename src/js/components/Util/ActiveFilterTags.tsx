import { Flex, Tag } from 'antd';
import clsx from 'clsx';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
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
  /** Extra class applied to each tag, e.g. for a larger variant on a specific page. */
  tagClassName?: string;
}

const ActiveFilterTags = ({ pills, onClearAll, tagClassName }: ActiveFilterTagsProps) => {
  const t = useTranslationFn();
  if (pills.length === 0) return null;
  return (
    <Flex wrap gap={4} align="center">
      {pills.map(({ key, facetLabel, label, onClose }) => (
        <Tag key={key} closable onClose={onClose} className={clsx('catalogue-filter-tag', tagClassName)}>
          <span className="catalogue-filter-tag__facet-label">{t(facetLabel, T_SINGULAR_COUNT)}:</span>
          {/* Don't translate the label here to allow pill providers to decide on whether a pill gets translated
              (known filter values) or not, e.g., free text search. */}
          {label}
        </Tag>
      ))}
      <Tag className={clsx('catalogue-clear-tag', tagClassName)} onClick={onClearAll}>
        {t('catalogue.toolbar.clear_all')}
      </Tag>
    </Flex>
  );
};

export default ActiveFilterTags;
