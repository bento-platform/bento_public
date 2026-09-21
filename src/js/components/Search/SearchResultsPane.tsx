import { type CSSProperties, type ReactElement, useCallback } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { PieChart } from 'bento-charts';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { CHART_SIZES } from '@/constants/exploreConstants';
import { useTranslationFn } from '@/hooks';
import type { DiscoveryResults } from '@/types/data';
import type { SearchResultsUIPage } from '@/features/search/types';

import CustomEmpty from '@/components/Util/CustomEmpty';
import SearchResultsCounts from './SearchResultsCounts';

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

  const pieChartProps = { height: CHART_SIZES.normal.pieChartHeight, sort: true, dataMap: translateMap };

  return (
    <>
      <Col xs={24} lg={10}>
        <Typography.Title level={5} className="text-center">
          {t('entities.biosample', T_PLURAL_COUNT)}
        </Typography.Title>
        {!hasInsufficientData && biosampleChartData.length ? (
          <PieChart data={biosampleChartData} {...pieChartProps} />
        ) : (
          <CustomEmpty text="No Results" />
        )}
      </Col>
      <Col xs={24} lg={10}>
        <Typography.Title level={5} className="text-center">
          {t('entities.experiment', T_PLURAL_COUNT)}
        </Typography.Title>
        {!hasInsufficientData && experimentChartData.length ? (
          <PieChart data={experimentChartData} {...pieChartProps} />
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
  style,
}: SearchResultsPaneProps) => {
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
              results={results}
              hasInsufficientData={hasInsufficientData}
              message={message}
            />
          </Col>
          <SRChartsPage hasInsufficientData={hasInsufficientData} results={results} />
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
  style?: CSSProperties;
}

export default SearchResultsPane;
