import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Card, Flex, Skeleton, Space, Statistic } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';
import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import CustomEmpty from '@/components/Util/CustomEmpty';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { WAITING_STATES } from '@/constants/requests';
import { ENTITY_QUERY_PARAM, TABLE_PAGE_QUERY_PARAM, TABLE_PAGE_SIZE_QUERY_PARAM } from '@/features/search/constants';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';
import { useEntityAndTextQueryParams, useSearchQuery } from '@/features/search/hooks';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useRenderCount } from '@/hooks/counts';
import { useInnerWidth } from '@/hooks/useResponsiveContext';

import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';

import type { BentoCountEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
import {
  bentoKatsuEntityToResultsDataEntity,
  buildQueryParamsUrl,
  combineQueryParamsWithoutKey,
} from '@/features/search/utils';

const COUNT_CARD_BASE_HEIGHT = 114;
const COUNT_CARD_DENOMINATOR_BREAKPOINT = 1180;

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

const CountsAndResults = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const t = useTranslationFn();
  const renderCount = useRenderCount();

  const dispatch = useAppDispatch();

  const windowInnerWidth = useInnerWidth();

  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  const entityCounts = selectedDataset?.counts ?? selectedProject?.counts;

  const {
    message,
    resultCountsOrBools: counts,
    discoveryStatus,
    filterQueryParams,
    textQuery,
    selectedEntity,
    doneFirstLoad,
    matchData,
    pageSize,
    uiHints,
  } = useSearchQuery();
  const entityAndTextQueryParams = useEntityAndTextQueryParams();

  const waitingForData = WAITING_STATES.includes(discoveryStatus);
  const doingFirstLoad = waitingForData && !doneFirstLoad;

  // TODO: per-data type permissions?
  const { hasPermission: hasQueryData } = useScopeQueryData();

  const setSelectedEntity = useCallback(
    (entity: BentoCountEntity | null) => {
      const combinedParams = combineQueryParamsWithoutKey(filterQueryParams, entityAndTextQueryParams, [
        ENTITY_QUERY_PARAM,
        TABLE_PAGE_QUERY_PARAM,
        ...(entity ? [] : [TABLE_PAGE_SIZE_QUERY_PARAM]), // Clear the page size param if closing the table
      ]);
      // Set the selected entity and reset the pagination via URL parameters
      navigate(
        buildQueryParamsUrl(
          pathname,
          entity
            ? {
                ...combinedParams,
                [ENTITY_QUERY_PARAM]: entity,
                [TABLE_PAGE_QUERY_PARAM]: matchData[bentoKatsuEntityToResultsDataEntity(entity)].page.toString(),
                [TABLE_PAGE_SIZE_QUERY_PARAM]: pageSize.toString(),
              }
            : combinedParams
        )
      );
    },
    [navigate, pathname, filterQueryParams, entityAndTextQueryParams, matchData, pageSize]
  );
  const clearSelectedEntity = useCallback(() => setSelectedEntity(null), [setSelectedEntity]);

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
        const count = renderCount(counts[entity]);
        const selected = selectedEntity === entity;
        const canSelect = hasQueryData && !selected;
        const showDenominator = !!nFilters && !!entityCounts && windowInnerWidth >= COUNT_CARD_DENOMINATOR_BREAKPOINT;
        return (
          <Card
            key={i}
            aria-selected={hasQueryData ? selected : undefined}
            className={
              'shadow count-card' +
              (canSelect ? ' count-card-clickable' : '') +
              (selected ? ' count-card-selected' : '')
            }
            onMouseOver={
              canSelect
                ? () => {
                    // If the user hovers over the count card, start a pre-fetch to improve responsivity from the user's
                    // perspective if they decide to click on it.
                    const md = matchData[bentoKatsuEntityToResultsDataEntity(entity)];
                    if (md.status === RequestStatus.Idle || md.invalid) {
                      dispatch(fetchDiscoveryMatches(entity));
                    }
                  }
                : undefined
            }
            onClick={canSelect ? () => setSelectedEntity(entity) : undefined}
            style={{ height: COUNT_CARD_BASE_HEIGHT + (hasQueryData ? 12 : 0) + (selected ? 12 : 0) }}
          >
            <Statistic
              title={<CountsTitleWithHelp entity={entity} />}
              value={count}
              valueStyle={{ color: COUNTS_FILL }}
              suffix={
                showDenominator ? (
                  <span className="text-base antd-gray-7">/ {entityCounts[entity].toLocaleString()}</span>
                ) : undefined
              }
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
      {/* Can only wrap if we don't have the card show/hide button: */}
      <Space size={12} wrap={!hasQueryData}>
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
