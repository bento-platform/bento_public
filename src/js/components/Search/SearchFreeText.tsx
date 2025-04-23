import { type CSSProperties, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, Typography } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';

import { WIDTH_100P_STYLE } from '@/constants/common';
import { TEXT_QUERY_PARAM } from '@/features/search/constants';
import { useNonFilterQueryParams, useSearchQuery } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';
import { RequestStatus } from '@/types/requests';

import RequestStatusIcon from './RequestStatusIcon';

type SearchFreeTextProps = { focused: boolean; onFocus: () => void; style?: CSSProperties };
type FreeTextFormValues = { q: string };

const SearchFreeText = ({ focused, onFocus, style }: SearchFreeTextProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { filterQueryParams, textQuery, textQueryStatus } = useSearchQuery();
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
          ...filterQueryParams,
          ...nonFilterQueryParams,
          [TEXT_QUERY_PARAM]: values.q,
        })
      );
    },
    [location.pathname, filterQueryParams, nonFilterQueryParams, navigate]
  );

  return (
    <div style={style}>
      <Typography.Title level={3} className={'search-form-title' + (focused ? ' focused' : '')}>
        <span className="search-form-title__inner" onClick={onFocus}>
          <FormOutlined />{' '}
          <span className={textQuery !== '' ? 'should-underline-if-unfocused' : ''}>{t('Text search')}</span>
        </span>
        <RequestStatusIcon status={textQueryStatus} />
      </Typography.Title>
      <Form form={form} onFocus={onFocus} onFinish={onFinish}>
        <Space.Compact style={WIDTH_100P_STYLE}>
          <Form.Item name="q" initialValue="" noStyle={true}>
            <Input prefix={<SearchOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={textQueryStatus === RequestStatus.Pending}>
            {t('Search')}
          </Button>
        </Space.Compact>
      </Form>
    </div>
  );
};

export default SearchFreeText;
