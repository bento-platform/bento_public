import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { WAITING_STATES } from '@/constants/requests';
import { TABLE_PAGE_QUERY_PARAM } from '@/features/search/constants';
import { useConfig } from '@/features/config/hooks';
import { useEntityAndTextQueryParams, useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';
import {
  buildQueryParamsUrl,
  combineQueryParamsWithoutKey,
  filtersStateToQueryParamEntries,
  queryParamsWithoutKey,
} from '@/features/search/utils';

import type { QueryParamEntries } from '@/features/search/types';
import SearchFilterInput, { type FilterInputValue, SearchFilterInputSkeleton } from './SearchFilterInput';
import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

const SearchFilters = (props: DefinedSearchSubFormProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const { fieldsStatus, filters } = useSearchQuery();

  const fields = useQueryFilterFields();
  const entityAndTextQueryParams = useEntityAndTextQueryParams();

  const [filterInputs, usedFields] = useMemo(() => {
    const filterInputs_: FilterInputValue[] = Object.entries(filters).map(([k, v]) => ({
      field: k,
      value: v,
    }));

    const usedFields_ = new Set(filterInputs_.filter((fi) => fi.field !== null).map((fi) => fi.field as string));

    if (
      filterInputs_.length < maxQueryParameters &&
      usedFields_.size < fields.length &&
      ((filterInputs_.at(-1)?.field && filterInputs_.at(-1)?.value) || filterInputs_.length === 0)
    ) {
      filterInputs_.push({ field: null, value: null });
    }
    return [filterInputs_, usedFields_];
  }, [maxQueryParameters, fields, filters]);

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
                if (field === null) return; // Force field to resolve as string type
                console.debug('[SearchFilters] SearchFilterInput onChange called; field =', field, 'value =', value);

                let existingFiltersQP = filtersStateToQueryParamEntries(filters, false);
                let newEntries: QueryParamEntries = [];

                const oldValue = filters[field];

                if (field in filters && Array.isArray(value)) {
                  // same field, array length just changed - special case where we don't want to shift the order if
                  // we're just changing the size of the values array.
                  if (Array.isArray(oldValue)) {
                    existingFiltersQP = existingFiltersQP.filter(
                      ([k, v]) => k !== field || (k === field && value.includes(v))
                    );
                    // any new values in the array we still need to add to new entries:
                    newEntries = value.filter((v) => !oldValue.includes(v)).map((v) => [field, v || '']);
                  } else if (value.length > 0) {
                    // oldValue is not an array, so we're either:
                    //  - adding a new value to an existing value, making a multiple selection ...
                    newEntries = value.filter((v) => oldValue !== v).map((v) => [field, v || '']);
                  } else {
                    //  - ... or removing the only value of the field (handled above)
                    existingFiltersQP = existingFiltersQP.map(([k, v]) => [k, k === field ? '' : v]);
                  }
                } else if (field in filters && !Array.isArray(value)) {
                  // If the field stays the same, we will put it back with a new value.
                  existingFiltersQP = existingFiltersQP.map(([k, v]) => [k, k === field ? value || '' : v]);
                } else {
                  // If we change the field in this filter, we need to remove it ...
                  existingFiltersQP = queryParamsWithoutKey(
                    existingFiltersQP,
                    fv.field && fv.field !== field ? fv.field : field
                  );
                  // ... and put the new field in.
                  newEntries = Array.isArray(value) ? value.map((v) => [field, v]) : [[field, value || '']];
                }

                const url = buildQueryParamsUrl(pathname, [
                  ...existingFiltersQP,
                  ...newEntries,
                  ...entityAndTextQueryParams,
                  // If we have an entity table page set, we need to reset it to 0 if the filter changes:
                  ...(entityAndTextQueryParams.find(([k, _]) => k === TABLE_PAGE_QUERY_PARAM)
                    ? ([[TABLE_PAGE_QUERY_PARAM, '0']] as QueryParamEntries)
                    : []),
                ]);
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
                // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
              }}
              onRemove={() => {
                if (fv.field === null) return;
                const filtersStateAsQueryParams = filtersStateToQueryParamEntries(filters);
                const url = buildQueryParamsUrl(
                  pathname,
                  // Remove fv.field from query params + ensure no [TEXT_QUERY_PARAM] key.
                  // Also, reset the page if we need to:
                  combineQueryParamsWithoutKey(
                    filtersStateAsQueryParams,
                    [
                      ...entityAndTextQueryParams,
                      ...(entityAndTextQueryParams.find(([k, _]) => k === TABLE_PAGE_QUERY_PARAM)
                        ? ([[TABLE_PAGE_QUERY_PARAM, '0']] as QueryParamEntries)
                        : []),
                    ],
                    [fv.field]
                  )
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
