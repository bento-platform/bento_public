import { useMemo } from 'react';

import { Space, Spin, Tag } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

import SearchResultsPane from '@/components/Search/SearchResultsPane';
import { useBeaconNetwork } from '@/features/beacon/hooks';
import { useTranslationFn } from '@/hooks';

const NetworkSearchResults = () => {
  const t = useTranslationFn();

  const { hasBeaconNetworkError } = useBeaconNetwork();
  const { networkResults, beaconResponses } = useBeaconNetwork();
  const responseArray = useMemo(() => Object.values(beaconResponses), [beaconResponses]);
  const isFetchingAtLeastOneResponse = useMemo(
    () => responseArray.some((r) => r.isFetchingQueryResponse),
    [responseArray]
  );

  // filter() creates arrays we don't need, but the arrays are small
  // more readable than equivalent reduce() call
  const numNonErrorResponses = useMemo(
    () => responseArray.filter((r) => 'individualCount' in r.results).length,
    [responseArray]
  );
  const numNonZeroResponses = useMemo(
    () => responseArray.filter((r) => !!r.results.individualCount).length,
    [responseArray]
  );

  // show number of non-zero responses
  const numResultsText = (n: number) => {
    if (numNonErrorResponses) {
      return `${t('beacon.results_from')} ${n} beacon${n == 1 ? '' : 's'}`;
    }
    return '';
  };

  const noResponsesYet = numNonErrorResponses == 0 && !hasBeaconNetworkError;

  // results and optional error tag, for top-right "extra" section of results card
  // currently not possible to have both a network error and results, but this may change in the future
  const resultsExtra = (
    <Space>
      {hasBeaconNetworkError && <Tag color="red">{t('beacon.network_error')}</Tag>}
      {!noResponsesYet && isFetchingAtLeastOneResponse && (
        <Spin size="small" indicator={<Loading3QuartersOutlined spin={true} />} />
      )}
      {numResultsText(numNonZeroResponses)}
    </Space>
  );

  return (
    <SearchResultsPane
      isFetchingData={noResponsesYet}
      results={networkResults}
      resultsTitle={t('beacon.network_search_results')}
      resultsExtra={resultsExtra}
    />
  );
};

export default NetworkSearchResults;
