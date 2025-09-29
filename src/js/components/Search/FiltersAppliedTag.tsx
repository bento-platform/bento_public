import { Tag } from 'antd';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';

const FiltersAppliedTag = () => {
  const t = useTranslationFn();
  const { filterQueryParams, textQuery } = useSearchQuery();

  const nFilters = Object.keys(filterQueryParams).length + +!!textQuery; // Filters including text query
  return (
    <Tag className={'filters-applied-tag' + (nFilters ? ' has-filters' : '')} color="green">
      {t('search.filters_applied', { count: nFilters })}
    </Tag>
  );
};

export default FiltersAppliedTag;
