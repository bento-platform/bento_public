import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

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

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      navigate(
        // Build a query URL with the new text search value and navigate to it. It'll be handled by the search
        // router/handler effect elsewhere.
        buildQueryParamsUrl(location.pathname, {
          ...filterQueryParams,
          ...nonFilterQueryParams,
          [TEXT_QUERY_PARAM]: values.q,
        })
      );
    },
    [location.pathname, filterQueryParams, nonFilterQueryParams, navigate]
  );

  return (
    <SearchSubForm titleKey="text_search" icon={<FormOutlined />} {...props}>
      <Form form={form} onFinish={onFinish}>
        <Space.Compact className="w-full">
          <Form.Item name="q" initialValue="" noStyle={true}>
            <Input prefix={<SearchOutlined />} />
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
