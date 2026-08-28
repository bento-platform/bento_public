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

const CHART_CARD_BOTTOM_PADDING = 12;

const ChartCard = memo(({ section, chart, onRemoveChart, searchable, mode: mode_ }: ChartCardProps) => {
  const t = useTranslationFn();
  const containerRef = useRef<HTMLDivElement>(null);

  const mode: ChartSizeMode = mode_ ?? 'normal';

  const { chartHeight, fontSize: chartFontSize } = CHART_SIZES[mode];
  const compact = mode === 'compact';

  const {
    id,
    data,
    dataContext,
    field,
    field: { description, title },
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
        styles={{
          body: {
            display: 'flex',
            height: chartHeight + CHART_CARD_BOTTOM_PADDING,
            paddingTop: 0,
            paddingBottom: CHART_CARD_BOTTOM_PADDING,
            fontSize: chartFontSize,
          },
        }}
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
          <div className="flex-1 content-center">
            <Chart
              chartConfig={chartConfig}
              data={data}
              dataContext={dataContext}
              field={field}
              id={id}
              key={id}
              isClickable={!!searchable}
              mode={mode}
            />
          </div>
        ) : (
          <Row style={{ height: chartHeight }} className="w-full" justify="center" align="middle">
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
