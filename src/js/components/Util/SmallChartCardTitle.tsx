import type { CSSProperties, ReactNode } from 'react';
import { Space, Typography } from 'antd';

type SmallChartCardTitleProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionStyle?: CSSProperties;
  compact?: boolean;
};

const SmallChartCardTitle = ({ title, description, descriptionStyle, compact }: SmallChartCardTitleProps) => (
  <Space.Compact
    direction={compact ? 'horizontal' : 'vertical'}
    style={{
      fontWeight: 'normal',
      padding: description || compact ? '4px 4px' : '10px 4px',
      maxWidth: '100%',
      width: compact ? '100%' : 'auto',
      gap: compact ? '8px' : '0',
    }}
  >
    <Typography.Text
      ellipsis={!compact}
      style={{
        fontSize: compact ? '14px' : '20px',
        fontWeight: '600',
      }}
    >
      {title}
    </Typography.Text>
    {description && (
      <Typography.Text type="secondary" style={descriptionStyle} ellipsis={{ tooltip: description }}>
        {description}
      </Typography.Text>
    )}
  </Space.Compact>
);

export default SmallChartCardTitle;
