import { useState, memo, useCallback } from 'react';
import { Alert, Card, Flex, Skeleton, Space, Statistic } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';
import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import CustomEmpty from '@/components/Util/CustomEmpty';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { useCanSeeUncensoredCounts, useScopeQueryData } from '@/hooks/censorship';
import type { BentoCountEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';

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

const CountCardShowHide = memo(({ selected, onClear }: { selected: boolean; onClear: () => void }) => {
  const t = useTranslationFn();

  return (
    <div
      className="count-card__show-hide cursor-pointer antd-gray-7"
      style={{
        backgroundColor: selected ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.0)',
        bottom: selected ? -8 : 0,
      }}
      onClick={selected ? onClear : undefined}
    >
      <DownOutlined
        style={{
          transform: `rotate(${selected ? '180deg' : '0deg'})`,
          transition: 'transform 0.15s ease-in-out',
        }}
      />{' '}
      {t(selected ? 'HIDE' : 'SHOW')}
    </div>
  );
});
CountCardShowHide.displayName = 'CountCardShowHide';

const renderCount = (count: number | boolean | undefined, threshold: number): number | string =>
  count === undefined
    ? NO_RESULTS_DASHES
    : typeof count === 'boolean'
      ? count
        ? `>${threshold}`
        : NO_RESULTS_DASHES
      : count;

const CountsAndResults = () => {
  const t = useTranslationFn();

  const {
    message,
    resultCountsOrBools: counts,
    discoveryStatus,
    filterQueryParams,
    textQuery,
    doneFirstLoad,
    uiHints,
  } = useSearchQuery();

  const uncensoredCounts = useCanSeeUncensoredCounts();
  const { countThreshold } = useConfig();

  const waitingForData = WAITING_STATES.includes(discoveryStatus);
  const doingFirstLoad = waitingForData && !doneFirstLoad;

  // TODO: per-data type permissions?
  const { hasPermission: hasQueryData } = useScopeQueryData();

  const [selectedEntity, setSelectedEntity] = useState<BentoCountEntity | null>(null);
  const clearSelectedEntity = useCallback(() => setSelectedEntity(null), []);

  const nFilters = Object.keys(filterQueryParams).length + +!!textQuery;

  const countElements = doingFirstLoad
    ? []
    : COUNT_ENTITY_ORDER.filter((entity) => {
        // hide counts if no filters applied and we have no data
        if (uiHints.status === RequestStatus.Fulfilled && !uiHints.data.entities_with_data.includes(entity)) {
          // If we have a UI hint indicating that we have none of this entity in the scope at all, don't bother even
          // showing a loading card for the count.
          return false;
        }
        return waitingForData || !!(counts[entity] || nFilters);
      }).map((entity, i) => {
        const { icon } = COUNT_ENTITY_REGISTRY[entity];
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
              loading={waitingForData}
            />
            {hasQueryData && <CountCardShowHide selected={selected} onClear={clearSelectedEntity} />}
          </Card>
        );
      });

  return (
    <Flex vertical={true} gap={12}>
      {message ? <Alert message={t(message)} type="info" showIcon={true} style={{ fontSize: '1.1rem' }} /> : null}
      <Space size={12} wrap>
        {countElements.length ? countElements : <CountCardPlaceholder loading={doingFirstLoad} />}
      </Space>
      {countElements.length && selectedEntity ? (
        <Card className="shadow">
          <SearchResultsTablePage entity={selectedEntity} />
        </Card>
      ) : null}
    </Flex>
  );
};

export default CountsAndResults;
