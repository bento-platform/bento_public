import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Col, Empty, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { AiOutlineExperiment } from 'react-icons/ai';
import { BiDna } from 'react-icons/bi';

import BentoPie from '../Overview/charts/BentoPie';

import { CHART_HEIGHT } from '../../constants/overviewConstants';

const SearchResults = () => {
  const { status, count, message } = useSelector((state) => state.query.queryResponseData);
  const isValid = useSelector((state) => state.query.isValid);

  const biosampleCount = useSelector((state) => state.query.biosampleCount);
  const biosampleChartData = useSelector((state) => state.query.biosampleChartData);

  const experimentCount = useSelector((state) => state.query.experimentCount);
  const experimentChartData = useSelector((state) => state.query.experimentChartData);

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '150px',
  };

  return (
    <div style={wrapperStyle}>
      <Card style={{ borderRadius: '10px', padding: '10px 33px', width: '900px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Statistic
                title="Individual Count"
                value={isValid ? (status === 'count' ? count : message) : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
              <Statistic
                title="Biosample Count"
                value={isValid && status === 'count' && biosampleCount ? biosampleCount : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BiDna />}
              />
              <Statistic
                title="Experiment Count"
                value={isValid && status === 'count' && experimentCount ? experimentCount : '----'}
                valueStyle={{ color: '#1890ff' }}
                prefix={<AiOutlineExperiment />}
              />
            </Space>
          </Col>
          <Col span={9}>
            <Typography.Title level={5}>Biosamples</Typography.Title>
            {isValid && biosampleChartData && status === 'count' ? (
              <BentoPie data={biosampleChartData} height={CHART_HEIGHT} />
            ) : (
              <Empty />
            )}
          </Col>
          <Col span={9}>
            <Typography.Title level={5}>Experiments</Typography.Title>
            {isValid && experimentChartData && status === 'count' ? (
              <BentoPie data={experimentChartData} height={CHART_HEIGHT} />
            ) : (
              <Empty />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SearchResults;
