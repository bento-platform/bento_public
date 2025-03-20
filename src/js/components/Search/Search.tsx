import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Flex, FloatButton, Row, Space } from 'antd';

import { queryData } from 'bento-auth-js';

import { useConfig } from '@/features/config/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { makeGetKatsuPublic, setQueryParams } from '@/features/search/query.store';
import { useAppDispatch, useHasScopePermission, useTranslationFn } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';

import Loader from '@/components/Loader';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

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
    filterQueryStatus,
    textQueryStatus,
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
      filterQueryStatus === RequestStatus.Pending ||
      textQueryStatus === RequestStatus.Pending
    ) {
      return;
    }

    const { valid, validQueryParamsObject } = validateQuery(new URLSearchParams(location.search));
    if (valid) {
      if (filterQueryStatus === RequestStatus.Idle || !checkQueryParamsEqual(validQueryParamsObject, queryParams)) {
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
    filterQueryStatus,
    textQueryStatus,
    location.search,
    location.pathname,
    navigate,
    queryParams,
    validateQuery,
  ]);

  return <Search />;
};

const SEARCH_SPACE_ITEM_STYLE = { item: WIDTH_100P_STYLE };

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

const Search = () => {
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const { fieldsStatus } = useSearchQuery();

  const [focused, setFocused] = useState<'filters' | 'text'>('filters');

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
                <SearchFilters
                  onFocus={() => setFocused('filters')}
                  style={{
                    flex: 1,
                    maxWidth: 600,
                    opacity: focused === 'filters' ? 1 : 0.75,
                    transition: 'opacity 0.1s',
                  }}
                />
                {queryDataPerm && (
                  <>
                    <OrDelimiter />
                    <SearchFreeText
                      onFocus={() => setFocused('text')}
                      style={{ flex: 1, opacity: focused === 'text' ? 1 : 0.75, transition: 'opacity 0.1s' }}
                    />
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
