import { useCallback, useEffect, useMemo } from 'react';
import { Row, Typography, Space, FloatButton } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

import { useConfig } from '@/features/config/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { makeGetKatsuPublic, setQueryParams } from '@/features/search/query.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';

import Loader from '@/components/Loader';
import { RequestStatus } from '@/types/requests';
import type { QueryParams } from '@/types/search';
import { WAITING_STATES } from '@/constants/requests';

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

  // TODO: allow disabling max query parameters for authenticated and authorized users when Katsu has AuthZ
  // const maxQueryParametersRequired = useAppSelector((state) => state.config.maxQueryParametersRequired);
  // const allowedQueryParamsCount = maxQueryParametersRequired ? maxQueryParameters : queryParamCount;

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

const WIDTH_100P_STYLE = { width: '100%' };
const SEARCH_SPACE_ITEM_STYLE = { item: WIDTH_100P_STYLE };
const SEARCH_SECTION_SPACE_ITEM_STYLE = { item: { display: 'flex', justifyContent: 'center' } };
const SEARCH_SECTION_STYLE = { maxWidth: 'var(--content-max-width)' };

const Search = () => {
  const t = useTranslationFn();

  const { fieldsStatus, querySections: searchSections } = useSearchQuery();

  return WAITING_STATES.includes(fieldsStatus) ? (
    <Loader />
  ) : (
    <>
      <Row justify="center">
        <Space direction="vertical" align="center" style={WIDTH_100P_STYLE} styles={SEARCH_SPACE_ITEM_STYLE}>
          <SearchResults />
          <Space direction="vertical" size="large" style={WIDTH_100P_STYLE} styles={SEARCH_SECTION_SPACE_ITEM_STYLE}>
            {searchSections.map(({ section_title, fields }, i) => (
              <div key={i} style={SEARCH_SECTION_STYLE}>
                <Typography.Title level={4}>{t(section_title)}</Typography.Title>
                <SearchFieldsStack key={i} queryFields={fields} />
              </div>
            ))}
          </Space>
        </Space>
      </Row>
      <FloatButton.BackTop />
    </>
  );
};

export default RoutedSearch;
