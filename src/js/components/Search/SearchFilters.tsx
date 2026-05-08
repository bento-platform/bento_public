import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex, Space, Tooltip, Typography } from 'antd';
import { FilterOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { WAITING_STATES } from '@/constants/requests';
import { TABLE_PAGE_QUERY_PARAM } from '@/features/search/constants';
import { useConfig } from '@/features/config/hooks';
import { useEntityAndTextQueryParams, useSearchFilterFields, useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import {
  buildQueryParamsUrl,
  combineQueryParamsWithoutKey,
  filtersStateToQueryParamEntries,
} from '@/features/search/utils';

import type { QueryParamEntries, QueryParamEntry } from '@/features/search/types';
import SearchFilterInput, { type FilterInputValue, SearchFilterInputSkeleton } from './SearchFilterInput';
import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';
import FiltersAppliedTag from '@/components/Search/FiltersAppliedTag';
const { Text } = Typography;

const buildValueToEntry =
  (f: string) =>
  (v: string | null | undefined): QueryParamEntry => [f, v || ''];

const SearchFilters = ({ vertical, ...props }: DefinedSearchSubFormProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = useTranslationFn();

  const { configStatus, maxQueryParameters } = useConfig();
  const { filterSections, fieldsStatus, filters } = useSearchQuery();

  const fields = useSearchFilterFields();
  const entityAndTextQueryParams = useEntityAndTextQueryParams();

  const nSearchFilters = useMemo(() => filterSections.flatMap((s) => s.fields).length, [filterSections]);

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
    <SearchSubForm
      titleKey="filters_title"
      titleKeyCount={maxQueryParameters}
      icon={<FilterOutlined />}
      vertical={vertical}
      extra={<FiltersAppliedTag />}
      {...props}
    >
      <Space direction="vertical" size={8} className="w-full">
        {WAITING_STATES.includes(configStatus) || WAITING_STATES.includes(fieldsStatus) ? (
          <SearchFilterInputSkeleton />
        ) : (
          filterInputs.map((fv, i) => {
            const onChange = ({ field, value }: FilterInputValue) => {
              if (field === null) return; // Force field to resolve as string type
              console.debug('[SearchFilters] SearchFilterInput onChange called; field =', field, 'value =', value);

              let existingFiltersQP = filtersStateToQueryParamEntries(filters, true);
              let newEntries: QueryParamEntries = [];
              const toEntry = buildValueToEntry(field);

              const oldValue = filters[field];

              if (field in filters && Array.isArray(value)) {
                // same field, array length just changed - special case where we don't want to shift the order if
                // we're just changing the size of the values array.
                if (Array.isArray(oldValue)) {
                  existingFiltersQP = existingFiltersQP.filter(
                    ([k, v]) => k !== field || (k === field && value.includes(v))
                  );
                  // any new values in the array we still need to add to new entries:
                  newEntries = value.filter((v) => !oldValue.includes(v)).map(toEntry);
                } else if (value.length > 0) {
                  // oldValue is not an array, so we're either:
                  //  - adding a new value to an existing value, making a multiple selection ...
                  newEntries = value.filter((v) => oldValue !== v).map(toEntry);
                } else {
                  //  - ... or removing the only value of the field (handled above)
                  existingFiltersQP = existingFiltersQP.map(([k, v]) => [k, k === field ? '' : v]);
                }
              } else if (field in filters && !Array.isArray(value)) {
                // If the field stays the same, we will put it back with a new value.
                existingFiltersQP = existingFiltersQP.map(([k, v]) => [k, k === field ? value || '' : v]);
              } else if (fv.field) {
                // If we change the field in this filter, swap it out with the first instance of the old field and
                // remove other instances of the old field.
                let replaced = false;
                existingFiltersQP = existingFiltersQP
                  .map<QueryParamEntry>(([k, v]) => {
                    if (replaced || k !== fv.field) return [k, v];
                    // replace with new field + first new value or blank:
                    replaced = true;
                    return toEntry(Array.isArray(value) ? value[0] : value);
                  })
                  .filter(([k, _]) => k !== fv.field);
                // If we have multiple new values for our new field (currently not a case which happens), put them in
                newEntries = Array.isArray(value) ? value.slice(1).map(toEntry) : [];
              } else {
                // We're adding a new filter field, so all we have to do is add new entries:
                newEntries = Array.isArray(value) ? value.map(toEntry) : [toEntry(value)];
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
            };

            const onRemove = () => {
              if (fv.field === null) return;
              const filtersStateAsQueryParams = filtersStateToQueryParamEntries(filters, true);
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
            };

            return (
              <SearchFilterInput
                key={i}
                onChange={onChange}
                onRemove={onRemove}
                disabledFields={usedFields}
                vertical={vertical}
                {...fv}
              />
            );
          })
        )}
        {maxQueryParameters < nSearchFilters && (
          <Flex gap={12}>
            <Text type="secondary" className="flex-1">
              {t('search.filters_apply_up_to', { nFilters: maxQueryParameters })}
            </Text>
            <Tooltip title={t('search.filters_max_help')}>
              <Text type="secondary">
                <QuestionCircleOutlined />
              </Text>
            </Tooltip>
          </Flex>
        )}
      </Space>
    </SearchSubForm>
  );
};

export default SearchFilters;
