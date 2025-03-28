import { type CSSProperties, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { WIDTH_100P_STYLE } from '@/constants/common';
import { TEXT_QUERY_PARAM } from '@/features/search/constants';
import { useSearchQuery } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';
import { RequestStatus } from '@/types/requests';

import RequestStatusIcon from './RequestStatusIcon';

type SearchFreeTextProps = { onFocus: () => void; style?: CSSProperties };
type FreeTextFormValues = { q: string };

const SearchFreeText = ({ onFocus, style }: SearchFreeTextProps) => {
  const t = useTranslationFn();
  const location = useLocation();
  const navigate = useNavigate();

  const { filterQueryParams, textQuery, textQueryStatus } = useSearchQuery();

  const [form] = Form.useForm<FreeTextFormValues>();

  useEffect(() => {
    // If the textQuery state changes (from a URL parameter, presumably), update the form value to sync them.
    if (textQuery) {
      form.setFieldValue('q', textQuery);
    }
  }, [form, textQuery]);

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      navigate(buildQueryParamsUrl(location.pathname, { ...filterQueryParams, [TEXT_QUERY_PARAM]: values.q }));
    },
    [location.pathname, filterQueryParams, navigate]
  );

  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        <span style={{ marginRight: '0.5em' }}>{t('Text search')}</span>
        <RequestStatusIcon status={textQueryStatus} />
      </Typography.Title>
      <Form form={form} onFocus={onFocus} onFinish={onFinish}>
        <Space.Compact style={WIDTH_100P_STYLE}>
          <Form.Item name="q" noStyle={true}>
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
