import type { CSSProperties, ReactNode } from 'react';
import { Space, Typography } from 'antd';

type SmallChartCardTitleProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionStyle?: CSSProperties;
};

const SmallChartCardTitle = ({ title, description, descriptionStyle }: SmallChartCardTitleProps) => (
  <Space.Compact
    direction="vertical"
    style={{ fontWeight: 'normal', padding: description ? '4px 4px' : '10px 4px', maxWidth: '100%' }}
  >
    <Typography.Text
      ellipsis={true}
      style={{
        fontSize: '20px',
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
