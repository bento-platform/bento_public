import React from 'react';
import { Col } from 'react-bootstrap';
import Chart from './charts/Chart';
import { Card, Button, Tooltip, Space } from 'antd';
import {
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { chartTypes } from '../../constants/overviewConstants';

const MakeChartCard = ({
  chart,
  onMoveChartUp,
  onRemoveChart,
  onMoveChartDown,
  onShowDrawer,
}) => {
  const props = chart.properties;

  const extraOptionsData = [
    {
      icon: <UpOutlined />,
      description: 'Move the chart up',
      onClick: () => onMoveChartUp(chart.name),
    },
    {
      icon: <DownOutlined />,
      description: 'Move the chart down',
      onClick: () => {
        onMoveChartDown(chart.name);
      },
    },
    {
      icon: <PlusOutlined />,
      description: 'Manage charts',
      onClick: onShowDrawer,
    },
    {
      icon: <CloseOutlined />,
      description: 'Remove this chart',
      onClick: () => {
        onRemoveChart(chart.name);
      },
    },
  ];

  const ed = extraOptionsData.map((opt, index) => (
    <Tooltip key={index} title={opt.description}>
      <Button shape="circle" icon={opt.icon} onClick={opt.onClick} />
    </Tooltip>
  ));

  return (
    <Col
      key={chart.name}
      sm={12}
      md={6}
      lg={4}
      xl={4}
      style={{ height: '100%' }}
    >
      <Card
        title={props.title}
        style={{ height: '415px' }}
        extra={<Space size="small">{ed}</Space>}
      >
        <Chart
          chartType={
            props?.type === 'number' || chart.props?.chart === 'bar'
              ? chartTypes.BAR
              : chartTypes.PIE
          }
          data={chart.data}
          units={props?.units || undefined}
        />
      </Card>
    </Col>
  );
};

export default MakeChartCard;
