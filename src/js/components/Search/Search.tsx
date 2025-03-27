import { type CSSProperties, memo, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Flex, Row, Space } from 'antd';

import { queryData } from 'bento-auth-js';

import { useConfig } from '@/features/config/hooks';
import { useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';
import {
  makeGetKatsuPublic,
  setFilterQueryParams,
  resetFilterQueryStatus,
  setTextQuery,
} from '@/features/search/query.store';
import { useAppDispatch, useHasScopePermission, useTranslationFn } from '@/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';

import Loader from '@/components/Loader';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';
import { WIDTH_100P_STYLE } from '@/constants/common';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { NON_FILTER_QUERY_PARAM_PREFIX, TEXT_QUERY_PARAM } from '@/features/search/constants';
import type { QueryParamObj, QueryParams } from '@/features/search/types';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

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
    filterQueryParams,
    fieldsStatus: searchFieldsStatus,
    filterQueryStatus,
    textQuery,
    textQueryStatus,
  } = useSearchQuery();
  const filterFields = useQueryFilterFields();

  const validateQuery = useCallback(
    (
      query: URLSearchParams
    ): {
      valid: boolean;
      validQueryParams: QueryParams;
      otherQueryParams: QueryParams;
    } => {
      const validateFilterQueryParam = ({ key, value }: QueryParamObj): boolean => {
        const field = filterFields.find((e) => e.id === key);
        return !!field && field.options.includes(value);
      };

      const queryParamArray = Array.from(query.entries()).map(([key, value]): QueryParamObj => ({ key, value }));
      let validQueryParamArray: QueryParamObj[] = [];
      const otherQueryParams: QueryParams = {};

      let valid = true; // Current query params are valid until proven otherwise in the loop below.

      queryParamArray.forEach((qp) => {
        if (validateFilterQueryParam(qp)) {
          validQueryParamArray.push(qp);
        } else if (qp.key.startsWith(NON_FILTER_QUERY_PARAM_PREFIX)) {
          otherQueryParams[qp.key] = qp.value;
        } else {
          // Invalid query param, skip it and mark current query param set as invalid (needing a URL replacement).
          valid = false;
        }
      });

      validQueryParamArray = validQueryParamArray.slice(0, maxQueryParameters);

      const validQueryParams: QueryParams = Object.fromEntries(
        validQueryParamArray.map(({ key, value }) => [key, value])
      );

      return {
        valid,
        validQueryParams,
        otherQueryParams,
      };
    },
    [maxQueryParameters, filterFields]
  );

  // Synchronize Redux query params state from URL
  useEffect(() => {
    if (getCurrentPage(location) !== BentoRoute.Search) return;

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

    const { valid, validQueryParams, otherQueryParams } = validateQuery(new URLSearchParams(location.search));
    if (valid) {
      // If we have a query parameter for text search in the URL, we prioritize this and execute a text query.
      // Later on, we still may want to populate the filters (but not execute a filter search right now), so we need to
      // keep track of whether we've executed a text query.

      let performingTextQuery = false;

      const newTextQuery = otherQueryParams[TEXT_QUERY_PARAM];
      if (newTextQuery && (textQueryStatus === RequestStatus.Idle || newTextQuery !== textQuery)) {
        dispatch(setTextQuery(newTextQuery));
        dispatch(performFreeTextSearch());
        performingTextQuery = true;
      }

      // If we have new valid filter query parameters (that aren't already in Redux), put them into the state even if
      // we're not going to actually execute a filter search.
      if (filterQueryStatus === RequestStatus.Idle || !checkQueryParamsEqual(validQueryParams, filterQueryParams)) {
        // Only update the state & (maybe) refresh if we have a new set of query params from the URL.
        // [!!!] This should be the only place setQueryParams(...) gets called. Everywhere else should use URL
        //       manipulations, so that we have a one-way data flow from URL to state!
        dispatch(setFilterQueryParams(validQueryParams));
        if (performingTextQuery) {
          // Indicate to the state that we haven't executed the search corresponding to the query parameters yet
          // by resetting the filter request status to Idle.
          dispatch(resetFilterQueryStatus());
        } else {
          // TODO: describe why only if not full-text-searching
          dispatch(makeGetKatsuPublic());
        }
      }
    } else {
      const url = buildQueryParamsUrl(location.pathname, {
        ...validQueryParams,
        ...otherQueryParams,
      } as QueryParams);
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
    location,
    navigate,
    filterQueryParams,
    textQuery,
    validateQuery,
  ]);

  return <Search />;
};

const SEARCH_SPACE_ITEM_STYLE = { item: WIDTH_100P_STYLE };

const OrDelimiter = memo(() => {
  const t = useTranslationFn();
  const lineStyle: CSSProperties = { width: 1, flex: 1, backgroundColor: '#f0f0f0' };
  return (
    <Flex vertical={true} gap={8} align="center">
      <div style={lineStyle}></div>
      <div style={{ fontWeight: 'bold', color: '#595959' }}>{t('OR')}</div>
      <div style={lineStyle}></div>
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
    <Row justify="center">
      <Space direction="vertical" align="center" style={WIDTH_100P_STYLE} styles={SEARCH_SPACE_ITEM_STYLE}>
        <div className="container margin-auto">
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
  );
};

export default RoutedSearch;
