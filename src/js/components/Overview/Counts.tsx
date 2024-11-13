import { type CSSProperties, Fragment, type ReactNode } from 'react';
import { Card, Popover, Space, Statistic, Typography } from 'antd';
import { InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import ExpSvg from '../Util/ExpSvg';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationFn } from '@/hooks';

const styles: Record<string, CSSProperties> = {
  countCard: {
    ...BOX_SHADOW,
    minWidth: 150,
    transition: 'height 0.3s ease-in-out',
  },
};

const CountsHelp = ({ children }: { children: ReactNode }) => <div style={{ maxWidth: 360 }}>{children}</div>;

const Counts = () => {
  const t = useTranslationFn();

  const { counts, isFetchingData } = useAppSelector((state) => state.data);

  // Break down help into multiple sentences inside an array to make translation a bit easier.
  const data = [
    {
      entity: 'individual',
      help: ['individual_help_1'],
      icon: <TeamOutlined />,
      count: counts.individuals,
    },
    {
      entity: 'biosample',
      help: ['biosample_help_1'],
      icon: <BiDna />,
      count: counts.biosamples,
    },
    {
      entity: 'experiment',
      help: ['experiment_help_1', 'experiment_help_2'],
      icon: <ExpSvg />,
      count: counts.experiments,
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space wrap>
        {data.map(({ entity, help, icon, count }, i) => {
          // false count – just need the highest form of plural
          //  - see https://www.i18next.com/translation-function/plurals
          const title = t(`entities.${entity}`, { count: 100 });
          return (
            <Card key={i} style={{ ...styles.countCard, height: isFetchingData ? 138 : 114 }}>
              <Statistic
                title={
                  <Space>
                    {title}
                    {help && (
                      <Popover
                        title={title}
                        content={
                          <CountsHelp>
                            {help.map((h, i) => (
                              <Fragment key={i}>{t(`entities.${h}`)} </Fragment>
                            ))}
                          </CountsHelp>
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
          );
        })}
      </Space>
    </>
  );
};

export default Counts;
