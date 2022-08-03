import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const SearchResults = () => {
  const { status, count, message } = useSelector((state) => state.query.queryResponseData);
  const isValid = useSelector((state) => state.query.isValid);

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '150px',
  };

  return (
    <div style={wrapperStyle}>
      <Card style={{ borderRadius: '10px' }}>
        <Statistic
          title="Count"
          value={isValid ? (status === 'count' ? count : message) : '----'}
          valueStyle={{ color: '#1890ff' }}
          prefix={<TeamOutlined />}
        />
      </Card>
    </div>
  );
};

export default SearchResults;
