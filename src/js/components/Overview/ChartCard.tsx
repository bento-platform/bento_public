import React, { memo } from 'react';
import Chart from './Chart';
import { Card, Button, Tooltip, Space, Typography, Row } from 'antd';
import { CloseOutlined, TeamOutlined, QuestionOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CustomEmpty from '../Util/CustomEmpty';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { ChartDataField } from '@/types/data';
import { CHART_HEIGHT } from '@/constants/overviewConstants';

const CARD_STYLE = { width: '100%', height: '415px', borderRadius: '11px' };

const ChartCard = memo(({ section, chart, onRemoveChart, width }: ChartCardProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  const {
    data,
    field: { id, description, title, config },
    chartConfig,
  } = chart;

  const extraOptionsData = [
    {
      icon: <QuestionOutlined />,
      description: t(description),
    },
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

  if (missingCount)
    ed.push(
      <Typography.Text key={0} type="secondary" italic>
        <TeamOutlined /> {missingCount} {td('missing')}
      </Typography.Text>
    );

  // controls (buttons)
  extraOptionsData.forEach((opt) => {
    ed.push(
      <Tooltip key={ed.length} title={opt.description}>
        <Button shape="circle" icon={opt.icon} onClick={opt.onClick} />
      </Tooltip>
    );
  });

  return (
    <div key={id} style={{ height: '100%', width }}>
      <Card title={t(title)} style={CARD_STYLE} size="small" extra={<Space size="small">{ed}</Space>}>
        {data.filter((e) => !(e.x === 'missing')).length !== 0 ? (
          <Chart chartConfig={chartConfig} data={data} units={config?.units || ''} id={id} />
        ) : (
          <Row style={{ height: `${CHART_HEIGHT}px` }} justify="center" align="middle">
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