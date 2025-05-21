import { type CSSProperties, useCallback, useEffect } from 'react';
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
  resetTextQueryStatus,
  setDoneFirstLoad,
  setQueryMode,
} from '@/features/search/query.store';
import { useAppDispatch, useHasScopePermission } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { buildQueryParamsUrl } from '@/features/search/utils';

import Loader from '@/components/Loader';
import OrDelimiter from './OrDelimiter';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { WAITING_STATES } from '@/constants/requests';
import { NON_FILTER_QUERY_PARAM_PREFIX, TEXT_QUERY_PARAM } from '@/features/search/constants';
import type { QueryParamEntry, QueryParams } from '@/features/search/types';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const checkQueryParamsEqual = (qp1: QueryParams, qp2: QueryParams): boolean => {
  const qp1Keys = Object.keys(qp1);
  const qp2Keys = Object.keys(qp2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce((acc, v) => acc && qp1[v] === qp2[v], true);
};

type QueryValidationResult = {
  valid: boolean;
  validQueryParams: QueryParams;
  otherQueryParams: QueryParams;
};

const RoutedSearch = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { configStatus, maxQueryParameters } = useConfig();
  const {
    mode: queryMode,
    filterQueryParams,
    fieldsStatus: searchFieldsStatus,
    filterQueryStatus,
    textQuery,
    textQueryStatus,
    doneFirstLoad,
  } = useSearchQuery();
  const filterFields = useQueryFilterFields();

  const validateQuery = useCallback(
    (query: URLSearchParams): QueryValidationResult => {
      const validateFilterQueryParam = ([key, value]: QueryParamEntry): boolean => {
        const field = filterFields.find((e) => e.id === key);
        return !!field && field.options.includes(value);
      };

      const queryParamArray = [...query.entries()];
      const validQueryParamArray: QueryParamEntry[] = [];
      const otherQueryParamArray: QueryParamEntry[] = [];

      let valid = true; // Current query params are valid until proven otherwise in the loop below.

      queryParamArray.forEach((qp) => {
        if (validateFilterQueryParam(qp)) {
          validQueryParamArray.push(qp);
        } else if (qp[0].startsWith(NON_FILTER_QUERY_PARAM_PREFIX)) {
          otherQueryParamArray.push(qp);
        } else {
          // Invalid query param, skip it and mark current query param set as invalid (needing a URL replacement).
          valid = false;
        }
      });

      return {
        valid,
        validQueryParams: Object.fromEntries(validQueryParamArray.slice(0, maxQueryParameters)),
        otherQueryParams: Object.fromEntries(otherQueryParamArray),
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

    if (!valid) {
      const url = buildQueryParamsUrl(location.pathname, { ...validQueryParams, ...otherQueryParams });
      console.debug('[Search] Redirecting to:', url);
      navigate(url);
      // Then, the new URL will re-trigger this effect but with only valid query parameters.
      return;
    }

    // Otherwise, we have a valid (or empty) set of filter query parameters --------------------------------------------

    // If we have a query parameter for text search in the URL, we prioritize this and execute a text query.
    // Later on, we still may want to populate the filters (but not execute a filter search right now), so we need to
    // keep track of whether we've executed a text query.

    let performingTextQuery = false;

    const newTextQuery = otherQueryParams[TEXT_QUERY_PARAM] ?? '';
    if (newTextQuery !== textQuery) {
      dispatch(setTextQuery(newTextQuery));
      dispatch(resetTextQueryStatus());
    }

    if (
      textQueryStatus === RequestStatus.Idle &&
      (queryMode === 'text' || (!doneFirstLoad && (newTextQuery || textQuery)))
    ) {
      dispatch(performFreeTextSearch());
      performingTextQuery = true;
      dispatch(setQueryMode('text'));
      // Indicate to the state that search results don't reflect the filters by resetting the filter request status.
      dispatch(resetFilterQueryStatus());
    }

    // If we have new valid filter query parameters (that aren't already in Redux), put them into the state even if
    // we're not going to actually execute a filter search.
    const queryParamsEqual = checkQueryParamsEqual(validQueryParams, filterQueryParams);
    if (filterQueryStatus === RequestStatus.Idle || !queryParamsEqual) {
      // Only update the state & (maybe) refresh if we have a new set of query params from the URL, or if we are now
      // focused on the Filters search section and haven't actually executed the filter search yet.
      // [!!!] This should be the only place setQueryParams(...) gets called. Everywhere else should use URL
      //       manipulations, so that we have a one-way data flow from URL to state!

      if (!queryParamsEqual) {
        // Only update the query params object (& trigger a re-render) if the new object has different contents.
        dispatch(setFilterQueryParams(validQueryParams));
      }

      if (!performingTextQuery && queryMode === 'filters') {
        // We only want to execute the filters search if we're not already performing a text search even while we're
        // focused on the filters form, which can happen on first load with a text search query parameter specified.
        dispatch(makeGetKatsuPublic());
        // Indicate to the state that search results don't reflect the text query.
        dispatch(resetTextQueryStatus());
      }
    }

    dispatch(setDoneFirstLoad());
  }, [
    dispatch,
    configStatus,
    doneFirstLoad,
    searchFieldsStatus,
    filterQueryStatus,
    queryMode,
    textQueryStatus,
    location,
    navigate,
    filterQueryParams,
    textQuery,
    validateQuery,
  ]);

  return <Search />;
};

const focusedStyle = (focused: boolean) =>
  ({
    opacity: focused ? 1 : 0.75,
    transition: 'opacity 0.1s',
  }) as CSSProperties;

const Search = () => {
  const dispatch = useAppDispatch();
  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const { mode: queryMode, fieldsStatus } = useSearchQuery();

  const onFiltersFocus = useCallback(() => dispatch(setQueryMode('filters')), [dispatch]);
  const onTextFocus = useCallback(() => dispatch(setQueryMode('text')), [dispatch]);

  return WAITING_STATES.includes(fieldsStatus) ? (
    <Loader />
  ) : (
    <Row justify="center">
      <Space direction="vertical" align="center" className="w-full" styles={SPACE_ITEM_WIDTH_100P_STYLES}>
        <div className="container margin-auto">
          <Card
            className="w-full shadow rounded-xl"
            styles={{ ...CARD_STYLES, body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' } }}
          >
            <Flex justify="space-between" gap={isSmallScreen ? 12 : 24} className="w-full" vertical={isSmallScreen}>
              <SearchFilters
                focused={queryMode === 'filters'}
                onFocus={onFiltersFocus}
                style={{
                  flex: 1,
                  maxWidth: 600,
                  ...focusedStyle(queryMode === 'filters'),
                }}
              />
              {queryDataPerm && (
                // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
                // the data, so show the free-text search form:
                <>
                  <OrDelimiter vertical={!isSmallScreen} />
                  <SearchFreeText
                    focused={queryMode === 'text'}
                    onFocus={onTextFocus}
                    style={{ flex: 1, ...focusedStyle(queryMode === 'text') }}
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
