import { type CSSProperties, type ReactElement, useCallback, useEffect } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { queryData } from 'bento-auth-js';
import { PieChart } from 'bento-charts';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useHasScopePermission, useTranslationFn } from '@/hooks';
import type { DiscoveryResults } from '@/types/data';
import type { SearchResultsUIPane } from '@/features/search/types';

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
        <Typography.Title level={5} style={{ marginTop: 0, textAlign: 'center' }}>
          {t('entities.biosample', T_PLURAL_COUNT)}
        </Typography.Title>
        {!hasInsufficientData && biosampleChartData.length ? (
          <PieChart data={biosampleChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
        ) : (
          <CustomEmpty text="No Results" />
        )}
      </Col>
      <Col xs={24} lg={10}>
        <Typography.Title level={5} style={{ marginTop: 0, textAlign: 'center' }}>
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
  uncensoredCounts,
  message,
  results,
  resultsTitle,
  resultsExtra,
  pane,
  onPaneChange,
  style,
}: SearchResultsPaneProps) => {
  pane = pane ?? 'charts';
  onPaneChange = onPaneChange ?? (() => {});

  const { hasAttempted: hasAttemptedQDP, hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  useEffect(() => {
    if (pane === 'individuals' && hasAttemptedQDP && !queryDataPerm) {
      onPaneChange('charts');
    }
  }, [pane, onPaneChange, hasAttemptedQDP, queryDataPerm]);

  let pageElement = <div />;
  if (pane === 'charts') {
    pageElement = <SRChartsPage hasInsufficientData={hasInsufficientData} results={results} />;
  } else if (pane === 'individuals') {
    pageElement = (
      <SearchResultsTablePage entity="individual" results={results} onBack={() => onPaneChange('charts')} />
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
              selectedPane={pane}
              setSelectedPane={onPaneChange}
              results={results}
              hasInsufficientData={hasInsufficientData}
              uncensoredCounts={uncensoredCounts}
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
  uncensoredCounts?: boolean;
  message?: string;
  results: DiscoveryResults;
  resultsTitle?: string;
  resultsExtra?: ReactElement;
  pane?: SearchResultsUIPane;
  onPaneChange?: (pane: SearchResultsUIPane) => void;
  style?: CSSProperties;
}

export default SearchResultsPane;
