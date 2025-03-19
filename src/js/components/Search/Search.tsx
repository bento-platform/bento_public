import { type CSSProperties, memo, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Flex, FloatButton, Input, Row, Select, Space, Typography } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  FilterOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { queryData } from 'bento-auth-js';

import OptionDescription from './OptionDescription';
import SearchResults from './SearchResults';

import { useConfig } from '@/features/config/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { makeGetKatsuPublic, setQueryParams } from '@/features/search/query.store';
import { useAppDispatch, useHasScopePermission, useTranslationFn } from '@/hooks';
import { buildQueryParamsUrl, queryParamsWithoutKey } from '@/utils/search';

import Loader from '@/components/Loader';
import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';
import { WIDTH_100P_STYLE } from '@/constants/common';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { RequestStatus } from '@/types/requests';
import type { QueryParams } from '@/types/search';

const checkQueryParamsEqual = (qp1: QueryParams, qp2: QueryParams): boolean => {
  const qp1Keys = Object.keys(qp1);
  const qp2Keys = Object.keys(qp2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce((acc, v) => acc && qp1[v] === qp2[v], true);
};

const RoutedSearch = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const {
    querySections: searchSections,
    queryParams,
    fieldsStatus: searchFieldsStatus,
    dataStatus: searchQueryStatus,
  } = useSearchQuery();

  const searchFields = useMemo(
    () => searchSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [searchSections]
  );

  const validateQuery = useCallback(
    (query: URLSearchParams): { valid: boolean; validQueryParamsObject: QueryParams } => {
      const validateQueryParam = (key: string, value: string): boolean => {
        const field = searchFields.find((e) => e.id === key);
        return Boolean(field && field.options.includes(value));
      };

      const queryParamArray = Array.from(query.entries()).map(([key, value]) => ({ key, value }));

      // TODO: to disable max query parameters, slice with allowedQueryParamsCount instead
      const validQueryParamArray = queryParamArray
        .filter(({ key, value }) => validateQueryParam(key, value))
        .slice(0, maxQueryParameters);

      const validQueryParamsObject = validQueryParamArray.reduce<QueryParams>((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});

      return {
        valid: JSON.stringify(validQueryParamArray) === JSON.stringify(queryParamArray),
        validQueryParamsObject,
      };
    },
    [maxQueryParameters, searchFields]
  );

  // Synchronize Redux query params state from URL
  useEffect(() => {
    if (!location.pathname.endsWith('/search')) return;

    // Wait until:
    //  - we have loaded the max. # of query parameters we can query
    //  - we have search fields to try and build a valid query
    //  - we are not currently executing a search
    // Otherwise, we will mistakenly remove all URL query parameters and effectively reset the form.
    if (
      configStatus !== RequestStatus.Fulfilled ||
      searchFieldsStatus !== RequestStatus.Fulfilled ||
      searchQueryStatus === RequestStatus.Pending
    ) {
      return;
    }

    const { valid, validQueryParamsObject } = validateQuery(new URLSearchParams(location.search));
    if (valid) {
      if (WAITING_STATES.includes(searchQueryStatus) || !checkQueryParamsEqual(validQueryParamsObject, queryParams)) {
        // Only update the state & refresh if we have a new set of query params from the URL.
        // [!!!] This should be the only place setQueryParams(...) gets called. Everywhere else should use URL
        //       manipulations, so that we have a one-way data flow from URL to state!
        dispatch(setQueryParams(validQueryParamsObject));
        dispatch(makeGetKatsuPublic());
      }
    } else {
      const url = buildQueryParamsUrl(location.pathname, validQueryParamsObject);
      console.debug('[Search] Redirecting to:', url);
      navigate(url);
      // Then, the new URL will re-trigger this effect but with only valid query parameters.
    }
  }, [
    dispatch,
    configStatus,
    searchFieldsStatus,
    searchQueryStatus,
    location.search,
    location.pathname,
    navigate,
    queryParams,
    validateQuery,
  ]);

  return <Search />;
};

const SEARCH_SPACE_ITEM_STYLE = { item: WIDTH_100P_STYLE };

type FilterValue = { field: string | null; value: string | null };

const SearchFilterInput = ({
  field,
  value,
  onChange,
  onRemove,
  disabledFields,
}: FilterValue & {
  onChange: (v: FilterValue) => void;
  onRemove: () => void;
  disabledFields: Set<string>;
}) => {
  const t = useTranslationFn();

  const { querySections } = useSearchQuery();

  const filterOptions = querySections.map(({ section_title: label, fields }) => ({
    label,
    title: label,
    options: fields.map((f) => ({
      value: f.id,
      label: (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>{f.title}</div>
          <OptionDescription description={t(f.description)} />
        </div>
      ),
      // Disabled if: field is in disabled set AND it isn't the currently selected field (so we allow re-selection of
      // the current field.)
      disabled: disabledFields.has(f.id) && field !== f.id,
    })),
  }));

  const fieldFilterOptions = Object.fromEntries(
    querySections.flatMap(({ fields }) => fields.map((f) => [f.id, f.options.map((o) => ({ value: o, label: o }))]))
  );

  return (
    <Space.Compact style={WIDTH_100P_STYLE}>
      <Select
        style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        options={filterOptions}
        onChange={(v) => {
          onChange({ field: v, value: fieldFilterOptions[v][0].value ?? null });
        }}
        value={field}
      />
      <Select
        style={{ flex: 1 }}
        disabled={!field}
        options={field ? fieldFilterOptions[field] : []}
        onChange={(newValue) => {
          onChange({ field, value: newValue });
        }}
        value={value}
      />
      <Button icon={<CloseOutlined />} disabled={!field || !value} onClick={onRemove} />
    </Space.Compact>
  );
};

const SearchFilterInputSkeleton = () => (
  <Space.Compact style={WIDTH_100P_STYLE}>
    <Select style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} disabled={true} loading={true} />
    <Select style={{ flex: 1 }} disabled={true} />
    <Button icon={<CloseOutlined />} disabled={true} />
  </Space.Compact>
);

type SearchStatus = 'success' | 'fail' | 'loading' | 'disabled';

const SearchStatusIcon = ({ status }: { status: 'success' | 'fail' | 'loading' | 'disabled' }) => {
  let icon = <div />;

  const baseStyle: CSSProperties = { fontSize: '1.1rem' };

  if (status === 'success') {
    icon = <CheckCircleFilled style={{ ...baseStyle, color: '#52c41a' }} />;
  } else if (status === 'fail') {
    icon = <CloseCircleFilled style={{ ...baseStyle, color: '#f5222d' }} />;
  } else if (status === 'loading') {
    icon = <LoadingOutlined style={{ ...baseStyle, color: '#bfbfbf' }} />;
  } else if (status === 'disabled') {
    icon = <MinusCircleOutlined style={{ ...baseStyle, color: '#bfbfbf' }} />;
  }

  return icon;
};

const SearchFilters = ({ style }: { style?: CSSProperties }) => {
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

  const { dataStatus } = useSearchQuery();
  // TODO: correct search status
  let status: SearchStatus = 'disabled';
  if (dataStatus === RequestStatus.Pending) {
    status = 'loading';
  } else if (dataStatus === RequestStatus.Fulfilled) {
    status = 'success';
  } else if (dataStatus === RequestStatus.Rejected) {
    status = 'fail';
  }

  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        <span style={{ marginRight: '0.5em' }}>
          <FilterOutlined /> {t('Filters')}
        </span>
        <SearchStatusIcon status={status} />
      </Typography.Title>
      <Space direction="vertical" size={8} style={WIDTH_100P_STYLE}>
        {WAITING_STATES.includes(configStatus) || WAITING_STATES.includes(fieldsStatus) ? (
          <SearchFilterInputSkeleton />
        ) : (
          filterInputs.map((fv, i) => (
            <SearchFilterInput
              key={i}
              onChange={({ field, value }) => {
                if (field === null || value === null) return; // Force field to resolve as string type
                const url = buildQueryParamsUrl(pathname, {
                  // If we change the field in this filter, we need to remove it so we can switch to the new field
                  ...(fv.field ? queryParamsWithoutKey(queryParams, fv.field) : queryParams),
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

const OrDelimiter = memo(() => {
  const t = useTranslationFn();
  return (
    <Flex vertical={true} gap={8} align="center">
      <div style={{ width: 1, flex: 1, backgroundColor: '#f0f0f0' }}></div>
      <div style={{ fontWeight: 'bold', color: '#595959' }}>{t('OR')}</div>
      <div style={{ width: 1, flex: 1, backgroundColor: '#f0f0f0' }}></div>
    </Flex>
  );
});
OrDelimiter.displayName = 'OrDelimiter';

const SearchFreeText = ({ style }: { style?: CSSProperties }) => {
  const t = useTranslationFn();
  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        {t('Text search')}
      </Typography.Title>
      <Space.Compact style={WIDTH_100P_STYLE}>
        <Input prefix={<SearchOutlined />} />
        <Button>{t('Search')}</Button>
      </Space.Compact>
    </div>
  );
};

const Search = () => {
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const { fieldsStatus } = useSearchQuery();

  return WAITING_STATES.includes(fieldsStatus) ? (
    <Loader />
  ) : (
    <>
      <Row justify="center">
        <Space direction="vertical" align="center" style={WIDTH_100P_STYLE} styles={SEARCH_SPACE_ITEM_STYLE}>
          <div className="container margin-auto" style={{ paddingBottom: 8 }}>
            <Card
              style={{ borderRadius: '10px', ...WIDTH_100P_STYLE, ...BOX_SHADOW }}
              styles={{ ...CARD_STYLES, body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' } }}
            >
              <Flex justify="space-between" gap={24} style={WIDTH_100P_STYLE}>
                <SearchFilters style={{ flex: 1, maxWidth: 600 }} />
                {queryDataPerm && (
                  <>
                    <OrDelimiter />
                    <SearchFreeText style={{ flex: 1 }} />
                  </>
                )}
              </Flex>
            </Card>
          </div>
          <SearchResults />
        </Space>
      </Row>
      <FloatButton.BackTop />
    </>
  );
};

export default RoutedSearch;
