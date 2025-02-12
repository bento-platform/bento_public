import { type ReactElement, useCallback, useMemo, useState } from 'react';
import { Card, Col, Row, Typography, Table, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { PieChart } from 'bento-charts';

import { PORTAL_URL } from '@/config';
import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { BOX_SHADOW, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationFn } from '@/hooks';
import type { DiscoveryResults } from '@/types/data';
import type { SearchResultsUIPane } from '@/types/search';

import CustomEmpty from '../Util/CustomEmpty';
import SearchResultsCounts from './SearchResultsCounts';

type IndividualResultRow = { id: string };

const SearchResultsPane = ({
  isFetchingData,
  hasInsufficientData,
  uncensoredCounts,
  message,
  results,
  resultsTitle,
  resultsExtra,
}: SearchResultsPaneProps) => {
  const t = useTranslationFn();
  const translateMap = useCallback(({ x, y }: { x: string; y: number }) => ({ x: t(x), y }), [t]);

  const [panePage, setPanePage] = useState<SearchResultsUIPane>('charts');

  const { individualMatches, biosampleChartData, experimentChartData } = results;

  const individualTableColumns = useMemo(
    () => [
      {
        dataIndex: 'id',
        title: t('entities.individual', T_SINGULAR_COUNT),
        render: (id: string) => (
          <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
            {id}
          </a>
        ),
      },
    ],
    [t]
  );
  const individualTableData = useMemo<IndividualResultRow[]>(
    () => (individualMatches ?? []).map((id) => ({ id })),
    [individualMatches]
  );

  return (
    <div className="container margin-auto search-results-pane">
      <Card
        style={{
          borderRadius: '10px',
          width: '100%',
          // Set a minimum height (i.e., an expected final height, which can be exceeded) to prevent this component from
          // suddenly increasing in height after it loads. This is calculated from the sum of the following parts:
          //   chart (300)
          // + heading (24 + 8 [0.5em] bottom margin)
          // + card body padding (2*24 = 48)
          // + border (2*1 = 2)
          // = 382, or + 56 = 438 if any header content present
          minHeight: resultsTitle || resultsExtra ? '438px' : '382px',
          ...BOX_SHADOW,
        }}
        styles={{ body: { padding: '24px 40px' } }}
        loading={isFetchingData}
        title={resultsTitle}
        extra={resultsExtra}
      >
        <Row gutter={16}>
          <Col xs={24} lg={4}>
            <SearchResultsCounts
              mode="normal"
              selectedPane={panePage}
              setSelectedPane={(p) => setPanePage(p)}
              results={results}
              hasInsufficientData={hasInsufficientData}
              uncensoredCounts={uncensoredCounts}
              message={message}
            />
          </Col>
          {panePage === 'charts' ? (
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
          ) : (
            <Col xs={24} lg={20}>
              <Button
                icon={<LeftOutlined />}
                type="link"
                onClick={() => setPanePage('charts')}
                style={{ paddingLeft: 0 }}
              >
                {t('Charts')}
              </Button>
              <Table<IndividualResultRow>
                columns={individualTableColumns}
                dataSource={individualTableData}
                rowKey="id"
                bordered={true}
                size="small"
              />
            </Col>
          )}
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
}

export default SearchResultsPane;
