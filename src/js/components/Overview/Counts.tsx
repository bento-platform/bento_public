import type { ReactNode } from 'react';
import { Card, Flex, Space, Statistic, Typography } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';
import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';
import { useData } from '@/features/data/hooks';

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

  const { counts, status } = useData();

  const uncensoredCounts = useCanSeeUncensoredCounts();
  const { countThreshold } = useConfig();

  const waitingForData = WAITING_STATES.includes(status);

  // TODO: hide counts if no filters applied and we have no data
  //  https://redmine.c3g-app.sd4h.ca/issues/2518#change-14170

  return (
    <Flex vertical={true} gap={12}>
      <Typography.Title level={3} className="mb-0">
        {t('Counts')}
      </Typography.Title>
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
      <Card className="shadow">
        <SearchResultsTablePage entity="individual" />
      </Card>
    </Flex>
  );
};

export default Counts;
