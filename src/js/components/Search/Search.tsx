import React, { useEffect, useMemo } from 'react';
import { Row, Typography, Space, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { makeGetKatsuPublic, setQueryParams } from '@/features/search/query.store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';

import type { QueryParams } from '@/types/search';

const RoutedSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const maxQueryParameters = useAppSelector((state) => state.config.maxQueryParameters);
  const {
    querySections: searchSections,
    queryParams,
    isFetchingFields: isFetchingSearchFields,
  } = useAppSelector((state) => state.query);

  const searchFields = useMemo(
    () => searchSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [searchSections]
  );

  const validateQuery = (query: URLSearchParams): { valid: boolean; validQueryParamsObject: QueryParams } => {
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

    return { valid: JSON.stringify(validQueryParamArray) === JSON.stringify(queryParamArray), validQueryParamsObject };
  };

  // Synchronize Redux query params state from URL
  useEffect(() => {
    if (isFetchingSearchFields) return;
    if (!location.pathname.endsWith('/search')) return;
    const queryParam = new URLSearchParams(location.search);
    const { valid, validQueryParamsObject } = validateQuery(queryParam);
    if (valid) {
      dispatch(setQueryParams(validQueryParamsObject));
      dispatch(makeGetKatsuPublic());
    } else {
      console.debug('Redirecting to : ', buildQueryParamsUrl(location.pathname, validQueryParamsObject));
      navigate(buildQueryParamsUrl(location.pathname, validQueryParamsObject));
    }
  }, [location.search]);

  // Synchronize URL from Redux query params state
  useEffect(() => {
    if (!location.pathname.endsWith('/search')) return;
    navigate(buildQueryParamsUrl(location.pathname, queryParams), { replace: true });
  }, [queryParams]);

  return <Search />;
};

const WIDTH_100P_STYLE = { width: '100%' };
const SEARCH_SPACE_ITEM_STYLE = { item: WIDTH_100P_STYLE };
const SEARCH_SECTION_SPACE_ITEM_STYLE = { item: { display: 'flex', justifyContent: 'center' } };
const SEARCH_SECTION_STYLE = { maxWidth: 1200 };

const Search: React.FC = () => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  const searchSections = useAppSelector((state) => state.query.querySections);

  return (
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
