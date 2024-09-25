import { useCallback } from 'react';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { PieChart } from 'bento-charts';
import CustomEmpty from '../Util/CustomEmpty';
import ExpSvg from '../Util/ExpSvg';
import { BOX_SHADOW, COUNTS_FILL, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { useTranslationDefault, useTranslationCustom } from '@/hooks';
import type { ChartData } from '@/types/data';

const SearchResultsPane = ({
  isFetchingData,
  hasInsufficientData,
  message,
  individualCount,
  biosampleCount,
  biosampleChartData,
  experimentCount,
  experimentChartData,
}: SearchResultsPaneProps) => {
  const td = useTranslationDefault();
  const t = useTranslationCustom();
  const translateMap = useCallback(({ x, y }: { x: string; y: number }) => ({ x: t(x), y }), [t]);

  return (
    <div style={{ paddingBottom: 8, display: 'flex', justifyContent: 'center', width: '100%' }}>
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
              <Statistic
                title={td('Individuals')}
                value={hasInsufficientData ? td(message) : individualCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title={td('Biosamples')}
                value={hasInsufficientData ? '----' : biosampleCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<BiDna />}
              />
              <Statistic
                title={td('Experiments')}
                value={hasInsufficientData ? '----' : experimentCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<ExpSvg />}
              />
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              {td('Biosamples')}
            </Typography.Title>
            {!hasInsufficientData && biosampleChartData.length ? (
              <PieChart data={biosampleChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
          <Col xs={24} lg={10}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              {td('Experiments')}
            </Typography.Title>
            {!hasInsufficientData && experimentChartData.length ? (
              <PieChart data={experimentChartData} height={PIE_CHART_HEIGHT} sort={true} dataMap={translateMap} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
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
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
}

export default SearchResultsPane;
