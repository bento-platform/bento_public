import type { CSSProperties, ReactNode } from 'react';
import { Card, Space, Statistic, Typography } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useAppSelector, useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';
import type { BentoEntity } from '@/types/entities';
import { useConfig } from '@/features/config/hooks';

const styles: Record<string, CSSProperties> = {
  countCard: {
    minWidth: 150,
    transition: 'height 0.3s ease-in-out',
  },
};

type CountEntry = { entity: BentoEntity; icon: ReactNode; count: number | string };

const Counts = () => {
  const t = useTranslationFn();

  const { counts, status } = useAppSelector((state) => state.data);

  const uncensoredCounts = useCanSeeUncensoredCounts();
  const { countThreshold } = useConfig();

  const renderCount = (count: number | boolean): number | string =>
    typeof count === 'boolean' ? (count ? `\u2265${countThreshold}` : NO_RESULTS_DASHES) : count;

  // Break down help into multiple sentences inside an array to make translation a bit easier.
  const data: CountEntry[] = [
    {
      entity: 'individual',
      icon: <TeamOutlined />,
      count: renderCount(counts.individual),
    },
    {
      entity: 'biosample',
      icon: <BiDna />,
      count: renderCount(counts.biosample),
    },
    {
      entity: 'experiment',
      icon: <ExperimentOutlined />,
      count: renderCount(counts.experiment),
    },
  ];

  const waitingForData = WAITING_STATES.includes(status);

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space wrap>
        {data.map(({ entity, icon, count }, i) => (
          <Card key={i} className="shadow" style={{ ...styles.countCard, height: waitingForData ? 138 : 114 }}>
            <Statistic
              title={<CountsTitleWithHelp entity={entity} />}
              value={count || (uncensoredCounts ? count : NO_RESULTS_DASHES)}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={icon}
              loading={waitingForData}
            />
          </Card>
        ))}
      </Space>
    </>
  );
};

export default Counts;
