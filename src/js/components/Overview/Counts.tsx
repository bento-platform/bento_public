import { type ReactNode, useState } from 'react';
import { Card, Flex, Space, Statistic, Typography } from 'antd';
import { DownOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';
import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts, useScopeQueryData } from '@/hooks/censorship';
import { useData } from '@/features/data/hooks';
import type { BentoEntity } from '@/types/entities';

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

  const { hasPermission: hasQueryData } = useScopeQueryData();

  const [selectedEntity, setSelectedEntity] = useState<BentoEntity | null>('individual');

  // TODO: hide counts if no filters applied and we have no data
  //  https://redmine.c3g-app.sd4h.ca/issues/2518#change-14170

  return (
    <Flex vertical={true} gap={12}>
      <Typography.Title level={3} className="mb-0">
        {t('Counts')}
      </Typography.Title>
      <Space size={12} wrap>
        {COUNT_ENTRIES.map(({ entity, icon }, i) => {
          const count = renderCount(counts[entity], countThreshold);
          const selected = selectedEntity === entity;
          return (
            <Card
              key={i}
              className={'shadow count-card' + (hasQueryData && !selected ? ' count-card-clickable' : '')}
              onClick={!selected ? () => setSelectedEntity(entity) : undefined}
              style={{
                height: (waitingForData ? 138 : 114) + (hasQueryData ? 12 : 0) + (selected ? 12 : 0),
                ...(selected
                  ? {
                      borderBottom: 'none',
                      zIndex: 3,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                      marginBottom: -12,
                    }
                  : {}),
              }}
            >
              <Statistic
                title={<CountsTitleWithHelp entity={entity} />}
                value={count || (uncensoredCounts ? count : NO_RESULTS_DASHES)}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={icon}
                loading={waitingForData}
              />
              {hasQueryData && (
                <div
                  className="count-card__show-hide cursor-pointer antd-gray-7"
                  style={{
                    backgroundColor: selected ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.0)',
                    bottom: selected ? -8 : 0,
                  }}
                  onClick={selected ? () => setSelectedEntity(null) : undefined}
                >
                  <DownOutlined
                    style={{
                      transform: `rotate(${selected ? '180deg' : '0deg'})`,
                      transition: 'transform 0.15s ease-in-out',
                    }}
                  />{' '}
                  {t(selected ? 'HIDE' : 'SHOW')}
                </div>
              )}
            </Card>
          );
        })}
      </Space>
      {selectedEntity && (
        <Card className="shadow">
          <SearchResultsTablePage entity={selectedEntity} />
        </Card>
      )}
    </Flex>
  );
};

export default Counts;
