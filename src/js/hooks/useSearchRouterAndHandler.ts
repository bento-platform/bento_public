import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import type { FiltersState, QueryParamEntries, QueryParamEntry } from '@/features/search/types';
import type { BentoCountEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';

import { COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import {
  ENTITY_QUERY_PARAM,
  NON_FILTER_QUERY_PARAM_PREFIX,
  TABLE_PAGE_QUERY_PARAM,
  TABLE_PAGE_SIZE_QUERY_PARAM,
  TEXT_QUERY_PARAM,
} from '@/features/search/constants';

import { useAppDispatch } from '@/hooks';
import { useNavigateToScope } from '@/hooks/navigation';
import { useConfig } from '@/features/config/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useScopeQueryData } from './censorship';
import { useQueryFilterFields, useSearchQuery } from '@/features/search/hooks';

import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';
import { performKatsuDiscovery } from '@/features/search/performKatsuDiscovery.thunk';
import {
  setDoneFirstLoad,
  setFilters,
  setTextQuery,
  setSelectedEntity,
  setMatchesPage,
  setMatchesPageSize,
} from '@/features/search/query.store';

import { buildQueryParamsUrl, filtersStateToQueryParamEntries, queryParamsWithoutKey } from '@/features/search/utils';
import { getCurrentPage } from '@/utils/router';

// Internal type for useSearchRouterAndHandler hook
type QueryValidationResult = {
  valid: boolean;
  validFiltersState: FiltersState;
  otherQueryParams: QueryParamEntries;
};

const ENTITY_TABLE_PARAMS = [ENTITY_QUERY_PARAM, TABLE_PAGE_QUERY_PARAM, TABLE_PAGE_SIZE_QUERY_PARAM];
const ENTITY_AND_TEXT_PARAMS = [...ENTITY_TABLE_PARAMS, TEXT_QUERY_PARAM];

export const useSearchRouterAndHandler = () => {
  // Tags for ctrl-F: execute search, perform search, run search

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigateToScope = useNavigateToScope();

  const { scope, fixedProject, fixedDataset } = useSelectedScope();
  const isFixedProjectAndDataset = fixedProject && fixedDataset;

  const { hasAttempted: hasAttemptedQueryDataPerm, hasPermission: queryDataPerm } = useScopeQueryData();

  const { configStatus, maxQueryParameters } = useConfig();
  const {
    filters,
    fieldsStatus: searchFieldsStatus,
    discoveryStatus,
    textQuery,
    selectedEntity,
    doneFirstLoad,
    matchData,
    pageSize,
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

    const validFiltersState: FiltersState = {};
    let nFilters = 0;
    const otherQueryParams: QueryParamEntries = [];

    let valid = true; // Current query params are valid until proven otherwise in the loop below.

    console.log('begin', queryDataPerm);
    [...query.entries()].forEach((qp) => {
      if (nFilters < maxQueryParameters && validateFilterQueryParam(qp)) {
        if (qp[0] in validFiltersState && queryDataPerm) {
          // If we are allowed to have multiple values for a filter (i.e., we have query:data permissions) and we
          // already have a filter for this key
          const existingFilter = validFiltersState[qp[0]];
          if (Array.isArray(existingFilter)) {
            existingFilter.push(qp[1]);
          } else if (existingFilter) {
            validFiltersState[qp[0]] = [existingFilter, qp[1]];
          }
          console.log(validFiltersState);
          nFilters += 1;
        } else {
          validFiltersState[qp[0]] = qp[1];
          nFilters += 1;
        }
      } else if (qp[0].startsWith(NON_FILTER_QUERY_PARAM_PREFIX)) {
        otherQueryParams.push(qp);
      } else {
        // Invalid query param, skip it and mark current query param set as invalid (needing a URL replacement).
        valid = false;
      }
    });
    console.log('end');

    return { valid, validFiltersState, otherQueryParams };
  }, [maxQueryParameters, filterFields, location.search, queryDataPerm]);

  const setSearchUrl = useCallback(
    (filtersState: FiltersState, qp: QueryParamEntries) => {
      // Don't use react-router location here - the goal is to not recreate this function when the path changes.
      const urlSuffix = buildQueryParamsUrl(BentoRoute.Overview, [
        ...filtersStateToQueryParamEntries(filtersState),
        ...qp,
      ]);
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

    const { valid, validFiltersState, otherQueryParams } = loadAndValidateQuery();

    if (!valid) {
      // Our filter query parameters are at least partially invalid, and we are (or will be) performing a filter search.
      // Thus, we need to rewrite the URL to remove invalid filter query parameters, which will re-trigger this effect.
      setSearchUrl(validFiltersState, otherQueryParams);
      return;
    }

    // Otherwise, we have a valid (or empty) set of filter query parameters. Now, we need to deal with free-text
    // filtering and other non-field-filter query parameters: ----------------------------------------------------------

    const otherQueryParamsRepr = new URLSearchParams(otherQueryParams);
    const qpRawEntity = otherQueryParamsRepr.get(ENTITY_QUERY_PARAM);
    const qpRawTablePage = otherQueryParamsRepr.get(TABLE_PAGE_QUERY_PARAM);
    const qpRawTablePageSize = otherQueryParamsRepr.get(TABLE_PAGE_SIZE_QUERY_PARAM);
    const qpTextQuery = otherQueryParamsRepr.get(TEXT_QUERY_PARAM);

    if ((qpRawEntity || qpRawTablePage || qpRawTablePageSize || qpTextQuery) && !queryDataPerm) {
      // Already checked attempted status, so we know this is the true permissions value. If we do not have query:data
      // permissions, we cannot:
      //  - expand an entity table (with associated pagination query parameters), or
      //  - try to execute a text search
      // So we go back to exclusively filters via URL rewrite.
      // This effect will then be re-triggered without the entity or text query param.
      setSearchUrl(validFiltersState, queryParamsWithoutKey(otherQueryParams, ENTITY_AND_TEXT_PARAMS));
      return;
    }

    const qpEntity = qpRawEntity ? (qpRawEntity as BentoCountEntity) : null;

    // Handle an invalid entity in the URL by rewriting it without any entity results-table-relevant parameters:
    if (qpEntity && !(qpEntity in COUNT_ENTITY_REGISTRY)) {
      setSearchUrl(validFiltersState, queryParamsWithoutKey(otherQueryParams, ENTITY_TABLE_PARAMS));
      return;
    }

    // Here marks the end of any URL rewriting we do to get back to this hook but with a valid set of parameters.
    // =================================================================================================================

    // Now, we need to (broadly) sync the Redux state from the URL.

    // Handle updates to discovery matches page parameters

    // If there's a mismatch between the query parameter and the Redux selected entity, we have to reconcile them.
    // We sync Redux from the URL query parameter (and if the value is the same, this won't cause any issues anyway):
    dispatch(setSelectedEntity(qpEntity));

    if (qpEntity && qpRawTablePage) {
      // Sync entity current table page from the URL. The action handles invalid cases/if the page didn't change.
      // If a valid change occurs, current match data in the Redux state will be invalidated & re-fetched as needed.
      dispatch(setMatchesPage([qpEntity, parseInt(qpRawTablePage, 10)]));
    }

    if (qpRawTablePageSize) {
      // Sync table page size from the URL. The action handles invalid cases/if the page size didn't change.
      // If a valid change occurs, current match data in the Redux state will be invalidated & re-fetched as needed.
      dispatch(setMatchesPageSize(parseInt(qpRawTablePageSize, 10)));
    }

    const qpTextQueryStr = (qpTextQuery ?? '').trim(); // undefined --> ''; trim whitespace
    if ((textQuery && qpTextQuery === undefined) || qpTextQueryStr !== textQuery) {
      // If there's a mismatch between the query parameter and Redux text queries, we have to reconcile them. We sync
      // Redux from the URL query parameter for free-text search so we can perform the search itself below.
      // If the text query has truly changed, this will also invalidate any current match pages, to re-fetch results
      // entity tables.
      dispatch(setTextQuery(qpTextQueryStr)); // [!!!] This should be the only place setTextQuery(...) gets called.
    }

    // If we have new valid filter query parameters (that aren't already in Redux), put them into the state.
    // We also only want to update the query params object (& trigger a re-render) if the new object has different
    // contents otherwise we can produce a render loop (this is handled *inside the action*).
    // We want to prioritize the URL over Redux, so we sync the Redux state with the URL values. This can happen on
    // first load or if we change/add/remove a filter value via URL change (which is how these changes should be
    // executed in the UI). We then get proper one-way traffic from the URL to the Redux state.
    dispatch(setFilters(validFiltersState));

    // Finally, we can go ahead and execute the search:
    dispatch(performKatsuDiscovery());

    if (qpEntity) {
      // If we have a search results table open right now (meaning the _e query param is set --> qpEntity is not null),
      // we can also fetch the relevant discovery match page (if needed; internal checks will stop this from executing
      // if already fetching or the data hasn't been invalidated by one of the actions above):
      dispatch(fetchDiscoveryMatches(qpEntity));
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
    setSearchUrl,
    filters,
    textQuery,
    selectedEntity,
    matchData,
    pageSize,
    loadAndValidateQuery,
  ]);
};
