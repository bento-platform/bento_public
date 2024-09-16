import React from 'react';
import { Typography, Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import ExpSvg from '../Util/ExpSvg';
import { COUNTS_FILL, BOX_SHADOW } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationDefault } from '@/hooks';

const Counts = () => {
  const td = useTranslationDefault();

  const { counts, isFetchingData } = useAppSelector((state) => state.data);

  const data = [
    {
      title: 'Individuals',
      icon: <TeamOutlined />,
      count: counts.individuals,
    },
    {
      title: 'Biosamples',
      icon: <BiDna />,
      count: counts.biosamples,
    },
    {
      title: 'Experiments',
      icon: <ExpSvg />,
      count: counts.experiments,
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{td('Counts')}</Typography.Title>
      <Space direction="horizontal">
        {data.map(({ title, icon, count }, i) => (
          <Card key={i} style={BOX_SHADOW}>
            <Statistic
              title={td(title)}
              value={count}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={icon}
              loading={isFetchingData}
            />
          </Card>
        ))}
      </Space>
    </>
  );
};

export default Counts;
