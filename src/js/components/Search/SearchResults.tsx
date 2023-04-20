import React from 'react';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

import { PieChart } from 'bento-charts';
import CustomEmpty from '../Util/CustomEmpty';
import ExpSvg from '../Util/ExpSvg';

import { CHART_HEIGHT, COUNTS_FILL } from '@/constants/overviewConstants';
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';

const SearchResults = () => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  const { status, count, message } = useAppSelector((state) => state.query.queryResponseData);
  const isFetchingData = useAppSelector((state) => state.query.isFetchingData);
  const isValid = useAppSelector((state) => state.query.isValid);

  const biosampleCount = useAppSelector((state) => state.query.biosampleCount);
  const biosampleChartData = useAppSelector((state) => state.query.biosampleChartData);

  const experimentCount = useAppSelector((state) => state.query.experimentCount);
  const experimentChartData = useAppSelector((state) => state.query.experimentChartData);

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
                value={isValid ? (status === 'count' ? count : t(message)) : '----'}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title={t('Biosamples')}
                value={isValid && status === 'count' && biosampleCount ? biosampleCount : '----'}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<BiDna />}
              />
              <Statistic
                title={t('Experiments')}
                value={isValid && status === 'count' && experimentCount ? experimentCount : '----'}
                valueStyle={{ color: COUNTS_FILL }}
                prefix={<ExpSvg />}
              />
            </Space>
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Biosamples')}</Typography.Title>
            {isValid && biosampleChartData && status === 'count' ? (
              <PieChart data={biosampleChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty text="No Results" />
            )}
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Experiments')}</Typography.Title>
            {isValid && experimentChartData && status === 'count' ? (
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