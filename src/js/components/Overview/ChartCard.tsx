import type React from 'react';
import { memo, useRef } from 'react';
import { Button, Card, Row, Space, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chart from './Chart';
import CustomEmpty from '../Util/CustomEmpty';
import { BOX_SHADOW, CHART_HEIGHT } from '@/constants/overviewConstants';
import { useElementWidth, useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { ChartDataField } from '@/types/data';
import SmallChartCardTitle from '@/components/Util/SmallChartCardTitle';

const CARD_STYLE: React.CSSProperties = { height: '415px', borderRadius: '11px', ...BOX_SHADOW };
const ROW_EMPTY_STYLE: React.CSSProperties = { height: `${CHART_HEIGHT}px` };

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
        title={
          <SmallChartCardTitle title={t(title)} description={t(description)} descriptionStyle={{ width: '375px' }} />
        }
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
