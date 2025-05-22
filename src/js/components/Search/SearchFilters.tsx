import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { WAITING_STATES } from '@/constants/requests';
import { TEXT_QUERY_PARAM } from '@/features/search/constants';
import { useConfig } from '@/features/config/hooks';
import { useNonFilterQueryParams, useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/features/search/utils';

import SearchFilterInput, { type FilterValue, SearchFilterInputSkeleton } from './SearchFilterInput';
import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

const SearchFilters = ({ focused, onFocus, ...props }: DefinedSearchSubFormProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const { fieldsStatus, filterQueryParams } = useSearchQuery();
  const fields = useQueryFilterFields();
  const nonFilterQueryParams = useNonFilterQueryParams();

  const [filterInputs, usedFields] = useMemo(() => {
    const filterInputs_: FilterValue[] = Object.entries(filterQueryParams).map(([k, v]) => ({ field: k, value: v }));

    const usedFields_ = new Set(filterInputs_.filter((fi) => fi.field !== null).map((fi) => fi.field as string));

    if (
      filterInputs_.length < maxQueryParameters &&
      usedFields_.size < fields.length &&
      ((filterInputs_.at(-1)?.field && filterInputs_.at(-1)?.value) || filterInputs_.length === 0)
    ) {
      filterInputs_.push({ field: null, value: null });
    }
    return [filterInputs_, usedFields_];
  }, [maxQueryParameters, fields, filterQueryParams]);

  return (
    <SearchSubForm title="Filters" icon={<FilterOutlined />} focused={focused} onFocus={onFocus} {...props}>
      <Space direction="vertical" size={8} className="w-full">
        {WAITING_STATES.includes(configStatus) || WAITING_STATES.includes(fieldsStatus) ? (
          <SearchFilterInputSkeleton />
        ) : (
          filterInputs.map((fv, i) => (
            <SearchFilterInput
              key={i}
              onFocus={onFocus}
              onChange={({ field, value }) => {
                if (field === null || value === null) return; // Force field to resolve as string type
                const url = buildQueryParamsUrl(pathname, {
                  // If we change the field in this filter, we need to remove it so we can switch to the new field
                  ...(fv.field && fv.field !== field
                    ? queryParamsWithoutKey(filterQueryParams, fv.field)
                    : filterQueryParams),
                  // ... and if the field stays the same, we will put it back with a new value. Otherwise, we'll put the
                  // new field in with the first available value.
                  [field]: value,
                  // plus we need non-filter-related query parameters, except for the text query param since we're not
                  // executing a text query:
                  ...queryParamsWithoutKey(nonFilterQueryParams, TEXT_QUERY_PARAM),
                });
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
                // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
              }}
              onRemove={() => {
                if (fv.field === null) return;
                const url = buildQueryParamsUrl(pathname, {
                  ...queryParamsWithoutKey(filterQueryParams, fv.field),
                  ...queryParamsWithoutKey(nonFilterQueryParams, TEXT_QUERY_PARAM),
                });
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
              }}
              disabledFields={usedFields}
              {...fv}
            />
          ))
        )}
      </Space>
    </SearchSubForm>
  );
};

export default SearchFilters;
