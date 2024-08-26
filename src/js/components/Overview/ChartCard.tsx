import React, { memo, useRef } from 'react';
import { Card, Button, Tooltip, Space, Typography, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { CHART_HEIGHT, BOX_SHADOW } from '@/constants/overviewConstants';
import { useElementWidth, useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { ChartDataField } from '@/types/data';

const CARD_STYLE: React.CSSProperties = { height: '415px', borderRadius: '11px', ...BOX_SHADOW };
const ROW_EMPTY_STYLE: React.CSSProperties = { height: `${CHART_HEIGHT}px` };

interface TitleComponentProps {
  title: string;
  description: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ title, description }) => (
  <Space.Compact direction="vertical" style={{ fontWeight: 'normal', padding: '5px 5px' }}>
    <Typography.Text style={{ fontSize: '20px', fontWeight: '600' }}>{title}</Typography.Text>
    <Typography.Text type="secondary" style={{ width: '375px' }} ellipsis={{ tooltip: description }}>
      {description}
    </Typography.Text>
  </Space.Compact>
);

const ChartCard: React.FC<ChartCardProps> = memo(({ section, chart, onRemoveChart }) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(containerRef, chart.width);

  const {
    data,
    field: { id, description, title, config },
    chartConfig,
    isSearchable,
  } = chart;

  const extraOptionsData = [
    {
      icon: <CloseOutlined />,
      description: td('Remove this chart'),
      onClick: () => {
        onRemoveChart({ section, id });
      },
    },
  ];

  return (
    <div ref={containerRef} key={id} style={{ gridColumn: `span ${width}` }}>
      <Card
        title={<TitleComponent title={t(title)} description={t(description)} />}
        style={CARD_STYLE}
        size="small"
        extra={
          <Space size="small">
            {extraOptionsData.map((opt, index) => (
              <Tooltip key={index} title={opt.description}>
                <Button shape="circle" icon={opt.icon} onClick={opt.onClick} />
              </Tooltip>
            ))}
          </Space>
        }
      >
        {data.filter((e) => !(e.x === 'missing')).length !== 0 ? (
          <Chart
            chartConfig={chartConfig}
            data={data}
            units={config?.units || ''}
            id={id}
            key={id}
            isClickable={isSearchable}
          />
        ) : (
          <Row style={ROW_EMPTY_STYLE} justify="center" align="middle">
            <CustomEmpty text="No Data" />
          </Row>
        )}
      </Card>
    </div>
  );
});

ChartCard.displayName = 'ChartCard';

export interface ChartCardProps {
  section: string;
  chart: ChartDataField;
  onRemoveChart: (arg: { section: string; id: string }) => void;
}

export default ChartCard;
