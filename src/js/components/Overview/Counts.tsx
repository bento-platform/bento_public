import { type ReactNode, useState } from 'react';
import { Card, Flex, Skeleton, Space, Statistic } from 'antd';
import { DownOutlined, ExperimentOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';
import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import CustomEmpty from '@/components/Util/CustomEmpty';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { useData } from '@/features/data/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts, useScopeQueryData } from '@/hooks/censorship';
import type { BentoEntity, BentoCountEntity } from '@/types/entities';

const COUNT_ENTRIES: { entity: BentoCountEntity; icon: ReactNode }[] = [
  { entity: 'individual', icon: <TeamOutlined /> },
  { entity: 'biosample', icon: <BiDna /> },
  { entity: 'experiment', icon: <ExperimentOutlined /> },
  { entity: 'experiment_result', icon: <FileOutlined /> },
];

const COUNT_CARD_BASE_HEIGHT = 114;

const CountCardPlaceholder = ({ loading }: { loading: boolean }) => {
  return (
    <Card className="shadow count-card" style={{ height: loading ? COUNT_CARD_BASE_HEIGHT : 'inherit' }}>
      {loading ? (
        <Skeleton active={true} paragraph={{ rows: 1 }} style={{ marginTop: 5 }} />
      ) : (
        <CustomEmpty text="No Data" />
      )}
    </Card>
  );
};

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
  const { filterQueryParams } = useSearchQuery();

  const uncensoredCounts = useCanSeeUncensoredCounts();
  const { countThreshold } = useConfig();

  const waitingForData = WAITING_STATES.includes(status);

  const { hasPermission: hasQueryData } = useScopeQueryData();

  const [selectedEntity, setSelectedEntity] = useState<BentoEntity | null>(null);

  const countElements = waitingForData
    ? []
    : COUNT_ENTRIES.filter(
        // hide counts if no filters applied and we have no data
        ({ entity }) => waitingForData || !!(counts[entity] || Object.keys(filterQueryParams).length)
      ).map(({ entity, icon }, i) => {
        const count = renderCount(counts[entity], countThreshold);
        const selected = selectedEntity === entity;
        const canSelect = hasQueryData && !selected;
        return (
          <Card
            key={i}
            aria-selected={hasQueryData ? selected : undefined}
            className={
              'shadow count-card' +
              (canSelect ? ' count-card-clickable' : '') +
              (selected ? ' count-card-selected' : '')
            }
            onClick={canSelect ? () => setSelectedEntity(entity) : undefined}
            style={{ height: COUNT_CARD_BASE_HEIGHT + (hasQueryData ? 12 : 0) + (selected ? 12 : 0) }}
          >
            <Statistic
              title={<CountsTitleWithHelp entity={entity} />}
              value={count || (uncensoredCounts ? count : NO_RESULTS_DASHES)}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={icon}
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
      });

  return (
    <Flex vertical={true} gap={12}>
      <Space size={12} wrap>
        {!waitingForData && countElements.length ? countElements : <CountCardPlaceholder loading={waitingForData} />}
      </Space>
      {countElements.length && selectedEntity ? (
        <Card className="shadow">
          <SearchResultsTablePage entity={selectedEntity} />
        </Card>
      ) : null}
    </Flex>
  );
};

export default Counts;
