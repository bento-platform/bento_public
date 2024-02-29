import React from 'react';
import { Typography, Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import ExpSvg from '../Util/ExpSvg';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationDefault } from '@/hooks';

const Counts = () => {
  const td = useTranslationDefault();

  const data = [
    {
      title: 'Individuals',
      icon: <TeamOutlined />,
      count: useAppSelector((state) => state.data.counts.individuals),
    },
    {
      title: 'Biosamples',
      icon: <BiDna />,
      count: useAppSelector((state) => state.data.counts.biosamples),
    },
    {
      title: 'Experiments',
      icon: <ExpSvg />,
      count: useAppSelector((state) => state.data.counts.experiments),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{td('Counts')}</Typography.Title>
      <Space direction="horizontal">
        {data.map(({ title, icon, count }, i) => (
          <Card key={i} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Statistic title={td(title)} value={count} valueStyle={{ color: COUNTS_FILL }} prefix={icon} />
          </Card>
        ))}
      </Space>
    </>
  );
};

export default Counts;
