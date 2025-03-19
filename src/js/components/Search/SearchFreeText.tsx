import type { CSSProperties } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { WIDTH_100P_STYLE } from '@/constants/common';
import { useTranslationFn } from '@/hooks';

const SearchFreeText = ({ onFocus, style }: { onFocus: () => void; style?: CSSProperties }) => {
  const t = useTranslationFn();

  return (
    <div style={style}>
      <Typography.Title level={3} style={{ fontSize: '1.1rem', marginTop: 0 }}>
        {t('Text search')}
      </Typography.Title>
      <Form onFocus={() => onFocus()} onFinish={console.log}>
        <Space.Compact style={WIDTH_100P_STYLE}>
          <Form.Item name="q" noStyle={true}>
            <Input prefix={<SearchOutlined />} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {t('Search')}
          </Button>
        </Space.Compact>
      </Form>
    </div>
  );
};

export default SearchFreeText;
