import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

import ExpSvg from '../Util/ExpSvg';
import { COUNTS_FILL } from '../../constants/overviewConstants';
import { DEFAULT_TRANSLATION } from '../../constants/configConstants';

const Counts = () => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  const data = [
    {
      title: 'Individuals',
      icon: <TeamOutlined />,
      count: useSelector((state) => state.data.counts.individuals),
    },
    {
      title: 'Biosamples',
      icon: <BiDna />,
      count: useSelector((state) => state.data.counts.biosamples),
    },
    {
      title: 'Experiments',
      icon: <ExpSvg />,
      count: useSelector((state) => state.data.counts.experiments),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space direction="horizontal">
        {data.map(({ title, icon, count }, i) => (
          <Card key={i}>
            <Statistic title={t(title)} value={count} valueStyle={{ color: COUNTS_FILL }} prefix={icon} />
          </Card>
        ))}
      </Space>
    </>
  );
};

export default Counts;
