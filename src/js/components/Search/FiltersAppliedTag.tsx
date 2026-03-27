import { Tag } from 'antd';
import clsx from 'clsx';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';

const FiltersAppliedTag = () => {
  const t = useTranslationFn();
  const { filters, textQuery } = useSearchQuery();

  // # of filters, including text query:
  const nFilters = Object.entries(filters).filter(([_, v]) => !!v).length + +!!textQuery;
  return (
    <Tag className={clsx('filters-applied-tag', nFilters && 'has-filters')} color="green">
      {t('search.filters_applied', { count: nFilters })}
    </Tag>
  );
};

export default FiltersAppliedTag;
