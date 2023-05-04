import React from 'react';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

import { PieChart } from 'bento-charts';
import CustomEmpty from '../Util/CustomEmpty';
import ExpSvg from '../Util/ExpSvg';

import { CHART_HEIGHT, COUNTS_FILL } from '@/constants/overviewConstants';
import { useAppSelector, useTranslationDefault } from '@/hooks';

const SearchResults = () => {
  const t = useTranslationDefault();

  const isFetchingData = useAppSelector((state) => state.query.isFetchingData);

  const biosampleCount = useAppSelector((state) => state.query.biosampleCount);
  const biosampleChartData = useAppSelector((state) => state.query.biosampleChartData);

  const experimentCount = useAppSelector((state) => state.query.experimentCount);
  const experimentChartData = useAppSelector((state) => state.query.experimentChartData);

  const individualCount = useAppSelector((state) => state.query.individualCount);
  const message = useAppSelector((state) => state.query.message);

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '475px',
  };

  return (
    <div style={wrapperStyle}>
      <Card
        style={{ borderRadius: '10px', padding: '10px 33px', width: '1200px', minHeight: '28rem' }}
        loading={isFetchingData}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Statistic
                title={t('Individuals')}
                value={message ? t(message) : individualCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title={t('Biosamples')}
                value={message ? '----' : biosampleCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<BiDna />}
              />
              <Statistic
                title={t('Experiments')}
                value={message ? '----' : experimentCount}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<ExpSvg />}
              />
            </Space>
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Biosamples')}</Typography.Title>
            {(!message && biosampleChartData.length) ? (
              <PieChart data={biosampleChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Experiments')}</Typography.Title>
            {(!message && experimentChartData.length) ? (
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

export default SearchResults;
