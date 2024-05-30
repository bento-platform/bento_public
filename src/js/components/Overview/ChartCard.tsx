import React, { memo } from 'react';
import Chart from './Chart';
import { Card, Button, Tooltip, Space, Typography, Row } from 'antd';
import { CloseOutlined, TeamOutlined } from '@ant-design/icons';
import CustomEmpty from '../Util/CustomEmpty';
import { CHART_HEIGHT, BOX_SHADOW } from '@/constants/overviewConstants';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ChartDataField } from '@/types/data';

const CARD_STYLE = { width: '100%', height: '415px', borderRadius: '11px', ...BOX_SHADOW };
const ROW_EMPTY_STYLE = { height: `${CHART_HEIGHT}px` };

const TitleComponent: React.FC<TitleComponentProps> = ({ title, description, smallEllipsis }) => (
  <Space.Compact direction="vertical" style={{ fontWeight: 'normal', padding: '5px 5px' }}>
    <Typography.Text style={{ fontSize: '20px', fontWeight: '600' }}>{title}</Typography.Text>
    <Typography.Text
      type="secondary"
      style={smallEllipsis ? { width: '260px' } : { width: '375px' }}
      ellipsis={{ tooltip: description }}
    >
      {description}
    </Typography.Text>
  </Space.Compact>
);

interface TitleComponentProps {
  title: string;
  description: string;
  smallEllipsis: boolean;
}

const ChartCard = memo(({ section, chart, onRemoveChart, width }: ChartCardProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const {
    data,
    field: { id, description, title, config },
    chartConfig,
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

  const ed = [];

  // missing count label
  const missingCount = data.find((e) => e.x === 'missing')?.y ?? 0;

  if (missingCount) {
    ed.push(
      <Typography.Text key={0} type="secondary" italic>
        <TeamOutlined /> {missingCount} {td('missing')}
      </Typography.Text>
    );
  }

  // controls (buttons)
  extraOptionsData.forEach((opt) => {
    ed.push(
      <Tooltip key={ed.length} title={opt.description}>
        <Button shape="circle" icon={opt.icon} onClick={opt.onClick} />
      </Tooltip>
    );
  });

  // We add a key to the chart which includes width to force a re-render if width changes.
  return (
    <div key={id} style={{ height: '100%', width }}>
      <Card
        title={<TitleComponent title={t(title)} description={t(description)} smallEllipsis={!!missingCount} />}
        style={CARD_STYLE}
        size="small"
        extra={<Space size="small">{ed}</Space>}
      >
        {data.filter((e) => !(e.x === 'missing')).length !== 0 ? (
          <Chart
            chartConfig={chartConfig}
            data={data}
            units={config?.units || ''}
            id={id}
            key={`${id}-width-${width}`}
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
  width: number;
}

export default ChartCard;
