import { Flex } from 'antd';
import clsx from 'clsx';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import type { ReactNode } from 'react';
import { useTranslationFn } from '@/hooks';
import { CloseOutlined } from '@ant-design/icons';

export interface ActiveFilterPill {
  key: string;
  facetLabel: string;
  label: ReactNode;
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
    <Flex
      wrap
      gap={4}
      align="center"
      role="group"
      aria-label={`${pills.length} ${t('catalogue.toolbar.active_filters')}`}
    >
      {pills.map(({ key, facetLabel, label, onClose }) => (
        <div key={key} className={clsx('catalogue-filter-tag', tagClassName)}>
          <span className="catalogue-filter-tag__facet-label">{t(facetLabel, T_SINGULAR_COUNT)}:</span>
          {/* Don't translate the label here to allow pill providers to decide on whether a pill gets translated
              (known filter values) or not, e.g., free text search. */}
          <span className="catalogue-filter-tag__label">{label}</span>
          <button
            aria-label={`${t('catalogue.toolbar.clear_filter')} ${t(facetLabel, T_SINGULAR_COUNT)} ${label}`}
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
