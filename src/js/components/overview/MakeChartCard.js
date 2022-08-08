import React from 'react';
import Chart from './charts/Chart';
import { Card, Button, Tooltip, Space, Typography } from 'antd';
import { CloseOutlined, TeamOutlined } from '@ant-design/icons';
import { CARD_STYLE } from '../../constants/overviewConstants';

const MakeChartCard = ({ section, chart, onRemoveChart }) => {
  const { name, title, data, chartType, config, id } = chart;

  const extraOptionsData = [
    // to enable extra buttons, follow the commented example
    // {
    //   icon: <UpOutlined />,
    //   description: 'Move the chart up',
    //   onClick: () => onMoveChartUp(chart.name),
    // },
    {
      icon: <CloseOutlined />,
      description: 'Remove this chart',
      onClick: () => {
        onRemoveChart({ section, id });
      },
    },
  ];

  const ed = extraOptionsData.map((opt, index) => (
    <Tooltip key={index} title={opt.description}>
      <Button shape="circle" icon={opt.icon} onClick={opt.onClick} />
    </Tooltip>
  ));

  const missingCount = data.find((e) => e.x === 'missing')?.y ?? 0;
  const missingDataText = (
    <Typography.Text key={-1} type="secondary" italic>
      <TeamOutlined /> {missingCount} missing
    </Typography.Text>
  );

  if (missingCount) ed.unshift(missingDataText);

  return (
    <div key={name} style={{ height: '100%', width: '430px' }}>
      <Card title={title} style={CARD_STYLE} size="small" extra={<Space size="small">{ed}</Space>}>
        <Chart chartType={chartType} data={data} units={config?.units || undefined} />
      </Card>
    </div>
  );
};

export default MakeChartCard;
