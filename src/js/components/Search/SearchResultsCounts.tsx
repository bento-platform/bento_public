import type { CSSProperties } from 'react';
import { Flex, Skeleton, Space, Statistic } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { queryData } from 'bento-auth-js';

import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useHasScopePermission, useTranslationFn } from '@/hooks';
import type { SearchResultsUIPage } from '@/features/search/types';
import type { DiscoveryResults, OptionalDiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';

const STAT_STYLE: CSSProperties = { color: COUNTS_FILL };

const SearchResultsCounts = ({
  mode,
  results,
  queryStatus,
  selectedPage,
  setSelectedPage,
  hasInsufficientData,
  uncensoredCounts,
  message,
}: SearchResultsCountsProps) => {
  const t = useTranslationFn();

  const { individualCount, biosampleCount, experimentCount } = results;
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const individualsClickable = !!setSelectedPage && queryDataPerm;

  const isBeaconNetwork = mode === 'beacon-network';

  return (
    <Space
      direction={mode === 'normal' ? 'vertical' : 'horizontal'}
      size="middle"
      style={{
        display: 'flex',
        ...(mode === 'beacon-network'
          ? {
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }
          : {}),
      }}
    >
      {isBeaconNetwork && queryStatus === RequestStatus.Pending ? (
        <Flex vertical={true} style={{ margin: '6px 0' }}>
          <Skeleton.Input size="small" style={{ width: '330px', height: '20px' }} active />
          <Skeleton.Input size="small" style={{ marginTop: '10px', width: '330px', height: '20px' }} active />
        </Flex>
      ) : (
        <>
          <div
            onClick={individualsClickable ? () => setSelectedPage('individuals') : undefined}
            className={[
              'search-result-statistic',
              ...(selectedPage === 'individuals' ? ['selected'] : []),
              ...(individualsClickable ? ['enabled'] : []),
            ].join(' ')}
          >
            <Statistic
              title={<CountsTitleWithHelp entity="individual" showHelp={!isBeaconNetwork} />}
              value={
                hasInsufficientData
                  ? t(message ?? '')
                  : !uncensoredCounts && !individualCount
                    ? NO_RESULTS_DASHES
                    : individualCount
              }
              valueStyle={STAT_STYLE}
              prefix={<TeamOutlined />}
            />
          </div>
          <Statistic
            title={<CountsTitleWithHelp entity="biosample" showHelp={!isBeaconNetwork} />}
            value={hasInsufficientData || (!uncensoredCounts && !biosampleCount) ? NO_RESULTS_DASHES : biosampleCount}
            valueStyle={STAT_STYLE}
            // Slight fixup for alignment of non-Antd icon:
            prefix={<BiDna style={{ marginTop: 6, verticalAlign: 'top' }} />}
          />
          <Statistic
            title={<CountsTitleWithHelp entity="experiment" showHelp={!isBeaconNetwork} />}
            value={hasInsufficientData || (!uncensoredCounts && !experimentCount) ? NO_RESULTS_DASHES : experimentCount}
            valueStyle={STAT_STYLE}
            prefix={<ExperimentOutlined />}
          />
        </>
      )}
    </Space>
  );
};

type SearchResultsCountsProps = {
  // Not just vertical/horizontal; beacon-network mode has different loading behaviour currently.
  // Perhaps this styling will be more unified in the future.
  mode: 'normal' | 'beacon-network';
  results: DiscoveryResults | OptionalDiscoveryResults;
  queryStatus?: RequestStatus;
  selectedPage?: SearchResultsUIPage;
  setSelectedPage?: (page: SearchResultsUIPage) => void;
  hasInsufficientData?: boolean;
  uncensoredCounts?: boolean;
  message?: string;
};

export default SearchResultsCounts;
