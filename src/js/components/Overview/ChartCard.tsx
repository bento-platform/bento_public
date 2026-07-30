import type { CSSProperties } from 'react';
import { memo, useRef } from 'react';
import { Button, Card, Row, Space, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import type { ChartDataField } from '@/types/data';
import type { ChartSizeMode } from '@/features/ui/types';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const CARD_STYLE: CSSProperties = { height: '415px' };
const ROW_EMPTY_STYLE: CSSProperties = { height: `${CHART_HEIGHT}px` };

const ChartCard = memo(({ section, chart, onRemoveChart, searchable, mode }: ChartCardProps) => {
  const t = useTranslationFn();
  const containerRef = useRef<HTMLDivElement>(null);

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

  const compact = mode === 'compact';

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
        style={CARD_STYLE}
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
  searchable?: boolean;
  mode?: ChartSizeMode;
}

export default ChartCard;
