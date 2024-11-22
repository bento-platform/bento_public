import { type CSSProperties, type ReactNode } from 'react';
import { Card, Popover, Space, Statistic, Typography } from 'antd';
import { ExperimentOutlined, InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import { NO_RESULTS_DASHES } from '@/constants/searchConstants';
import { useAppSelector, useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

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

  const uncensoredCounts = useCanSeeUncensoredCounts();

  // Break down help into multiple sentences inside an array to make translation a bit easier.
  const data = [
    {
      entity: 'individual',
      icon: <TeamOutlined />,
      count: counts.individuals,
    },
    {
      entity: 'biosample',
      icon: <BiDna />,
      count: counts.biosamples,
    },
    {
      entity: 'experiment',
      icon: <ExperimentOutlined />,
      count: counts.experiments,
    },
  ];

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space wrap>
        {data.map(({ entity, icon, count }, i) => {
          const title = t(`entities.${entity}`, T_PLURAL_COUNT);
          return (
            <Card key={i} style={{ ...styles.countCard, height: isFetchingData ? 138 : 114 }}>
              <Statistic
                title={
                  <Space>
                    {title}
                    {
                      <Popover
                        title={title}
                        content={<CountsHelp>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</CountsHelp>}
                      >
                        <InfoCircleOutlined />
                      </Popover>
                    }
                  </Space>
                }
                value={count || (uncensoredCounts ? count : NO_RESULTS_DASHES)}
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
