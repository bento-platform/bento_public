import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { useNonFilterQueryParams, useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';
import { buildQueryParamsUrl, combineQueryParamsWithoutKey, queryParamsWithoutKey } from '@/features/search/utils';

import SearchFilterInput, { type FilterValue, SearchFilterInputSkeleton } from './SearchFilterInput';
import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

const SearchFilters = (props: DefinedSearchSubFormProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const { fieldsStatus, filterQueryParams } = useSearchQuery();
  const fields = useQueryFilterFields();
  const nonFilterQueryParams = useNonFilterQueryParams();

  const [filterInputs, usedFields] = useMemo(() => {
    const filterInputs_: FilterValue[] = Object.entries(filterQueryParams).map(([k, v]) => ({ field: k, value: v }));

    const usedFields_ = new Set(filterInputs_.filter((fi) => fi.field !== null).map((fi) => fi.field as string));

    // TODO: future JS target version: use .at(-1) instead of `[...].length - 1`
    if (
      filterInputs_.length < maxQueryParameters &&
      usedFields_.size < fields.length &&
      ((filterInputs_[filterInputs_.length - 1]?.field && filterInputs_[filterInputs_.length - 1]?.value) ||
        filterInputs_.length === 0)
    ) {
      filterInputs_.push({ field: null, value: null });
    }
    return [filterInputs_, usedFields_];
  }, [maxQueryParameters, fields, filterQueryParams]);

  return (
    <SearchSubForm titleKey="filters" icon={<FilterOutlined />} {...props}>
      <Space direction="vertical" size={8} className="w-full">
        {WAITING_STATES.includes(configStatus) || WAITING_STATES.includes(fieldsStatus) ? (
          <SearchFilterInputSkeleton />
        ) : (
          filterInputs.map((fv, i) => (
            <SearchFilterInput
              key={i}
              onChange={({ field, value }) => {
                if (field === null || value === null) return; // Force field to resolve as string type
                console.debug('[SearchFilters] SearchFilterInput onChange called; field =', field, 'value =', value);
                const url = buildQueryParamsUrl(pathname, {
                  // If we change the field in this filter, we need to remove it so we can switch to the new field
                  ...(fv.field && fv.field !== field
                    ? queryParamsWithoutKey(filterQueryParams, fv.field)
                    : filterQueryParams),
                  // ... and if the field stays the same, we will put it back with a new value. Otherwise, we'll put the
                  // new field in with the first available value.
                  [field]: value,
                  ...nonFilterQueryParams,
                });
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
                // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
              }}
              onRemove={() => {
                if (fv.field === null) return;
                const url = buildQueryParamsUrl(
                  pathname,
                  // Remove fv.field from query params + ensure no [TEXT_QUERY_PARAM] key:
                  combineQueryParamsWithoutKey(filterQueryParams, nonFilterQueryParams, [fv.field])
                );
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
