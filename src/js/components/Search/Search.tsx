import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, type CardProps, Flex, Row, Space } from 'antd';

import { queryData } from 'bento-auth-js';

import { useConfig } from '@/features/config/hooks';
import { useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';
import {
  performKatsuDiscovery,
  setFilterQueryParams,
  resetFilterQueryStatus,
  setTextQuery,
  resetTextQueryStatus,
  setDoneFirstLoad,
  setQueryMode,
} from '@/features/search/query.store';
import { useAppDispatch, useHasScopePermission } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { buildQueryParamsUrl, combineQueryParamsWithoutKey } from '@/features/search/utils';

import Loader from '@/components/Loader';
import OrDelimiter from './OrDelimiter';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { WAITING_STATES } from '@/constants/requests';
import { NON_FILTER_QUERY_PARAM_PREFIX, TEXT_QUERY_PARAM } from '@/features/search/constants';
import type { QueryMode, QueryParamEntry, QueryParams } from '@/features/search/types';
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
  validFilterQueryParams: QueryParams;
  otherQueryParams: QueryParams;
};

const RoutedSearch = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { hasAttempted: hasAttemptedQueryDataPerm, hasPermission: queryDataPerm } = useHasScopePermission(queryData);

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
  // Previous queryMode versus last time the [BIG STATE/URL SYNC EFFECT] below was executed.
  const previousQueryMode = useRef<QueryMode>(queryMode);

  const filterFields = useQueryFilterFields();

  const loadAndValidateQuery = useCallback((): QueryValidationResult => {
    const query = new URLSearchParams(location.search);

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
      validFilterQueryParams: Object.fromEntries(validQueryParamArray.slice(0, maxQueryParameters)),
      otherQueryParams: Object.fromEntries(otherQueryParamArray),
    };
  }, [maxQueryParameters, filterFields, location.search]);

  const setSearchUrlWithQueryParams = useCallback(
    (qp: QueryParams) => {
      const url = buildQueryParamsUrl(location.pathname, qp);
      console.debug('[Search] Redirecting to:', url);
      navigate(url, { replace: true });
    },
    [location, navigate]
  );

  const currentPage = getCurrentPage(location);

  // +-------------------------------+
  // |                               |
  // |  [BIG STATE/URL SYNC EFFECT]  |
  // |                               |
  // +-------------------------------+
  // Synchronize Redux query params state from URL, or URL from Redux state in some cases.
  useEffect(() => {
    if (currentPage !== BentoRoute.Search) return;

    // Wait until:
    //  - we have loaded the max. # of query parameters we can query
    //  - we have search fields to try and build a valid query
    //  - we are not currently executing a search
    //  - we have attempted to check query:data permissions (for text search)
    // Otherwise, we will mistakenly remove some/all URL query parameters and effectively reset the form.
    if (
      configStatus !== RequestStatus.Fulfilled ||
      searchFieldsStatus !== RequestStatus.Fulfilled ||
      filterQueryStatus === RequestStatus.Pending ||
      textQueryStatus === RequestStatus.Pending ||
      !hasAttemptedQueryDataPerm
    ) {
      return;
    }

    // Update previousQueryMode, and use _previousQueryMode to store the value as it was right before this effect was
    // executed, i.e., storing queryMode as of the _last_ time this effect was executed. In this way, we can detect UI
    // transitions from filter <-> text mode.
    const _previousQueryMode = previousQueryMode.current;
    previousQueryMode.current = queryMode;

    const { valid, validFilterQueryParams, otherQueryParams } = loadAndValidateQuery();
    const qpTextQuery: string | undefined = otherQueryParams[TEXT_QUERY_PARAM];

    // Whether we should expect to be in text mode (either now, or after a URL rewrite).
    const isOrWillBeInTextMode = queryMode === 'text' || (!doneFirstLoad && !!qpTextQuery);

    // Rewrite to a new URL which will re-trigger this effect but with only valid filter query parameters,
    // and no text query (if one was set).
    const rewriteToValidFiltersUrl = () =>
      setSearchUrlWithQueryParams(
        combineQueryParamsWithoutKey(validFilterQueryParams, otherQueryParams, TEXT_QUERY_PARAM)
      );

    if (!valid && !isOrWillBeInTextMode) {
      // Our filter query parameters are at least partially invalid, and we are (or will be) performing a filter search.
      // Thus, we need to rewrite the URL to remove invalid filter query parameters.
      rewriteToValidFiltersUrl();
      return;
    }

    // Otherwise, we have a valid (or empty) set of filter query parameters --------------------------------------------

    // If we have a query parameter for text search in the URL, we prioritize this and execute a text query.
    // Later on, we still may want to populate the filters (but not execute a filter search right now), so we need to
    // keep track of whether we've executed a text query.

    let performingTextQuery = false;

    if (isOrWillBeInTextMode) {
      if (!queryDataPerm) {
        // Already checked attempted status, so we know this is the true permissions value. If we do not have query:data
        // permissions, we cannot try to execute a text search, so we go back to filters mode via URL rewrite.
        rewriteToValidFiltersUrl();
        return;
      }

      // There are two scenarios where we may want to execute a full-text search (rather than a filter search):
      //  1. Our query mode is 'text'
      //  2. We're in the initial load phase, and we have a value for the query parameter. We prioritize this over any
      //     filters set (since we need to choose _some_ order), and switch the query UI to be in 'text' mode.

      const qpTextQueryStr = qpTextQuery ?? ''; // undefined --> ''
      if (qpTextQuery === undefined || qpTextQueryStr !== textQuery) {
        // If there's a mismatch between the query parameter and Redux text queries, we have to reconcile them by
        // choosing one or the other.

        if (doneFirstLoad && _previousQueryMode === 'filters') {
          // Here, we choose to update the URL from Redux. In the case that qpTextQuery is undefined, we're just setting
          // [TEXT_QUERY_PARAM] to a blank string and replacing any filter query parameters in the URL.
          setSearchUrlWithQueryParams({ ...otherQueryParams, [TEXT_QUERY_PARAM]: textQuery /* From Redux! */ });
          // Then, the new URL will re-trigger this effect but without the filter query parameters, and with the text
          // query parameter from Redux.
          return;
        }

        if (!doneFirstLoad && qpTextQueryStr && Object.keys(validFilterQueryParams).length) {
          // If we're in the first-load phase, and we have a text query AND filters, we prioritize the text query and
          // rewrite the filters away.
          setSearchUrlWithQueryParams({ ...otherQueryParams, [TEXT_QUERY_PARAM]: qpTextQueryStr });
          // Then, the new URL will re-trigger this effect but without the filter query parameters, but with the text
          // query parameter from the URL.
          return;
        }

        // Otherwise, we sync Redux from the URL query parameter for free-text search, and reset the text query status
        // so we can perform the search itself below:
        dispatch(setTextQuery(qpTextQueryStr)); // [!!!] This should be the only place setTextQuery(...) gets called.
        dispatch(resetTextQueryStatus());
      }

      if (textQueryStatus === RequestStatus.Idle) {
        // If we aren't somehow already executing a text query, we execute one now:
        dispatch(performFreeTextSearch());
        performingTextQuery = true;
        // If we didn't already have the Redux query mode === text due to an initial load, make sure to set it to text:
        dispatch(setQueryMode('text'));
        // Indicate to the state that search results don't reflect the filters by resetting the filter request status:
        dispatch(resetFilterQueryStatus());
      }
    }

    // If we have new valid filter query parameters (that aren't already in Redux), put them into the state even if
    // we're not going to actually execute a filter search.
    const filterQueryParamsEqual = checkQueryParamsEqual(validFilterQueryParams, filterQueryParams);
    if (
      (filterQueryStatus === RequestStatus.Idle || !filterQueryParamsEqual) &&
      !performingTextQuery &&
      queryMode === 'filters'
    ) {
      // Only update the state & refresh if we have a new set of query params from the URL, or if we are now
      // focused on the Filters search section and haven't actually executed the filter search yet.
      // [!!!] This should be the only place setQueryParams(...) gets called. Everywhere else should use URL
      //       manipulations, so that we have a one-way data flow from URL to state!

      if (!filterQueryParamsEqual) {
        // If there's a mismatch between the query parameter and Redux filters, we have to reconcile them by
        // choosing one or the other. We also only want to update the query params object (& trigger a re-render) if the
        // new object has different contents, otherwise we can produce a render loop.

        if (doneFirstLoad && _previousQueryMode === 'text') {
          // We just switched from text to filters, and we've already executed at least one search before, so we want to
          // populate the URL with parameters from Redux, i.e., Redux takes priority over the URL parameters as we're
          // loading what was already filtered before (and is thus in Redux and the UI) back into the URL to create a
          // shareable / refreshable link.
          setSearchUrlWithQueryParams(
            // filterQueryParams is from Redux here! Not the same thing as rewriteToValidFiltersUrl()
            combineQueryParamsWithoutKey(filterQueryParams, otherQueryParams, TEXT_QUERY_PARAM)
          );
          // Then, the new URL will re-trigger this effect but with filter query parameters from Redux.
          return;
        }

        // Otherwise, we want to prioritize the URL over Redux, so we sync the Redux state with the URL values. This can
        // happen on first load or if we change/add/remove a filter value via URL change (which is how these changes
        // should be executed in the UI). We then get proper one-way traffic from the URL to the Redux state.
        dispatch(setFilterQueryParams(validFilterQueryParams));
      }

      // We only want to execute the filters search if we're not already performing a text search even while we're
      // focused on the filters form, which can happen on first load with a text search query parameter specified.
      dispatch(performKatsuDiscovery());
      // Indicate to the state that search results don't reflect the text query.
      dispatch(resetTextQueryStatus());
    }

    dispatch(setDoneFirstLoad());
  }, [
    dispatch,
    configStatus,
    searchFieldsStatus,
    filterQueryStatus,
    hasAttemptedQueryDataPerm,
    queryDataPerm,
    doneFirstLoad,
    queryMode,
    textQueryStatus,
    currentPage,
    setSearchUrlWithQueryParams,
    filterQueryParams,
    textQuery,
    loadAndValidateQuery,
  ]);

  return <Search />;
};

const SEARCH_CARD_STYLES: CardProps['styles'] = {
  ...CARD_STYLES,
  body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' },
};

export const SearchForm = () => {
  const dispatch = useAppDispatch();

  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const { mode: queryMode } = useSearchQuery();

  const onFiltersFocus = useCallback(() => dispatch(setQueryMode('filters')), [dispatch]);
  const onTextFocus = useCallback(() => dispatch(setQueryMode('text')), [dispatch]);

  return (
    <Card className="w-full shadow rounded-xl" styles={SEARCH_CARD_STYLES}>
      <Flex justify="space-between" gap={isSmallScreen ? 12 : 24} className="w-full" vertical={isSmallScreen}>
        <SearchFilters focused={queryMode === 'filters'} onFocus={onFiltersFocus} className="max-w-half-cmw" />
        {queryDataPerm && (
          // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
          // the data, so show the free-text search form:
          <>
            <OrDelimiter vertical={!isSmallScreen} />
            <SearchFreeText focused={queryMode === 'text'} onFocus={onTextFocus} />
          </>
        )}
      </Flex>
    </Card>
  );
};

const Search = () => {
  const { fieldsStatus } = useSearchQuery();
  return WAITING_STATES.includes(fieldsStatus) ? (
    <Loader />
  ) : (
    <Row justify="center">
      <Space direction="vertical" align="center" className="w-full" styles={SPACE_ITEM_WIDTH_100P_STYLES}>
        <div className="container margin-auto">
          <SearchForm />
        </div>
        <SearchResults />
      </Space>
    </Row>
  );
};

export default RoutedSearch;
