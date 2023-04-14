import React from 'react';
import Chart from './Chart';
import { Card, Button, Tooltip, Space, Typography, Row } from 'antd';
import { CloseOutlined, TeamOutlined, QuestionOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CustomEmpty from '../Util/CustomEmpty';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '../../constants/configConstants';

const CARD_STYLE = { width: '430px', height: '415px', margin: '5px 0', borderRadius: '11px' };

const MakeChartCard = ({ section, chart, onRemoveChart }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  const { name, title, data, chartType, config, id, description } = chart;

  const extraOptionsData = [
    {
      icon: <QuestionOutlined />,
      description: t(description),
      onClick: () => {},
    },
    {
      icon: <CloseOutlined />,
      description: 'Remove this chart',
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
    <div key={name} style={{ height: '100%', width: '430px' }}>
      <Card title={t(title)} style={CARD_STYLE} size="small" extra={<Space size="small">{ed}</Space>}>
        {data.filter((e) => !(e.x === 'missing')).length !== 0 ? (
          <Chart chartType={chartType} data={data} units={config?.units || undefined} />
        ) : (
          <Row style={{ height: '350px ' }} justify="center" align="middle">
            <CustomEmpty text="No Data" />
          </Row>
        )}
      </Card>
    </div>
  );
};

export default MakeChartCard;
