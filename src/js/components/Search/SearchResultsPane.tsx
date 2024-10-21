import { useCallback, useMemo, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Space, Table, Button } from 'antd';
import { LeftOutlined, TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { PieChart } from 'bento-charts';

import CustomEmpty from '../Util/CustomEmpty';
import ExpSvg from '../Util/ExpSvg';

import { PORTAL_URL } from '@/config';
import { BOX_SHADOW, COUNTS_FILL, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationDefault, useTranslationCustom } from '@/hooks';
import type { ChartData } from '@/types/data';

type IndividualResultRow = { id: string };

const SearchResultsPane = ({
  isFetchingData,
  hasInsufficientData,
  message,
  individualCount,
  individualMatches,
  biosampleCount,
  biosampleChartData,
  experimentCount,
  experimentChartData,
}: SearchResultsPaneProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const translateMap = useCallback(({ x, y }: { x: string; y: number }) => ({ x: t(x), y }), [t]);

  const [panePage, setPanePage] = useState<'charts' | 'individuals'>('charts');

  const individualTableColumns = useMemo(
    () => [
      {
        dataIndex: 'id',
        title: td('entities.Individual'),
        render: (id: string) => (
          <a href={`${PORTAL_URL}/data/explorer/individuals/${id}`} target="_blank" rel="noreferrer">
            {id}
          </a>
        ),
      },
    ],
    [td]
  );
  const individualTableData = useMemo<IndividualResultRow[]>(
    () => (individualMatches ?? []).map((id) => ({ id })),
    [individualMatches]
  );

  return (
    <div className="search-results-pane">
      <Card
        style={{
          borderRadius: '10px',
          padding: '10px 33px',
          maxWidth: '1200px',
          width: '100%',
          // Set a minimum height (i.e., an expected final height, which can be exceeded) to prevent this component from
          // suddenly increasing in height after it loads. This is calculated from the sum of the following parts:
          //   chart (300)
          // + heading (24 + 8 [0.5em] bottom margin)
          // + card body padding (2*24 = 48)
          // + card wrapper padding (2*10 = 20)
          // + border (2*1 = 2)
          // = 402:
          minHeight: '402px',
          ...BOX_SHADOW,
        }}
        loading={isFetchingData}
      >
        <Row gutter={16}>
          <Col xs={24} lg={4}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <div
                onClick={individualMatches?.length ? () => setPanePage('individuals') : undefined}
                className={[
                  'search-result-statistic',
                  ...(panePage === 'individuals' ? ['selected'] : []),
                  ...(individualMatches?.length ? ['enabled'] : []),
                ].join(' ')}
              >
                <Statistic
                  title={td('entities.Individuals')}
                  value={hasInsufficientData ? td(message) : individualCount}
                  valueStyle={{ color: COUNTS_FILL }}
                  prefix={<TeamOutlined />}
                />
              </div>
              <Statistic
                title={td('entities.Biosamples')}
                value={hasInsufficientData ? '----' : biosampleCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<BiDna />}
              />
              <Statistic
                title={td('entities.Experiments')}
                value={hasInsufficientData ? '----' : experimentCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<ExpSvg />}
              />
            </Space>
          </Col>
          {panePage === 'charts' ? (
            <>
              <Col xs={24} lg={10}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>
                  {td('entities.Biosamples')}
                </Typography.Title>
                {!hasInsufficientData && biosampleChartData.length ? (
                  <PieChart data={biosampleChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
                ) : (
                  <CustomEmpty text="No Results" />
                )}
              </Col>
              <Col xs={24} lg={10}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>
                  {td('entities.Experiments')}
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
              <Button icon={<LeftOutlined />} type="link" onClick={() => setPanePage('charts')}>
                {td('Charts')}
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
  hasInsufficientData: boolean;
  message: string;
  individualCount: number;
  individualMatches?: string[];
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
}

export default SearchResultsPane;
