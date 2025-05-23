import type { ReactNode } from 'react';
import { Card, Space, Statistic, Typography } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useAppSelector, useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

const COUNT_ENTRIES: { entity: 'individual' | 'biosample' | 'experiment'; icon: ReactNode }[] = [
  { entity: 'individual', icon: <TeamOutlined /> },
  { entity: 'biosample', icon: <BiDna /> },
  { entity: 'experiment', icon: <ExperimentOutlined /> },
];

const renderCount = (count: number | boolean | undefined, threshold: number): number | string =>
  count === undefined
    ? NO_RESULTS_DASHES
    : typeof count === 'boolean'
      ? count
        ? `>${threshold}`
        : NO_RESULTS_DASHES
      : count;

const Counts = () => {
  const t = useTranslationFn();

  const { counts, status } = useAppSelector((state) => state.data);

  const uncensoredCounts = useCanSeeUncensoredCounts();
  const { countThreshold } = useConfig();

  const waitingForData = WAITING_STATES.includes(status);

  return (
    <>
      <Typography.Title level={3}>{t('Counts')}</Typography.Title>
      <Space wrap>
        {COUNT_ENTRIES.map(({ entity, icon }, i) => {
          const count = renderCount(counts[entity], countThreshold);
          return (
            <Card key={i} className="shadow count-card" style={{ height: waitingForData ? 138 : 114 }}>
              <Statistic
                title={<CountsTitleWithHelp entity={entity} />}
                value={count || (uncensoredCounts ? count : NO_RESULTS_DASHES)}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={icon}
                loading={waitingForData}
              />
            </Card>
          );
        })}
      </Space>
    </>
  );
};

export default Counts;
