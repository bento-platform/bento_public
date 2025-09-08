import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import type { QueryParamEntry, QueryParams } from '@/features/search/types';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';

import { NON_FILTER_QUERY_PARAM_PREFIX, TEXT_QUERY_PARAM } from '@/features/search/constants';

import { useAppDispatch } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useConfig } from '@/features/config/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useScopeQueryData } from './censorship';
import { useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';

import { performKatsuDiscovery } from '@/features/search/performKatsuDiscovery.thunk';
import { setDoneFirstLoad, setFilterQueryParams, setTextQuery } from '@/features/search/query.store';

import { buildQueryParamsUrl, checkQueryParamsEqual, combineQueryParamsWithoutKey } from '@/features/search/utils';
import { getCurrentPage } from '@/utils/router';

// Internal type for useSearchRouterAndHandler hook
type QueryValidationResult = {
  valid: boolean;
  validFilterQueryParams: QueryParams;
  otherQueryParams: QueryParams;
};

export const useSearchRouterAndHandler = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigateToScope = useNavigateToScope();

  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const isFixedProjectAndDataset = fixedProject && fixedDataset;

  const { hasAttempted: hasAttemptedQueryDataPerm, hasPermission: queryDataPerm } = useScopeQueryData();

  const { configStatus, maxQueryParameters } = useConfig();
  const {
    filterQueryParams,
    fieldsStatus: searchFieldsStatus,
    discoveryStatus,
    textQuery,
    doneFirstLoad,
  } = useSearchQuery();

  const filterFields = useQueryFilterFields();

  const loadAndValidateQuery = useCallback((): QueryValidationResult => {
    // We DO explicitly use the react-router location object here, so that this dependency changes when the search
    // params change.
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
      // Don't use react-router location here - the goal is to not recreate this function when the path changes.
      const urlSuffix = buildQueryParamsUrl('overview', qp);
      console.debug('[Search] Redirecting to:', urlSuffix, '| new scope:', scope);
      navigateToScope(scope, urlSuffix, isFixedProjectAndDataset, { replace: true });
    },
    [navigateToScope, scope, isFixedProjectAndDataset]
  );

  const currentPage = getCurrentPage(location);

  // +-------------------------------+
  // |                               |
  // |  [BIG STATE/URL SYNC EFFECT]  |
  // |                               |
  // +-------------------------------+
  // Synchronize Redux query params state from URL, or URL from Redux state in some cases.
  useEffect(() => {
    if (currentPage !== BentoRoute.Overview) return;

    // Wait until:
    //  - we have loaded the max. # of query parameters we can query
    //  - we have search fields to try and build a valid query
    //  - we are not currently executing a search
    //  - we have attempted to check query:data permissions (for text search)
    // Otherwise, we will mistakenly remove some/all URL query parameters and effectively reset the form.
    if (
      configStatus !== RequestStatus.Fulfilled ||
      searchFieldsStatus !== RequestStatus.Fulfilled ||
      discoveryStatus === RequestStatus.Pending ||
      !hasAttemptedQueryDataPerm
    ) {
      return;
    }

    const { valid, validFilterQueryParams, otherQueryParams } = loadAndValidateQuery();

    if (!valid) {
      // Our filter query parameters are at least partially invalid, and we are (or will be) performing a filter search.
      // Thus, we need to rewrite the URL to remove invalid filter query parameters, which will re-trigger this effect.
      setSearchUrlWithQueryParams({ ...validFilterQueryParams, ...otherQueryParams });
      return;
    }

    // Otherwise, we have a valid (or empty) set of filter query parameters. Now, we need to deal with free-text
    // filtering: ------------------------------------------------------------------------------------------------------

    const qpTextQuery: string | undefined = otherQueryParams[TEXT_QUERY_PARAM];

    if (qpTextQuery && !queryDataPerm) {
      // Already checked attempted status, so we know this is the true permissions value. If we do not have query:data
      // permissions, we cannot try to execute a text search, so we go back to exclusively filters via URL rewrite.
      // This effect will then be re-triggered without the text query param.
      setSearchUrlWithQueryParams(
        combineQueryParamsWithoutKey(validFilterQueryParams, otherQueryParams, TEXT_QUERY_PARAM)
      );
      return;
    }

    const qpTextQueryStr = qpTextQuery ?? ''; // undefined --> ''
    if ((textQuery && qpTextQuery === undefined) || qpTextQueryStr !== textQuery) {
      // If there's a mismatch between the query parameter and Redux text queries, we have to reconcile them. We sync
      // Redux from the URL query parameter for free-text search so we can perform the search itself below:
      dispatch(setTextQuery(qpTextQueryStr)); // [!!!] This should be the only place setTextQuery(...) gets called.
    }

    // If we have new valid filter query parameters (that aren't already in Redux), put them into the state even if
    // we're not going to actually execute a filter search.
    const filterQueryParamsEqual = checkQueryParamsEqual(validFilterQueryParams, filterQueryParams);
    if (discoveryStatus === RequestStatus.Idle || !filterQueryParamsEqual || qpTextQueryStr !== textQuery) {
      // Only update the state & refresh if we have a new set of query params from the URL, or if we haven't actually
      // executed a discovery search yet.
      // [!!!] This should be the only place setQueryParams(...) gets called. Everywhere else should use URL
      //       manipulations, so that we have a one-way data flow from URL to state!

      if (!filterQueryParamsEqual) {
        // If there's a mismatch between the query parameter and Redux filters, we have to reconcile them. We also only
        // want to update the query params object (& trigger a re-render) if the new object has different contents,
        // otherwise we can produce a render loop. We want to prioritize the URL over Redux, so we sync the Redux state
        // with the URL values. This can happen on first load or if we change/add/remove a filter value via URL change
        // (which is how these changes should be executed in the UI). We then get proper one-way traffic from the URL to
        // the Redux state.
        dispatch(setFilterQueryParams(validFilterQueryParams));
      }

      // We only want to execute the filters search if we're not already performing a text search even while we're
      // focused on the filters form, which can happen on first load with a text search query parameter specified.
      dispatch(performKatsuDiscovery());
    }

    dispatch(setDoneFirstLoad());
  }, [
    dispatch,
    configStatus,
    searchFieldsStatus,
    discoveryStatus,
    hasAttemptedQueryDataPerm,
    queryDataPerm,
    doneFirstLoad,
    currentPage,
    setSearchUrlWithQueryParams,
    filterQueryParams,
    textQuery,
    loadAndValidateQuery,
  ]);
};
