import { type CSSProperties, useMemo } from 'react';
import { memo, useRef } from 'react';
import { Button, Card, Row, Space, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { useTranslationFn } from '@/hooks';
import { useDashboardChartDimensions, useUiUserSettings } from '@/features/ui/hooks';
import type { DashboardChartMode } from '@/features/ui/types';
import type { ChartDataField } from '@/types/data';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';
import { getChartCssWidth } from '@/utils/chart';

const TITLE_FONT_SIZES: Record<DashboardChartMode, number> = { normal: 20, compact: 16, ultraCompact: 14 };
const DESCRIPTION_FONT_SIZES: Record<DashboardChartMode, number> = { normal: 14, compact: 13, ultraCompact: 12 };

const ChartCard = memo(({ section, chart, onRemoveChart, searchable }: ChartCardProps) => {
  const t = useTranslationFn();
  const containerRef = useRef<HTMLDivElement>(null);

  const { dashboardChartMode } = useUiUserSettings();
  const isCompact = ['compact', 'ultraCompact'].includes(dashboardChartMode);

  const { chartHeight, nColumns, gridGap } = useDashboardChartDimensions();

  const {
    id,
    data,
    field: { datatype, description, title, config },
    chartConfig,
  } = chart;

  const cardStyle = useMemo<CSSProperties>(() => ({ height: `calc(${chartHeight}px + 65px)` }), [chartHeight]);
  const rowEmptyStyle = useMemo<CSSProperties>(() => ({ height: `${chartHeight}px` }), [chartHeight]);

  const extraOptionsData = [
    {
      icon: <CloseOutlined />,
      description: t('Remove this chart'),
      onClick: () => {
        onRemoveChart({ section, id });
      },
    },
  ];

  return (
    <div ref={containerRef} key={id} style={{ gridColumn: `span ${chart.width}` }}>
      <Card
        title={
          <SmallChartCardTitle
            title={t(title)}
            description={t(description)}
            titleFontSize={TITLE_FONT_SIZES[dashboardChartMode]}
            // 56px = close button width + RHS padding (12px) * 2
            descriptionStyle={{
              fontSize: DESCRIPTION_FONT_SIZES[dashboardChartMode],
              width: `calc(${getChartCssWidth(nColumns, gridGap)} * ${chart.width} - 56px)`,
            }}
          />
        }
        className={isCompact ? 'rounded-none' : 'shadow rounded-xl'}
        style={cardStyle}
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
          <Row style={rowEmptyStyle} justify="center" align="middle">
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
}

export default ChartCard;
