import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, Space, Tooltip } from 'antd';
import { CloseOutlined, FormOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';

import {
  DEFAULT_TEXT_QUERY_TYPE,
  TABLE_PAGE_QUERY_PARAM,
  TEXT_QUERY_PARAM,
  TEXT_QUERY_TYPE_PARAM,
  VALID_TEXT_QUERY_TYPES,
} from '@/features/search/constants';
import { useSearchQuery, useSearchQueryParams } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';

import { RequestStatus } from '@/types/requests';
import type { FtsQueryType } from '@/features/search/types';

import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

type FreeTextFormValues = { q: string; qt: FtsQueryType };

const SearchFreeText = (props: DefinedSearchSubFormProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { discoveryStatus, textQuery, textQueryType } = useSearchQuery();
  const allQueryParams = useSearchQueryParams();

  const [form] = Form.useForm<FreeTextFormValues>();

  useEffect(() => {
    // If the textQuery state changes (from a URL parameter, presumably), then update the form value to sync them.
    if (textQuery) {
      form.setFieldValue('q', textQuery);
    }
  }, [form, textQuery]);

  useEffect(() => {
    // If the textQueryType state changes (from a URL parameter, presumably), then update the form value to sync them.
    if (textQueryType) {
      form.setFieldValue('qt', textQueryType);
    }
  }, [form, textQueryType]);

  const navigateToTextQuery = useCallback(
    (query: string, queryType: FtsQueryType) => {
      if (query === textQuery && queryType === textQueryType) return;
      navigate(
        // Build a query URL with the new text search value and navigate to it. It'll be handled by the search
        // router/handler effect (useSearchRouterAndHandler) elsewhere.
        buildQueryParamsUrl(location.pathname, {
          ...allQueryParams,
          [TEXT_QUERY_PARAM]: query,
          [TEXT_QUERY_TYPE_PARAM]: queryType,
          // If we have an entity table page set, we need to reset it to 0 if the search text changes:
          ...(TABLE_PAGE_QUERY_PARAM in allQueryParams ? { [TABLE_PAGE_QUERY_PARAM]: '0' } : {}),
        })
      );
    },
    [location.pathname, allQueryParams, textQuery, textQueryType, navigate]
  );

  const onReset = useCallback(() => {
    form.setFieldValue('q', '');
    navigateToTextQuery('', DEFAULT_TEXT_QUERY_TYPE);
  }, [form, navigateToTextQuery]);

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      const query = values.q.trim();
      navigateToTextQuery(query, values.qt);
    },
    [navigateToTextQuery]
  );

  return (
    <SearchSubForm titleKey="text_search" icon={<FormOutlined />} {...props}>
      <Form form={form} onFinish={onFinish}>
        <Space.Compact className="w-full">
          <Form.Item name="q" initialValue={textQuery} noStyle={true}>
            <Input prefix={<SearchOutlined />} />
          </Form.Item>
          {!!textQuery && (
            <Button icon={<CloseOutlined />} onClick={onReset} disabled={discoveryStatus === RequestStatus.Pending} />
          )}
          <Form.Item name="qt" initialValue={textQueryType} noStyle={true}>
            <Select<FtsQueryType>
              disabled={discoveryStatus === RequestStatus.Pending}
              value={textQueryType}
              options={VALID_TEXT_QUERY_TYPES.map((value) => ({
                value,
                label: (
                  <span>
                    {t(`search.fts.${value}`)}
                    <Tooltip title={t(`search.fts.${value}_help`)}>
                      <InfoCircleOutlined style={{ marginLeft: '0.7em' }} />
                    </Tooltip>
                  </span>
                ),
              }))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={discoveryStatus === RequestStatus.Pending}>
            {t('Search')}
          </Button>
        </Space.Compact>
      </Form>
    </SearchSubForm>
  );
};

export default SearchFreeText;
