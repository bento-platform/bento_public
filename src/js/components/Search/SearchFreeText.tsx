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

const SearchFreeText = ({ focused, onFocus, requestStatus, ...props }: DefinedSearchSubFormProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { textQuery } = useSearchQuery();
  const nonFilterQueryParams = useNonFilterQueryParams();

  const [form] = Form.useForm<FreeTextFormValues>();

  useEffect(() => {
    // If:
    //  - the textQuery state changes (from a URL parameter, presumably), then update the form value to sync them.
    //  - the focused state changes, then reset the form value to the current Redux value.
    if (textQuery) {
      form.setFieldValue('q', textQuery);
    }
  }, [form, focused, textQuery]);

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      navigate(
        buildQueryParamsUrl(location.pathname, {
          // Explicitly don't include filter query params to create a purely-text-search "share-able" URL, without any
          // extraneous populating of the filters form. Include nonFilterQueryParams since they may contain extra
          // information about how to initially render the search form/display.
          ...nonFilterQueryParams,
          [TEXT_QUERY_PARAM]: values.q,
        })
      );
    },
    [location.pathname, nonFilterQueryParams, navigate]
  );

  return (
    <SearchSubForm
      title="Text search"
      icon={<FormOutlined />}
      focused={focused}
      onFocus={onFocus}
      requestStatus={requestStatus}
      {...props}
    >
      <Form form={form} onFocus={onFocus} onFinish={onFinish}>
        <Space.Compact className="w-full">
          <Form.Item name="q" initialValue="" noStyle={true}>
            <Input prefix={<SearchOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={requestStatus === RequestStatus.Pending}>
            {t('Search')}
          </Button>
        </Space.Compact>
      </Form>
    </SearchSubForm>
  );
};

export default SearchFreeText;
