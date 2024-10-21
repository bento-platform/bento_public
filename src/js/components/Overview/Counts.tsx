import { type CSSProperties, Fragment } from 'react';
import { Typography, Card, Space, Statistic, Popover } from 'antd';
import { InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import ExpSvg from '../Util/ExpSvg';
import { COUNTS_FILL, BOX_SHADOW } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationDefault } from '@/hooks';

const styles: Record<string, CSSProperties> = {
  countCard: {
    ...BOX_SHADOW,
    minWidth: 150,
    transition: 'height 0.3s ease-in-out',
  },
};

const Counts = () => {
  const td = useTranslationDefault();

  const { counts, isFetchingData } = useAppSelector((state) => state.data);

  // Break down help into multiple sentences inside an array to make translation a bit easier.
  const data = [
    {
      title: 'entities.Individuals',
      help: ['individual_help_1'],
      icon: <TeamOutlined />,
      count: counts.individuals,
    },
    {
      title: 'entities.Biosamples',
      help: ['biosample_help_1'],
      icon: <BiDna />,
      count: counts.biosamples,
    },
    {
      title: 'entities.Experiments',
      help: ['experiment_help_1', 'experiment_help_2'],
      icon: <ExpSvg />,
      count: counts.experiments,
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{td('Counts')}</Typography.Title>
      <Space direction="horizontal">
        {data.map(({ title, help, icon, count }, i) => (
          <Card key={i} style={{ ...styles.countCard, height: isFetchingData ? 138 : 114 }}>
            <Statistic
              title={
                <Space>
                  {td(title)}
                  {help && (
                    <Popover
                      title={td(title)}
                      content={
                        <div style={{ maxWidth: 360 }}>
                          {help.map((h, i) => (
                            <Fragment key={i}>{td(`entities.${h}`)} </Fragment>
                          ))}
                        </div>
                      }
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  )}
                </Space>
              }
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
