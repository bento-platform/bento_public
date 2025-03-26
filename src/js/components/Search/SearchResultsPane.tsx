import { type CSSProperties, type ReactElement, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
  Table,
  type TableColumnsType,
  type TablePaginationConfig,
  type TableProps,
  Typography,
} from 'antd';
import { ExportOutlined, LeftOutlined } from '@ant-design/icons';
import { PieChart } from 'bento-charts';

import { PORTAL_URL } from '@/config';
import { T_PLURAL_COUNT, T_SINGULAR_COUNT } from '@/constants/i18n';
import { BOX_SHADOW, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';
import type { DiscoveryResults } from '@/types/data';
import type { SearchResultsUIPane } from '@/features/search/types';

import CustomEmpty from '@/components/Util/CustomEmpty';
import SearchResultsCounts from './SearchResultsCounts';
import IndividualRowDetail from './IndividualRowDetail';

type IndividualResultRow = { id: string };

const IndividualPortalLink = ({ id }: IndividualResultRow) => (
  <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
    <ExportOutlined />
  </a>
);

const INDIVIDUAL_EXPANDABLE: TableProps<IndividualResultRow>['expandable'] = {
  expandedRowRender: (rec) => <IndividualRowDetail id={rec.id} />,
};

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

const SRIndividualsPage = ({ onBack, results }: { onBack: () => void; results: DiscoveryResults }) => {
  const t = useTranslationFn();

  const selectedScope = useSelectedScope();

  const individualTableColumns = useMemo<TableColumnsType<IndividualResultRow>>(
    () => [
      { dataIndex: 'id', title: 'ID' },
      // TODO: implement these when we have this information in search results:
      ...(!selectedScope.scope.project ? [{ title: t('entities.project', T_SINGULAR_COUNT), key: 'project' }] : []),
      ...(!selectedScope.scope.dataset ? [{ title: t('entities.dataset', T_SINGULAR_COUNT), key: 'dataset' }] : []),
      {
        title: '',
        key: 'actions',
        width: 32,
        render: ({ id }) => <IndividualPortalLink id={id} />,
      },
    ],
    [t, selectedScope]
  );

  const { individualMatches } = results;
  const individualTableData = useMemo<IndividualResultRow[]>(
    () => (individualMatches ?? []).map((id) => ({ id })),
    [individualMatches]
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // noinspection JSUnusedGlobalSymbols
  const individualPagination = useMemo<TablePaginationConfig>(
    () => ({
      current: page,
      pageSize,
      align: 'end',
      size: 'default',
      showSizeChanger: true,
      onChange(page, pageSize) {
        setPage(page);
        setPageSize(pageSize);
      },
    }),
    [page, pageSize]
  );

  const currentStart = individualTableData.length > 0 ? page * pageSize - pageSize + 1 : 0;
  const currentEnd = Math.min(page * pageSize, individualTableData.length);

  return (
    <Col xs={24} lg={20}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Button icon={<LeftOutlined />} type="link" onClick={onBack} style={{ paddingLeft: 0 }}>
          {t('Charts')}
        </Button>
        <span>
          {t('search.showing_individuals', { start: currentStart, end: currentEnd, total: individualTableData.length })}
        </span>
        {/* TODO: only if in Bento search not beacon */}
        <Button icon={<ExportOutlined />} onChange={() => alert('TODO')}>
          {t('search.export_csv')}
        </Button>
      </Flex>
      <Table<IndividualResultRow>
        columns={individualTableColumns}
        dataSource={individualTableData}
        rowKey="id"
        bordered={true}
        size="small"
        pagination={individualPagination}
        expandable={INDIVIDUAL_EXPANDABLE}
      />
    </Col>
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
  style,
}: SearchResultsPaneProps) => {
  const [panePage, setPanePage] = useState<SearchResultsUIPane>('charts');

  let pageElement = <div />;
  if (panePage === 'charts') {
    pageElement = <SRChartsPage hasInsufficientData={hasInsufficientData} results={results} />;
  } else if (panePage === 'individuals') {
    pageElement = <SRIndividualsPage onBack={() => setPanePage('charts')} results={results} />;
  }

  return (
    <div className="container margin-auto search-results-pane" style={style}>
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
  style?: CSSProperties;
}

export default SearchResultsPane;
