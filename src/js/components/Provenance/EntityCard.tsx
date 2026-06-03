import type { ReactNode } from 'react';
import { Card, type CardProps, Divider, Flex, Typography } from 'antd';

const { Title } = Typography;

const EntityCard = ({
  supertitle,
  title,
  children,
  extra,
  ...props
}: { supertitle?: ReactNode; title?: ReactNode; children?: ReactNode; extra?: ReactNode } & Omit<
  CardProps,
  'title' | 'children' | 'extra' | 'size' | 'styles'
>) => (
  <Card size="small" styles={{ body: { display: 'flex', flexDirection: 'column' } }} {...props}>
    {!!supertitle && (
      <span style={{ textTransform: 'uppercase', color: '#999', fontSize: 12, fontWeight: 'bold' }}>{supertitle}</span>
    )}
    <Flex vertical gap={8} className="flex-1">
      <Title level={5} style={{ marginBottom: 0, fontWeight: 'normal' }}>
        {title}
      </Title>
      {children}
      {!!extra && (
        <>
          <Divider style={{ margin: '8px -12px 0 -12px', width: 'calc(100% + 24px)' }} />
          <div>{extra}</div>
        </>
      )}
    </Flex>
  </Card>
);

export default EntityCard;
