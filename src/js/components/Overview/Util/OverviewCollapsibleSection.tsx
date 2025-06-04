import { type ReactNode, useCallback, useState } from 'react';
import { Flex, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import { DownOutlined } from '@ant-design/icons';

const OverviewCollapsibleSection = ({ title, children }: { title: string; children: ReactNode }) => {
  const t = useTranslationFn();

  // TODO: move to LS if key provided?
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <Flex vertical={true} style={{ maxHeight: collapsed ? 32 : 99999, overflow: collapsed ? 'hidden' : 'visible' }}>
      <Typography.Title level={3} className="cursor-pointer select-none" onClick={toggleCollapse}>
        <span style={{ color: '#bfbfbf', fontSize: '0.8em' }}>
          <DownOutlined
            style={{ transform: `rotate(${collapsed ? '-90' : '0'}deg)`, transition: 'transform 0.1s ease-in-out' }}
          />
        </span>{' '}
        {t(title)}
      </Typography.Title>
      {children}
    </Flex>
  );
};

export default OverviewCollapsibleSection;
