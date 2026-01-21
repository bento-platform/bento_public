import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space } from 'antd';
import { CloseOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';

import { TEXT_QUERY_PARAM } from '@/features/search/constants';
import { useSearchQuery, useNonFilterQueryParams } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';
import { RequestStatus } from '@/types/requests';

import SearchSubForm, { type DefinedSearchSubFormProps } from '@/components/Search/SearchSubForm';

type FreeTextFormValues = { q: string };

const SearchFreeText = (props: DefinedSearchSubFormProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { discoveryStatus, filterQueryParams, textQuery } = useSearchQuery();
  const nonFilterQueryParams = useNonFilterQueryParams();

  const [form] = Form.useForm<FreeTextFormValues>();

  useEffect(() => {
    // If the textQuery state changes (from a URL parameter, presumably), then update the form value to sync them.
    if (textQuery) {
      form.setFieldValue('q', textQuery);
    }
  }, [form, textQuery]);

  const navigateToTextQuery = useCallback(
    (query: string) => {
      navigate(
        buildQueryParamsUrl(location.pathname, {
          ...filterQueryParams,
          ...nonFilterQueryParams,
          [TEXT_QUERY_PARAM]: query,
        })
      );
    },
    [navigate, location.pathname, filterQueryParams, nonFilterQueryParams]
  );

  const onReset = useCallback(() => {
    form.setFieldValue('q', '');
    navigateToTextQuery('');
  }, [form, navigateToTextQuery]);

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      const query = values.q.trim();
      navigateToTextQuery(query);
    },
    [navigateToTextQuery]
  );

  return (
    <SearchSubForm titleKey="text_search" icon={<FormOutlined />} {...props}>
      <Form form={form} onFinish={onFinish}>
        <Space.Compact className="w-full">
          <Form.Item name="q" initialValue="" noStyle={true}>
            <Input prefix={<SearchOutlined />} />
          </Form.Item>
          {!!textQuery && (
            <Button icon={<CloseOutlined />} onClick={onReset} disabled={discoveryStatus === RequestStatus.Pending} />
          )}
          <Button type="primary" htmlType="submit" loading={discoveryStatus === RequestStatus.Pending}>
            {t('Search')}
          </Button>
        </Space.Compact>
      </Form>
    </SearchSubForm>
  );
};

export default SearchFreeText;
