import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { AiOutlineExperiment } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

const Counts = () => {
  const { t } = useTranslation();

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
      icon: <AiOutlineExperiment />,
      count: useSelector((state) => state.data.counts.experiments),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space direction="horizontal">
        {data.map(({ title, icon, count }) => (
          <Card>
            <Statistic title={t(title)} value={count} valueStyle={{ color: '#1890ff' }} prefix={icon} />
          </Card>
        ))}
      </Space>
    </>
  );
};

export default Counts;
