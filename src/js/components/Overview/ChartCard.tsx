import type { CSSProperties } from 'react';
import { memo, useRef } from 'react';
import { Button, Card, Row, Space, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import type { ChartDataField } from '@/types/data';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const CARD_STYLE: CSSProperties = { height: '415px' };
const ROW_EMPTY_STYLE: CSSProperties = { height: `${CHART_HEIGHT}px` };

const ChartCard = memo(({ section, chart, onRemoveChart, searchable }: ChartCardProps) => {
  const t = useTranslationFn();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    field: { id, description, title, config },
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

  return (
    <div ref={containerRef} key={id} style={{ gridColumn: `span ${chart.width}` }}>
      <Card
        title={
          <SmallChartCardTitle title={t(title)} description={t(description)} descriptionStyle={{ width: '375px' }} />
        }
        className="shadow rounded-xl"
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
        {data.filter((e) => !(e.x === 'missing')).reduce((acc, cur) => acc + cur.y, 0) !== 0 ? (
          <Chart
            chartConfig={chartConfig}
            data={data}
            units={config?.units || ''}
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
}

export default ChartCard;
