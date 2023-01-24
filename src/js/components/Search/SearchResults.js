import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { AiOutlineExperiment } from 'react-icons/ai';
import { BiDna } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

import BentoPie from '../Overview/charts/BentoPie';
import CustomEmpty from '../Util/CustomEmpty';

import { CHART_HEIGHT } from '../../constants/overviewConstants';

const SearchResults = () => {
  const { t } = useTranslation();

  const { status, count, message } = useSelector((state) => state.query.queryResponseData);
  const isFetchingData = useSelector((state) => state.query.isFetchingData);
  const isValid = useSelector((state) => state.query.isValid);

  const biosampleCount = useSelector((state) => state.query.biosampleCount);
  const biosampleChartData = useSelector((state) => state.query.biosampleChartData);

  const experimentCount = useSelector((state) => state.query.experimentCount);
  const experimentChartData = useSelector((state) => state.query.experimentChartData);

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '475px',
  };

  return (
    <div style={wrapperStyle}>
      <Card 
        style={{ borderRadius: '10px', padding: '10px 33px', width: '1200px', minHeight: '28rem' }}
        loading={isFetchingData}>
        <Row gutter={16}>
          <Col span={4}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Statistic
                title={t('Individuals')}
                value={isValid ? (status === 'count' ? count : t(message)) : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title={t('Biosamples')}
                value={isValid && status === 'count' && biosampleCount ? biosampleCount : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BiDna />}
              />
              <Statistic
                title={t('Experiments')}
                value={isValid && status === 'count' && experimentCount ? experimentCount : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<AiOutlineExperiment />}
              />
            </Space>
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Biosamples')}</Typography.Title>
            {isValid && biosampleChartData && status === 'count' ? (
              <BentoPie data={biosampleChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty />
            )}
          </Col>
          <Col span={10}>
            <Typography.Title level={5}>{t('Experiments')}</Typography.Title>
            {isValid && experimentChartData && status === 'count' ? (
              <BentoPie data={experimentChartData} height={CHART_HEIGHT} sort={true} />
            ) : (
              <CustomEmpty />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SearchResults;
