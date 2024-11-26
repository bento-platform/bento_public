import type { CSSProperties } from 'react';
import { Skeleton, Space, Statistic } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { NO_RESULTS_DASHES } from '@/constants/searchConstants';
import { useTranslationFn } from '@/hooks';
import type { DiscoveryResults, OptionalDiscoveryResults } from '@/types/data';
import type { SearchResultsUIPane } from '@/types/search';

const STAT_STYLE: CSSProperties = { color: COUNTS_FILL };

const SearchResultsCounts = ({
  mode,
  results,
  isFetchingQueryResponse,
  selectedPane,
  setSelectedPane,
  hasInsufficientData,
  uncensoredCounts,
  message,
}: SearchResultsCountsProps) => {
  const t = useTranslationFn();

  const { individualCount, individualMatches, biosampleCount, experimentCount } = results;
  const individualsClickable = !!setSelectedPane && individualMatches?.length;

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
      {isBeaconNetwork && isFetchingQueryResponse ? (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '6px 0' }}>
          <Skeleton.Input size="small" style={{ width: '330px', height: '20px' }} active />
          <Skeleton.Input size="small" style={{ marginTop: '10px', width: '330px', height: '20px' }} active />
        </div>
      ) : (
        <>
          <div
            onClick={individualsClickable ? () => setSelectedPane('individuals') : undefined}
            className={[
              'search-result-statistic',
              ...(selectedPane === 'individuals' ? ['selected'] : []),
              ...(individualsClickable ? ['enabled'] : []),
            ].join(' ')}
          >
            <Statistic
              title={<CountsTitleWithHelp entity="individual" />}
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
            title={<CountsTitleWithHelp entity="biosample" />}
            value={hasInsufficientData || (!uncensoredCounts && !biosampleCount) ? NO_RESULTS_DASHES : biosampleCount}
            valueStyle={STAT_STYLE}
            // Slight fixup for alignment of non-Antd icon:
            prefix={<BiDna style={{ marginTop: 6, verticalAlign: 'top' }} />}
          />
          <Statistic
            title={<CountsTitleWithHelp entity="experiment" />}
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
  isFetchingQueryResponse?: boolean;
  selectedPane?: SearchResultsUIPane;
  setSelectedPane?: (pane: SearchResultsUIPane) => void;
  hasInsufficientData?: boolean;
  uncensoredCounts?: boolean;
  message?: string;
};

export default SearchResultsCounts;
