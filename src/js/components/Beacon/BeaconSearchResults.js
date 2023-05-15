import React from 'react';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import { PieChart } from 'bento-charts';
import CustomEmpty from '../Util/CustomEmpty';
import ExpSvg from '../Util/ExpSvg';

import { CHART_HEIGHT, COUNTS_FILL } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import { serializeChartData } from '@/utils/chart';

const BeaconSearchResults = () => {
  const t = useTranslationDefault();

  const { response, isFetchingQueryResponse } = useAppSelector((state) => state.beaconQuery);
  const individualCount = useAppSelector((state) => state.beaconQuery?.response?.responseSummary?.count);
  
  const { info } = response;

  const biosamples = info?.bento?.biosamples ?? {};
  const biosampleCount = biosamples.count;
  const biosampleChartData = serializeChartData(biosamples.sampled_tissue ?? []);

  const experiments = info?.bento?.experiments ?? {};
  const experimentCount = experiments.count ?? 0;
  const experimentChartData = serializeChartData(experiments?.experiment_type ?? []);

  // shown when count = 0
  const message = 'Insufficient data available.';

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '475px',
  };

  return (
    <div style={wrapperStyle}>
      <Card
        style={{ borderRadius: '10px', padding: '10px 33px', width: '1200px', minHeight: '28rem' }}
        loading={isFetchingQueryResponse}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Statistic
                title={t('Individuals')}
                value={individualCount ? individualCount : t(message)}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title={t('Biosamples')}
                value={individualCount ? biosampleCount : '----' }
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<BiDna />}
              />
              <Statistic
                title={t('Experiments')}
                value={individualCount ? experimentCount : '----' }
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<ExpSvg />}
              />
            </Space>
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Biosamples')}</Typography.Title>
            {biosampleChartData.length ? (
              <PieChart data={biosampleChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Experiments')}</Typography.Title>
            {experimentChartData.length ? (
              <PieChart data={experimentChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BeaconSearchResults;
