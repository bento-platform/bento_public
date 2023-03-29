import React from 'react';
import { Card, Col, Row, Statistic, Typography, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

// TODO: change results icon according to which entity requested

const BeaconQueryResults = ({ countResponse }) => {
  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '475px',
  };

  return (
    <div style={wrapperStyle}>
      <Card
        style={{ borderRadius: '10px', padding: '10px 33px', width: '1200px', minHeight: '28rem' }}
        // loading={isFetchingData}
      >
        <Statistic
          title={'Individuals'}
          value={countResponse}
          valueStyle={{ color: '#75787a' }}
          prefix={<TeamOutlined />}
        />
      </Card>
    </div>
  );
};

export default BeaconQueryResults;
