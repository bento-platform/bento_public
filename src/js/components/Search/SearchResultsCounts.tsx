import type { CSSProperties } from 'react';
import { Skeleton, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import { COUNTS_FILL } from '@/constants/overviewConstants';
import { NO_RESULTS_DASHES } from '@/constants/searchConstants';
import ExpSvg from '@/components/Util/ExpSvg';
import { useTranslationDefault } from '@/hooks';
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
  message,
  showZeroIndividualsAsDashes,
}: SearchResultsCountsProps) => {
  const td = useTranslationDefault();

  const { individualMatches } = results;
  const individualsClickable = !!setSelectedPane && individualMatches?.length;

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
      {mode === 'beacon-network' && isFetchingQueryResponse ? (
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
              title={td('Individuals')}
              value={
                hasInsufficientData
                  ? td(message ?? '')
                  : results.individualCount || (showZeroIndividualsAsDashes ? NO_RESULTS_DASHES : 0)
              }
              valueStyle={STAT_STYLE}
              prefix={<TeamOutlined />}
            />
          </div>
          <Statistic
            title={td('Biosamples')}
            value={hasInsufficientData ? NO_RESULTS_DASHES : results.biosampleCount}
            valueStyle={STAT_STYLE}
            prefix={<BiDna />}
          />
          <Statistic
            title={td('Experiments')}
            value={hasInsufficientData ? NO_RESULTS_DASHES : results.experimentCount}
            valueStyle={STAT_STYLE}
            prefix={<ExpSvg />}
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
  message?: string;
  showZeroIndividualsAsDashes?: boolean;
};

export default SearchResultsCounts;
