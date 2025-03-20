import { useMemo, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Space, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { WIDTH_100P_STYLE } from '@/constants/common';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/utils/search';

import RequestStatusIcon from './RequestStatusIcon';
import SearchFilterInput, { type FilterValue, SearchFilterInputSkeleton } from './SearchFilterInput';

const SearchFilters = ({ onFocus, style }: { onFocus: () => void; style?: CSSProperties }) => {
  const t = useTranslationFn();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const { fieldsStatus, querySections, queryParams } = useSearchQuery();

  const [filterInputs, usedFields] = useMemo(() => {
    const filterInputs_: FilterValue[] = Object.entries(queryParams).map(([k, v]) => ({ field: k, value: v }));

    const fields = querySections.flatMap(({ fields }) => fields.map((f) => f.id));
    const usedFields_ = new Set(filterInputs_.filter((fi) => fi.field !== null).map((fi) => fi.field as string));

    if (
      filterInputs_.length < maxQueryParameters &&
      usedFields_.size < fields.length &&
      ((filterInputs_.at(-1)?.field && filterInputs_.at(-1)?.value) || filterInputs_.length === 0)
    ) {
      filterInputs_.push({ field: null, value: null });
    }
    return [filterInputs_, usedFields_];
  }, [maxQueryParameters, querySections, queryParams]);

  const { filterQueryStatus } = useSearchQuery();

  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        <span style={{ marginRight: '0.5em' }}>
          <FilterOutlined /> {t('Filters')}
        </span>
        {usedFields.size ? <RequestStatusIcon status={filterQueryStatus} /> : null}
      </Typography.Title>
      <Space direction="vertical" size={8} style={WIDTH_100P_STYLE}>
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
                  ...(fv.field && fv.field !== field ? queryParamsWithoutKey(queryParams, fv.field) : queryParams),
                  // ... and if the field stays the same, we will put it back with a new value. Otherwise, we'll put the
                  // new field in with the first available value.
                  [field]: value,
                });
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
                // Don't need to dispatch - the code handling the URL change will dispatch the fetch for us instead.
              }}
              onRemove={() => {
                if (fv.field === null) return;
                const url = buildQueryParamsUrl(pathname, queryParamsWithoutKey(queryParams, fv.field));
                console.debug('[SearchFilters] Redirecting to:', url);
                navigate(url, { replace: true });
              }}
              disabledFields={usedFields}
              {...fv}
            />
          ))
        )}
      </Space>
    </div>
  );
};

export default SearchFilters;
