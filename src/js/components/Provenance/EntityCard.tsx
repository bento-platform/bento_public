import type { ReactNode } from 'react';
import { Card, type CardProps, Divider, Flex, Typography, theme } from 'antd';

const { Title } = Typography;
const { useToken } = theme;

const EntityCard = ({
  supertitle,
  title,
  children,
  extra,
  primary,
  ...props
}: { supertitle?: ReactNode; title?: ReactNode; children?: ReactNode; extra?: ReactNode; primary?: boolean } & Omit<
  CardProps,
  'title' | 'children' | 'extra' | 'size' | 'styles'
>) => {
  const { token } = useToken();

  return (
    <Card
      size="small"
      style={
        primary
          ? {
              borderColor: token.colorPrimaryBorder,
              background: `linear-gradient(
                180deg, color-mix(in srgb, ${token.colorPrimaryBg}, white 60%), rgba(255, 255, 255, 0.0))`,
            }
          : undefined
      }
      styles={{ body: { display: 'flex', flexDirection: 'column' } }}
      {...props}
    >
      {!!supertitle && (
        <span style={{ textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.55)', fontSize: 12, fontWeight: 'bold' }}>
          {supertitle}
        </span>
      )}
      <Flex vertical className="flex-1">
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
};

export default EntityCard;
