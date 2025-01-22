import type { ReactNode } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const SearchToolTip = ({ children }: { children: ReactNode }) => {
  return (
    <Tooltip title={children} styles={{ body: { display: 'inline-block' } }}>
      <InfoCircleOutlined />
    </Tooltip>
  );
};

export default SearchToolTip;
