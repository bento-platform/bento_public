import { type CSSProperties, type ReactElement, useCallback, useEffect } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { PieChart } from 'bento-charts';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import type { DiscoveryResults } from '@/types/data';
import type { SearchResultsUIPage } from '@/features/search/types';

import CustomEmpty from '@/components/Util/CustomEmpty';
import SearchResultsCounts from './SearchResultsCounts';
import SearchResultsTablePage from '@/components/Search/SearchResultsTablePage';

const SRChartsPage = ({
  hasInsufficientData,
  results,
}: {
  hasInsufficientData?: boolean;
  results: DiscoveryResults;
}) => {
  const t = useTranslationFn();
  const translateMap = useCallback(({ x, y }: { x: string; y: number }) => ({ x: t(x), y }), [t]);

  const { biosampleChartData, experimentChartData } = results;

  return (
    <>
      <Col xs={24} lg={10}>
        <Typography.Title level={5} className="text-center">
          {t('entities.biosample', T_PLURAL_COUNT)}
        </Typography.Title>
        {!hasInsufficientData && biosampleChartData.length ? (
          <PieChart data={biosampleChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
        ) : (
          <CustomEmpty text="No Results" />
        )}
      </Col>
      <Col xs={24} lg={10}>
        <Typography.Title level={5} className="text-center">
          {t('entities.experiment', T_PLURAL_COUNT)}
        </Typography.Title>
        {!hasInsufficientData && experimentChartData.length ? (
          <PieChart data={experimentChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
        ) : (
          <CustomEmpty text="No Results" />
        )}
      </Col>
    </>
  );
};

const SearchResultsPane = ({
  isFetchingData,
  hasInsufficientData,
  message,
  results,
  resultsTitle,
  resultsExtra,
  page,
  onPageChange,
  style,
}: SearchResultsPaneProps) => {
  page = page ?? 'charts';
  onPageChange = onPageChange ?? (() => {});

  const { hasAttempted: hasAttemptedQDP, hasPermission: queryDataPerm } = useScopeQueryData();
  useEffect(() => {
    if (page === 'individuals' && hasAttemptedQDP && !queryDataPerm) {
      onPageChange('charts');
    }
  }, [page, onPageChange, hasAttemptedQDP, queryDataPerm]);

  let pageElement = <div />;
  if (page === 'charts') {
    pageElement = <SRChartsPage hasInsufficientData={hasInsufficientData} results={results} />;
  } else if (page === 'individuals') {
    pageElement = (
      <SearchResultsTablePage entity="individual" results={results} onBack={() => onPageChange('charts')} />
    );
  }

  return (
    <div className="container margin-auto search-results-pane" style={style}>
      <Card
        className="w-full shadow rounded-xl"
        style={{
          // Set a minimum height (i.e., an expected final height, which can be exceeded) to prevent this component from
          // suddenly increasing in height after it loads. This is calculated from the sum of the following parts:
          //   chart (300)
          // + heading (24 + 8 [0.5em] bottom margin)
          // + card body padding (2*24 = 48)
          // + border (2*1 = 2)
          // = 382, or + 56 = 438 if any header content present
          minHeight: resultsTitle || resultsExtra ? '438px' : '382px',
        }}
        styles={{ body: { padding: '24px 40px' } }}
        loading={isFetchingData}
        title={resultsTitle}
        extra={resultsExtra}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={4}>
            <SearchResultsCounts
              mode="normal"
              selectedPage={page}
              setSelectedPage={onPageChange}
              results={results}
              hasInsufficientData={hasInsufficientData}
              message={message}
            />
          </Col>
          {pageElement}
        </Row>
      </Card>
    </div>
  );
};

export interface SearchResultsPaneProps {
  isFetchingData: boolean;
  hasInsufficientData?: boolean;
  message?: string;
  results: DiscoveryResults;
  resultsTitle?: string;
  resultsExtra?: ReactElement;
  page?: SearchResultsUIPage;
  onPageChange?: (page: SearchResultsUIPage) => void;
  style?: CSSProperties;
}

export default SearchResultsPane;
