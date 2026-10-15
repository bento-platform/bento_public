import type { CSSProperties } from 'react';
import { Flex, Skeleton, Space, Statistic } from 'antd';
import { ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import CountsTitleWithHelp from '@/components/Util/CountsTitleWithHelp';
import { COUNTS_FILL } from '@/constants/exploreConstants';
import { useTranslationFn } from '@/hooks';
import { useRenderCount } from '@/hooks/counts';
import type { DiscoveryResults, OptionalDiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';

const STAT_STYLE: CSSProperties = { color: COUNTS_FILL };

const SearchResultsCounts = ({
  mode,
  results,
  queryStatus,
  hasInsufficientData,
  message,
}: SearchResultsCountsProps) => {
  const t = useTranslationFn();
  const renderCount = useRenderCount();

  const { individualCount, biosampleCount, experimentCount } = results;

  const isBeaconNetwork = mode === 'beacon-network';

  return (
    <Space
      orientation={mode === 'normal' ? 'vertical' : 'horizontal'}
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
          <Statistic
            title={<CountsTitleWithHelp entity="individual" showHelp={!isBeaconNetwork} />}
            value={hasInsufficientData ? t(message ?? '') : renderCount(individualCount)}
            styles={{ content: STAT_STYLE }}
            prefix={<TeamOutlined aria-hidden />}
          />
          <Statistic
            title={<CountsTitleWithHelp entity="biosample" showHelp={!isBeaconNetwork} />}
            value={hasInsufficientData ? renderCount(undefined) : renderCount(biosampleCount)}
            styles={{ content: STAT_STYLE }}
            // Slight fixup for alignment of non-Antd icon:
            prefix={<BiDna aria-hidden className="align-top mt-6px" />}
          />
          <Statistic
            title={<CountsTitleWithHelp entity="experiment" showHelp={!isBeaconNetwork} />}
            value={hasInsufficientData ? renderCount(undefined) : renderCount(experimentCount)}
            styles={{ content: STAT_STYLE }}
            prefix={<ExperimentOutlined aria-hidden />}
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
  hasInsufficientData?: boolean;
  message?: string;
};

export default SearchResultsCounts;
