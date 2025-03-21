import { type CSSProperties, useCallback } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { WIDTH_100P_STYLE } from '@/constants/common';
import { useSearchQuery } from '@/features/search/hooks';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { RequestStatus } from '@/types/requests';

import RequestStatusIcon from './RequestStatusIcon';

type FreeTextFormValues = { q: string };

const SearchFreeText = ({ onFocus, style }: { onFocus: () => void; style?: CSSProperties }) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();

  const [form] = Form.useForm<FreeTextFormValues>();

  const onFinish = useCallback(
    (values: FreeTextFormValues) => {
      dispatch(performFreeTextSearch(values.q));
    },
    [dispatch]
  );

  const { textQueryStatus } = useSearchQuery();

  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        <span style={{ marginRight: '0.5em' }}>{t('Text search')}</span>
        <RequestStatusIcon status={textQueryStatus} />
      </Typography.Title>
      <Form form={form} onFocus={() => onFocus()} onFinish={onFinish}>
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
