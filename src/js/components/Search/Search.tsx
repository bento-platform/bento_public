import React, { useEffect, useMemo } from 'react';
import { Row, Typography, Space, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';

import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

import { makeGetKatsuPublic, setQueryParams } from '@/features/search/query.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';

type QueryParams = { [key: string]: string };

const Search = () => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchSections = useAppSelector((state) => state.query.querySections);
  const maxQueryParameters = useAppSelector((state) => state.config.maxQueryParameters);
  const queryParams = useAppSelector((state) => state.query.queryParams);

  const searchFields = useMemo(
    () => searchSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [searchSections]
  );

  const validateQuery = (key: string, value: string) => {
    const field = searchFields.find((e) => e.id === key);
    return field && field.options.includes(value);
  };

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search);
    const queryParamArray = Array.from(queryParam.entries()).map(([key, value]) => ({ key, value }));

    const validQueryParamArray = queryParamArray
      .filter(({ key, value }) => validateQuery(key, value))
      .slice(0, maxQueryParameters);

    const validQueryParamsObject = validQueryParamArray.reduce<QueryParams>((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    if (JSON.stringify(validQueryParamArray) !== JSON.stringify(queryParamArray)) {
      const queryString = new URLSearchParams(validQueryParamsObject).toString();
      navigate(`?${queryString}`, { replace: true });
    } else {
      if (JSON.stringify(queryParams) !== JSON.stringify(validQueryParamsObject)) {
        dispatch(setQueryParams(validQueryParamsObject));
        dispatch(makeGetKatsuPublic());
      }

      const currentQueryParams = new URLSearchParams(queryParams).toString();
      if (location.search !== `?${currentQueryParams}`) {
        navigate(`?${currentQueryParams}`, { replace: true });
      }
    }
  }, [location.search, queryParams, validateQuery]);

  return (
    <>
      <Row justify="center">
        <Space direction="vertical" align="center">
          <SearchResults />
          <Space direction="vertical" size="large">
            {searchSections.map((section, i) => (
              <div key={i}>
                <Typography.Title level={4}>{t(section.section_title)}</Typography.Title>
                <SearchFieldsStack key={i} queryFields={section.fields} />
              </div>
            ))}
          </Space>
        </Space>
      </Row>
      <FloatButton.BackTop />
    </>
  );
};

export default Search;
