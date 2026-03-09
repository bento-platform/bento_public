import { Tag } from 'antd';
import clsx from 'clsx';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';

const FiltersAppliedTag = () => {
  const t = useTranslationFn();
  const { filters, textQuery } = useSearchQuery();

  const nFilters = Object.keys(filters).length + +!!textQuery; // Filters including text query
  return (
    <Tag className={clsx('filters-applied-tag', nFilters && 'has-filters')} color="green">
      {t('search.filters_applied', { count: nFilters })}
    </Tag>
  );
};

export default FiltersAppliedTag;
