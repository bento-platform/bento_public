import { Flex } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';
import { CloseOutlined } from '@ant-design/icons';

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
        <div key={key} className={clsx('catalogue-filter-tag', tagClassName)}>
          <span className="catalogue-filter-tag__facet-label">{t(facetLabel)}:</span>
          <p className="catalogue-filter-tag__label">{label}</p>
          <button
            aria-label={`${t('catalogue.toolbar.clear_filter')} ${t(facetLabel)} ${label}`}
            data-id={key}
            type="button"
            onClick={onClose}
            className="catalogue-filter-button focus-ring"
          >
            <CloseOutlined aria-hidden="true" />
          </button>
        </div>
      ))}
      <button type="button" className={clsx('catalogue-clear-tag focus-ring', tagClassName)} onClick={onClearAll}>
        {t('catalogue.toolbar.clear_all')}
      </button>
    </Flex>
  );
};

export default ActiveFilterTags;
