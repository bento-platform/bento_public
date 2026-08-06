import { memo, useRef } from 'react';
import { Button, Card, Row, Space, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { CHART_SIZES } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import type { ChartDataField } from '@/types/data';
import type { ChartSizeMode } from '@/features/ui/types';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const ChartCard = memo(({ section, chart, onRemoveChart, searchable, mode: mode_ }: ChartCardProps) => {
  const t = useTranslationFn();
  const containerRef = useRef<HTMLDivElement>(null);

  const mode: ChartSizeMode = mode_ ?? 'normal';

  const { chartHeight, fontSize: chartFontSize } = CHART_SIZES[mode];
  const compact = mode === 'compact';

  const {
    id,
    data,
    field: { datatype, description, title, config },
    chartConfig,
  } = chart;

  const extraOptionsData = [
    {
      icon: <CloseOutlined />,
      description: t('Remove this chart'),
      onClick: () => {
        onRemoveChart({ section, id });
      },
    },
  ];

  const tTitle = t(title);
  const tDesc = description !== title ? t(description) : '';

  return (
    <div ref={containerRef} key={id} style={{ gridColumn: `span ${chart.width}` }}>
      <Card
        title={
          <SmallChartCardTitle
            title={tTitle}
            description={tDesc}
            descriptionStyle={compact ? undefined : { width: '375px' }}
            compact={compact}
          />
        }
        className={compact ? 'rounded-none' : 'shadow rounded-xl'}
        style={{ height: chartHeight + (compact ? 40 : 65) }}
        styles={{ body: { paddingTop: 0, paddingBottom: 0, fontSize: chartFontSize } }}
        size="small"
        extra={
          <Space size="small">
            {extraOptionsData.map((opt, index) => (
              <Tooltip key={index} title={opt.description}>
                <Button
                  shape="circle"
                  color="default"
                  variant={compact ? 'text' : undefined}
                  icon={opt.icon}
                  onClick={opt.onClick}
                  style={{ marginRight: compact ? -8 : 0 }}
                />
              </Tooltip>
            ))}
          </Space>
        }
      >
        {data.filter((e) => !(e.x === 'missing')).reduce((acc, cur) => acc + cur.y, 0) !== 0 ? (
          <Chart
            chartConfig={chartConfig}
            data={data}
            units={datatype === 'number' ? (config.units ?? '') : ''}
            id={id}
            key={id}
            isClickable={!!searchable}
            mode={mode}
          />
        ) : (
          <Row style={{ height: chartHeight }} justify="center" align="middle">
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
  searchable?: boolean;
  mode?: ChartSizeMode;
}

export default ChartCard;
